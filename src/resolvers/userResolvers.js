const { users, posts, comments } = require('../models/mockData');
const { validateInput, createUserSchema, updateUserSchema, loginSchema } = require('../utils/validation');
const { hashPassword, comparePassword, generateToken, requireAuth } = require('../utils/auth');
const { v4: uuidv4 } = require('uuid');
const slug = require('slug');

const userResolvers = {
  Query: {
    me: (parent, args, context) => {
      const authUser = requireAuth(context);
      return users.find(user => user.id === authUser.userId);
    },

    user: (parent, { id }) => {
      const user = users.find(user => user.id === id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    },

    users: (parent, { filter, pagination }) => {
      let filteredUsers = [...users];

      // Apply search filter
      if (filter?.search) {
        const searchTerm = filter.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user =>
          user.username.toLowerCase().includes(searchTerm) ||
          user.firstName?.toLowerCase().includes(searchTerm) ||
          user.lastName?.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }

      // Pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;
      const totalItems = filteredUsers.length;
      const totalPages = Math.ceil(totalItems / limit);
      const paginatedUsers = filteredUsers.slice(offset, offset + limit);

      return {
        users: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    },
  },

  Mutation: {
    register: async (parent, { input }) => {
      // Validate input
      const validatedInput = validateInput(createUserSchema, input);

      // Check if user already exists
      const existingUser = users.find(
        user => user.email === validatedInput.email || user.username === validatedInput.username
      );
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedInput.password);

      // Create new user
      const newUser = {
        id: uuidv4(),
        username: validatedInput.username,
        email: validatedInput.email,
        password: hashedPassword,
        firstName: validatedInput.firstName || null,
        lastName: validatedInput.lastName || null,
        avatar: null,
        bio: validatedInput.bio || null,
        followers: [],
        following: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users.push(newUser);

      // Generate token
      const token = generateToken(newUser.id);

      return {
        token,
        user: newUser,
      };
    },

    login: async (parent, { email, password }) => {
      // Validate input
      const validatedInput = validateInput(loginSchema, { email, password });

      // Find user
      const user = users.find(user => user.email === validatedInput.email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await comparePassword(validatedInput.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = generateToken(user.id);

      return {
        token,
        user,
      };
    },

    updateProfile: (parent, { input }, context) => {
      const authUser = requireAuth(context);
      
      // Validate input
      const validatedInput = validateInput(updateUserSchema, input);

      // Find user
      const userIndex = users.findIndex(user => user.id === authUser.userId);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Check if username/email is taken by another user
      if (validatedInput.username || validatedInput.email) {
        const conflictUser = users.find(user => 
          user.id !== authUser.userId && 
          (user.username === validatedInput.username || user.email === validatedInput.email)
        );
        if (conflictUser) {
          throw new Error('Username or email already taken');
        }
      }

      // Update user
      users[userIndex] = {
        ...users[userIndex],
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      return users[userIndex];
    },

    followUser: (parent, { userId }, context) => {
      const authUser = requireAuth(context);

      if (authUser.userId === userId) {
        throw new Error('You cannot follow yourself');
      }

      const currentUser = users.find(user => user.id === authUser.userId);
      const targetUser = users.find(user => user.id === userId);

      if (!targetUser) {
        throw new Error('User not found');
      }

      // Check if already following
      if (currentUser.following.includes(userId)) {
        throw new Error('You are already following this user');
      }

      // Add to following/followers
      currentUser.following.push(userId);
      targetUser.followers.push(authUser.userId);

      return targetUser;
    },

    unfollowUser: (parent, { userId }, context) => {
      const authUser = requireAuth(context);

      const currentUser = users.find(user => user.id === authUser.userId);
      const targetUser = users.find(user => user.id === userId);

      if (!targetUser) {
        throw new Error('User not found');
      }

      // Remove from following/followers
      currentUser.following = currentUser.following.filter(id => id !== userId);
      targetUser.followers = targetUser.followers.filter(id => id !== authUser.userId);

      return targetUser;
    },
  },

  User: {
    posts: (parent) => {
      return posts.filter(post => post.authorId === parent.id);
    },

    comments: (parent) => {
      return comments.filter(comment => comment.authorId === parent.id);
    },

    followers: (parent) => {
      return users.filter(user => parent.followers.includes(user.id));
    },

    following: (parent) => {
      return users.filter(user => parent.following.includes(user.id));
    },
  },
};

module.exports = userResolvers;
