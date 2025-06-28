const { users, posts } = require('../models/mockData');

const searchResolvers = {
  Query: {
    search: (parent, { query, pagination }) => {
      const searchTerm = query.toLowerCase();
      let results = [];

      // Search in posts
      const matchingPosts = posts
        .filter(post => post.published)
        .filter(post =>
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

      // Search in users
      const matchingUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.firstName?.toLowerCase().includes(searchTerm) ||
        user.lastName?.toLowerCase().includes(searchTerm) ||
        user.bio?.toLowerCase().includes(searchTerm)
      );

      // Combine results
      results = [...matchingPosts, ...matchingUsers];

      // Sort by relevance (simple scoring)
      results.sort((a, b) => {
        const aScore = calculateRelevanceScore(a, searchTerm);
        const bScore = calculateRelevanceScore(b, searchTerm);
        return bScore - aScore;
      });

      // Pagination
      const page = pagination?.page || 1;
      const limit = pagination?.limit || 10;
      const offset = (page - 1) * limit;
      
      return results.slice(offset, offset + limit);
    },
  },

  SearchResult: {
    __resolveType(obj) {
      if (obj.title) {
        return 'Post';
      }
      if (obj.username) {
        return 'User';
      }
      return null;
    },
  },
};

function calculateRelevanceScore(item, searchTerm) {
  let score = 0;
  
  if (item.title) {
    // It's a post
    if (item.title.toLowerCase().includes(searchTerm)) score += 10;
    if (item.content.toLowerCase().includes(searchTerm)) score += 5;
    if (item.excerpt.toLowerCase().includes(searchTerm)) score += 7;
    if (item.tags.some(tag => tag.toLowerCase().includes(searchTerm))) score += 8;
  } else if (item.username) {
    // It's a user
    if (item.username.toLowerCase().includes(searchTerm)) score += 10;
    if (item.firstName?.toLowerCase().includes(searchTerm)) score += 8;
    if (item.lastName?.toLowerCase().includes(searchTerm)) score += 8;
    if (item.bio?.toLowerCase().includes(searchTerm)) score += 5;
  }
  
  return score;
}

module.exports = searchResolvers;
