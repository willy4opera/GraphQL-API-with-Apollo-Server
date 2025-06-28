const DataLoader = require('dataloader');
const { users, posts, comments } = require('../models/mockData');

// User loaders
const createUserLoader = () => {
  return new DataLoader(async (userIds) => {
    console.log('Batch loading users:', userIds);
    return userIds.map(id => users.find(user => user.id === id) || null);
  });
};

const createUsersByIdsLoader = () => {
  return new DataLoader(async (userIdArrays) => {
    console.log('Batch loading user arrays:', userIdArrays);
    return userIdArrays.map(userIds => 
      users.filter(user => userIds.includes(user.id))
    );
  });
};

// Post loaders
const createPostLoader = () => {
  return new DataLoader(async (postIds) => {
    console.log('Batch loading posts:', postIds);
    return postIds.map(id => posts.find(post => post.id === id) || null);
  });
};

const createPostsByAuthorLoader = () => {
  return new DataLoader(async (authorIds) => {
    console.log('Batch loading posts by authors:', authorIds);
    return authorIds.map(authorId => 
      posts.filter(post => post.authorId === authorId)
    );
  });
};

// Comment loaders
const createCommentLoader = () => {
  return new DataLoader(async (commentIds) => {
    console.log('Batch loading comments:', commentIds);
    return commentIds.map(id => comments.find(comment => comment.id === id) || null);
  });
};

const createCommentsByPostLoader = () => {
  return new DataLoader(async (postIds) => {
    console.log('Batch loading comments by posts:', postIds);
    return postIds.map(postId => 
      comments.filter(comment => comment.postId === postId)
    );
  });
};

const createCommentsByAuthorLoader = () => {
  return new DataLoader(async (authorIds) => {
    console.log('Batch loading comments by authors:', authorIds);
    return authorIds.map(authorId => 
      comments.filter(comment => comment.authorId === authorId)
    );
  });
};

const createCommentRepliesLoader = () => {
  return new DataLoader(async (parentCommentIds) => {
    console.log('Batch loading comment replies:', parentCommentIds);
    return parentCommentIds.map(parentId => 
      comments.filter(comment => comment.parentCommentId === parentId)
    );
  });
};

// Create all loaders
const createLoaders = () => ({
  userLoader: createUserLoader(),
  usersByIdsLoader: createUsersByIdsLoader(),
  postLoader: createPostLoader(),
  postsByAuthorLoader: createPostsByAuthorLoader(),
  commentLoader: createCommentLoader(),
  commentsByPostLoader: createCommentsByPostLoader(),
  commentsByAuthorLoader: createCommentsByAuthorLoader(),
  commentRepliesLoader: createCommentRepliesLoader(),
});

module.exports = { createLoaders };
