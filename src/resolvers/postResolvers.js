const { users, posts, comments } = require('../models/mockData');
const { validateInput, createPostSchema, updatePostSchema } = require('../utils/validation');
const { requireAuth } = require('../utils/auth');
const { v4: uuidv4 } = require('uuid');
const { default: slug } = require('slug');

const postResolvers = {
  Query: {
    post: (parent, { id, slug }) => {
      let post;
      if (id) {
        post = posts.find(post => post.id === id);
      } else if (slug) {
        post = posts.find(post => post.slug === slug);
      }

      if (!post || !post.published) {
        throw new Error('Post not found or not published');
      }

      return post;
    },

    posts: (parent, { filter, sort, pagination }) => {
      let filteredPosts = posts.filter(post => post.published);

      // Apply filters
      if (filter) {
        if (filter.authorId) {
          filteredPosts = filteredPosts.filter(
            post => post.authorId === filter.authorId
          );
        }
        if (filter.tags) {
          filteredPosts = filteredPosts.filter(post =>
            filter.tags.every(tag => post.tags.includes(tag))
          );
        }
        if (filter.search) {
          const searchTerm = filter.search.toLowerCase();
          filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.excerpt.toLowerCase().includes(searchTerm)
          );
        }
      }

      // Apply sorting
      if (sort) {
        const { field, order } = sort;
        filteredPosts.sort((a, b) => {
          if (a[field] > b[field]) return order === 'ASC' ? 1 : -1;
          if (a[field] < b[field]) return order === 'ASC' ? -1 : 1;
          return 0;
        });
      }

      // Pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;
      const totalItems = filteredPosts.length;
      const totalPages = Math.ceil(totalItems / limit);
      const paginatedPosts = filteredPosts.slice(offset, offset + limit);

      return {
        posts: paginatedPosts,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    },

    popularPosts: (parent, { limit = 5 }) => {
      const publishedPosts = posts.filter(post => post.published);
      return publishedPosts
        .sort((a, b) => b.likes.length - a.likes.length)
        .slice(0, limit);
    },
  },

  Mutation: {
    createPost: (parent, { input }, context) => {
      const authUser = requireAuth(context);

      // Validate input
      const validatedInput = validateInput(createPostSchema, input);
      const newPost = {
        id: uuidv4(),
        title: validatedInput.title,
        content: validatedInput.content,
        excerpt: validatedInput.excerpt || '',
        slug: slug(validatedInput.title),
        authorId: authUser.userId,
        comments: [],
        likes: [],
        tags: validatedInput.tags || [],
        published: validatedInput.published || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      posts.push(newPost);
      return newPost;
    },

    updatePost: (parent, { id, input }, context) => {
      const authUser = requireAuth(context);

      // Validate input
      const validatedInput = validateInput(updatePostSchema, input);

      // Find post
      const postIndex = posts.findIndex(
        (post) => post.id === id && post.authorId === authUser.userId
      );

      if (postIndex === -1) {
        throw new Error('Post not found or you are not the author');
      }

      // Update post
      posts[postIndex] = {
        ...posts[postIndex],
        ...validatedInput,
        slug: validatedInput.title ? slug(validatedInput.title) : posts[postIndex].slug,
        updatedAt: new Date().toISOString(),
      };

      return posts[postIndex];
    },

    deletePost: (parent, { id }, context) => {
      const authUser = requireAuth(context);

      const postIndex = posts.findIndex(
        (post) => post.id === id && post.authorId === authUser.userId
      );

      if (postIndex === -1) {
        throw new Error('Post not found or you are not the author');
      }

      posts.splice(postIndex, 1);
      return true;
    },

    likePost: (parent, { id }, context) => {
      const authUser = requireAuth(context);

      const post = posts.find(
        (post) => post.id === id && post.published
      );

      if (!post) {
        throw new Error('Post not found or not published');
      }

      if (post.likes.includes(authUser.userId)) {
        throw new Error('You already liked this post');
      }

      post.likes.push(authUser.userId);
      return post;
    },

    unlikePost: (parent, { id }, context) => {
      const authUser = requireAuth(context);

      const post = posts.find(
        (post) => post.id === id && post.published
      );

      if (!post) {
        throw new Error('Post not found or not published');
      }

      post.likes = post.likes.filter((userId) => userId !== authUser.userId);
      return post;
    },
  },

  Post: {
    author: (parent) => {
      return users.find(user => user.id === parent.authorId);
    },

    comments: (parent) => {
      return comments.filter(comment => comment.postId === parent.id);
    },

    likes: (parent) => {
      return users.filter(user => parent.likes.includes(user.id));
    },
  },
};

module.exports = postResolvers;
