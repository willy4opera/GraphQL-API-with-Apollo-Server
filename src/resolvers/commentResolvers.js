const { users, posts, comments } = require('../models/mockData');
const { validateInput, createCommentSchema, updateCommentSchema } = require('../utils/validation');
const { requireAuth } = require('../utils/auth');
const { v4: uuidv4 } = require('uuid');

const commentResolvers = {
  Query: {
    comments: (parent, { postId, pagination }) => {
      let postComments = comments.filter(comment => comment.postId === postId);

      // Only return top-level comments (no parent)
      postComments = postComments.filter(comment => !comment.parentCommentId);

      // Pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;
      
      return postComments.slice(offset, offset + limit);
    },
  },

  Mutation: {
    createComment: (parent, { input }, context) => {
      const authUser = requireAuth(context);

      // Validate input
      const validatedInput = validateInput(createCommentSchema, input);

      // Check if post exists
      const post = posts.find(post => post.id === validatedInput.postId);
      if (!post || !post.published) {
        throw new Error('Post not found or not published');
      }

      // Check if parent comment exists (if provided)
      if (validatedInput.parentCommentId) {
        const parentComment = comments.find(
          comment => comment.id === validatedInput.parentCommentId
        );
        if (!parentComment) {
          throw new Error('Parent comment not found');
        }
      }

      const newComment = {
        id: uuidv4(),
        content: validatedInput.content,
        authorId: authUser.userId,
        postId: validatedInput.postId,
        parentCommentId: validatedInput.parentCommentId || null,
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      comments.push(newComment);
      return newComment;
    },

    updateComment: (parent, { id, input }, context) => {
      const authUser = requireAuth(context);

      // Validate input
      const validatedInput = validateInput(updateCommentSchema, input);

      // Find comment
      const commentIndex = comments.findIndex(
        comment => comment.id === id && comment.authorId === authUser.userId
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found or you are not the author');
      }

      // Update comment
      comments[commentIndex] = {
        ...comments[commentIndex],
        content: validatedInput.content,
        updatedAt: new Date().toISOString(),
      };

      return comments[commentIndex];
    },

    deleteComment: (parent, { id }, context) => {
      const authUser = requireAuth(context);

      const commentIndex = comments.findIndex(
        comment => comment.id === id && comment.authorId === authUser.userId
      );

      if (commentIndex === -1) {
        throw new Error('Comment not found or you are not the author');
      }

      // Remove comment and all its replies
      const commentToDelete = comments[commentIndex];
      const commentsToRemove = [commentToDelete.id];
      
      // Find all nested replies
      const findReplies = (parentId) => {
        const replies = comments.filter(comment => comment.parentCommentId === parentId);
        replies.forEach(reply => {
          commentsToRemove.push(reply.id);
          findReplies(reply.id);
        });
      };
      
      findReplies(commentToDelete.id);

      // Remove all comments
      commentsToRemove.forEach(commentId => {
        const index = comments.findIndex(comment => comment.id === commentId);
        if (index !== -1) {
          comments.splice(index, 1);
        }
      });

      return true;
    },

    likeComment: (parent, { id }, context) => {
      const authUser = requireAuth(context);

      const comment = comments.find(comment => comment.id === id);

      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.likes.includes(authUser.userId)) {
        throw new Error('You already liked this comment');
      }

      comment.likes.push(authUser.userId);
      return comment;
    },

    unlikeComment: (parent, { id }, context) => {
      const authUser = requireAuth(context);

      const comment = comments.find(comment => comment.id === id);

      if (!comment) {
        throw new Error('Comment not found');
      }

      comment.likes = comment.likes.filter(userId => userId !== authUser.userId);
      return comment;
    },
  },

  Comment: {
    author: (parent) => {
      return users.find(user => user.id === parent.authorId);
    },

    post: (parent) => {
      return posts.find(post => post.id === parent.postId);
    },

    parentComment: (parent) => {
      if (!parent.parentCommentId) return null;
      return comments.find(comment => comment.id === parent.parentCommentId);
    },

    replies: (parent) => {
      return comments.filter(comment => comment.parentCommentId === parent.id);
    },

    likes: (parent) => {
      return users.filter(user => parent.likes.includes(user.id));
    },
  },
};

module.exports = commentResolvers;
