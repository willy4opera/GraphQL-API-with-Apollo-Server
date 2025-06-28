const userResolvers = require('./userResolvers');
const postResolvers = require('./postResolvers');
const commentResolvers = require('./commentResolvers');
const searchResolvers = require('./searchResolvers');

// Merge all resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...commentResolvers.Query,
    ...searchResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  User: userResolvers.User,
  Post: postResolvers.Post,
  Comment: commentResolvers.Comment,
  SearchResult: searchResolvers.SearchResult,
};

module.exports = resolvers;
