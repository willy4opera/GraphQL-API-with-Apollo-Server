const { users, posts } = require('../models/mockData');

const searchResolvers = {
  Query: {
    search: (parent, { query, pagination }) => {
      const searchTerm = query.toLowerCase();

      // Search in posts (only published ones)
      const matchingPosts = posts
        .filter(post => post.published)
        .filter(post =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.excerpt?.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

      // Search in users
      const matchingUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.firstName?.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.bio?.toLowerCase().includes(searchTerm)
      );

      // Apply pagination to each result set
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;
      
      // For simplicity, we'll apply pagination to the combined count
      // but return separate arrays
      const totalCount = matchingPosts.length + matchingUsers.length;
      
      return {
        posts: matchingPosts.slice(0, Math.ceil(limit / 2)),
        users: matchingUsers.slice(0, Math.floor(limit / 2)),
        totalCount: totalCount,
      };
    },
  },
};

module.exports = searchResolvers;
