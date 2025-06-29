const { gql } = require('graphql-tag');

const typeDefs = gql`
  # User type definition
  type User {
    id: ID!
    username: String!
    email: String!
    firstName: String
    lastName: String
    avatar: String
    bio: String
    posts: [Post!]!
    comments: [Comment!]!
    followers: [User!]!
    following: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  # Post type definition
  type Post {
    id: ID!
    title: String!
    content: String!
    excerpt: String
    slug: String!
    author: User!
    comments: [Comment!]!
    likes: [User!]!
    tags: [String!]!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  # Comment type definition
  type Comment {
    id: ID!
    content: String!
    author: User!
    post: Post!
    parentComment: Comment
    replies: [Comment!]!
    likes: [User!]!
    createdAt: String!
    updatedAt: String!
  }

  # Input types for mutations
  input CreateUserInput {
    username: String!
    email: String!
    password: String!
    firstName: String
    lastName: String
    bio: String
  }

  input UpdateUserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    bio: String
    avatar: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    excerpt: String
    tags: [String!]
    published: Boolean = false
  }

  input UpdatePostInput {
    title: String
    content: String
    excerpt: String
    tags: [String!]
    published: Boolean
  }

  input CreateCommentInput {
    content: String!
    postId: ID!
    parentCommentId: ID
  }

  input UpdateCommentInput {
    content: String!
  }

  # Filter and sorting inputs
  input PostFilter {
    published: Boolean
    authorId: ID
    tags: [String!]
    search: String
  }

  input UserFilter {
    search: String
  }

  enum SortOrder {
    ASC
    DESC
  }

  input PostSort {
    field: PostSortField!
    order: SortOrder = DESC
  }

  enum PostSortField {
    CREATED_AT
    UPDATED_AT
    TITLE
    LIKES_COUNT
  }

  # Pagination
  input PaginationInput {
    page: Int = 1
    limit: Int = 10
  }

  type PaginationInfo {
    currentPage: Int!
    totalPages: Int!
    totalItems: Int!
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type PostConnection {
    posts: [Post!]!
    pagination: PaginationInfo!
  }

  type UserConnection {
    users: [User!]!
    pagination: PaginationInfo!
  }

  # Authentication response
  type AuthPayload {
    token: String!
    user: User!
  }

  # Query type
  type Query {
    # User queries
    me: User
    user(id: ID!): User
    users(filter: UserFilter, pagination: PaginationInput): UserConnection!
    
    # Post queries
    post(id: ID, slug: String): Post
    posts(filter: PostFilter, sort: PostSort, pagination: PaginationInput): PostConnection!
    popularPosts(limit: Int = 5): [Post!]!
    
    # Comment queries
    comments(postId: ID!, pagination: PaginationInput): [Comment!]!
    
    # Search
    search(query: String!, pagination: PaginationInput): SearchResults!
  }

  # Search result union type
  type SearchResults {
    posts: [Post!]!
    users: [User!]!
    totalCount: Int!
  }

  # Mutation type
  type Mutation {
    # Authentication
    register(input: CreateUserInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # User mutations
    updateProfile(input: UpdateUserInput!): User!
    followUser(userId: ID!): User!
    unfollowUser(userId: ID!): User!
    
    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post!
    deletePost(id: ID!): Boolean!
    likePost(id: ID!): Post!
    unlikePost(id: ID!): Post!
    
    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, input: UpdateCommentInput!): Comment!
    deleteComment(id: ID!): Boolean!
    likeComment(id: ID!): Comment!
    unlikeComment(id: ID!): Comment!
  }

  # Subscription type for real-time features
  type Subscription {
    postAdded: Post!
    commentAdded(postId: ID!): Comment!
    userFollowed(userId: ID!): User!
  }
`;

module.exports = typeDefs;
