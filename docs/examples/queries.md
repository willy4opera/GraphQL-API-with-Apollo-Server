# GraphQL API Query Examples

## Authentication Queries

### Register a new user
```graphql
mutation RegisterUser {
  register(input: {
    username: "johndoe"
    email: "john@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
    bio: "Software developer"
  }) {
    token
    user {
      id
      username
      email
      firstName
      lastName
      bio
      createdAt
    }
  }
}
```

### Login
```graphql
mutation LoginUser {
  login(email: "john@example.com", password: "password123") {
    token
    user {
      id
      username
      email
      firstName
      lastName
    }
  }
}
```

### Get current user profile
```graphql
query GetMyProfile {
  me {
    id
    username
    email
    firstName
    lastName
    bio
    avatar
    followers {
      id
      username
    }
    following {
      id
      username
    }
    posts {
      id
      title
      excerpt
      published
      createdAt
    }
  }
}
```

## Post Queries

### Get all posts with pagination
```graphql
query GetPosts {
  posts(
    filter: { published: true }
    sort: { field: CREATED_AT, order: DESC }
    pagination: { page: 1, limit: 10 }
  ) {
    posts {
      id
      title
      excerpt
      slug
      author {
        id
        username
        firstName
        lastName
      }
      tags
      likes {
        id
        username
      }
      createdAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
      hasNextPage
      hasPreviousPage
    }
  }
}
```

### Get a single post
```graphql
query GetPost {
  post(slug: "getting-started-with-graphql") {
    id
    title
    content
    excerpt
    author {
      id
      username
      firstName
      lastName
      avatar
    }
    comments {
      id
      content
      author {
        id
        username
      }
      replies {
        id
        content
        author {
          id
          username
        }
      }
      createdAt
    }
    tags
    likes {
      id
      username
    }
    createdAt
    updatedAt
  }
}
```

### Create a new post
```graphql
mutation CreatePost {
  createPost(input: {
    title: "My New Blog Post"
    content: "This is the content of my new blog post..."
    excerpt: "A brief description of the post"
    tags: ["GraphQL", "API", "JavaScript"]
    published: true
  }) {
    id
    title
    content
    excerpt
    slug
    author {
      id
      username
    }
    tags
    published
    createdAt
  }
}
```

## Comment Queries

### Get comments for a post
```graphql
query GetComments {
  comments(postId: "post-id-here", pagination: { page: 1, limit: 20 }) {
    id
    content
    author {
      id
      username
      avatar
    }
    replies {
      id
      content
      author {
        id
        username
      }
      createdAt
    }
    likes {
      id
      username
    }
    createdAt
  }
}
```

### Create a comment
```graphql
mutation CreateComment {
  createComment(input: {
    content: "This is a great post! Thanks for sharing."
    postId: "post-id-here"
  }) {
    id
    content
    author {
      id
      username
    }
    post {
      id
      title
    }
    createdAt
  }
}
```

### Reply to a comment
```graphql
mutation ReplyToComment {
  createComment(input: {
    content: "Thanks for your comment!"
    postId: "post-id-here"
    parentCommentId: "parent-comment-id-here"
  }) {
    id
    content
    author {
      id
      username
    }
    parentComment {
      id
      content
    }
    createdAt
  }
}
```

## Search Queries

### Search for posts and users
```graphql
query SearchContent {
  search(query: "GraphQL", pagination: { page: 1, limit: 10 }) {
    posts {
      id
      title
      excerpt
      author {
        username
      }
      tags
    }
    users {
      id
      username
      firstName
      lastName
      bio
    }
    totalCount
  }
}
```
query SearchContent {
  search(query: "GraphQL", pagination: { page: 1, limit: 10 }) {
    ... on Post {
      id
      title
      excerpt
      author {
        id
        username
      }
      tags
    }
    ... on User {
      id
      username
      firstName
      lastName
      bio
    }
  }
}
```

## User Interaction Queries

### Follow a user
```graphql
mutation FollowUser {
  followUser(userId: "user-id-here") {
    id
    username
    followers {
      id
      username
    }
  }
}
```

### Like a post
```graphql
mutation LikePost {
  likePost(id: "post-id-here") {
    id
    title
    likes {
      id
      username
    }
  }
}
```

### Update profile
```graphql
mutation UpdateProfile {
  updateProfile(input: {
    firstName: "John"
    lastName: "Doe"
    bio: "Updated bio"
    avatar: "https://example.com/avatar.jpg"
  }) {
    id
    username
    firstName
    lastName
    bio
    avatar
    updatedAt
  }
}
```

## Headers for Authenticated Requests

For queries that require authentication, include the JWT token in the Authorization header:

```json
{
  "Authorization": "Bearer your-jwt-token-here"
}
```
