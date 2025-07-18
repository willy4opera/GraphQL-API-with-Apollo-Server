const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Mock database
const users = [
  {
    id: uuidv4(),
    username: 'john_doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Software developer and tech enthusiast',
    followers: [],
    following: [],
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: uuidv4(),
    username: 'jane_smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056b8e4?w=150',
    bio: 'UI/UX Designer passionate about creating beautiful experiences',
    followers: [],
    following: [],
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: uuidv4(),
    username: 'tech_guru',
    email: 'guru@example.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Alex',
    lastName: 'Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Full-stack developer and technology consultant',
    followers: [],
    following: [],
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-02-01').toISOString(),
  },
];

const posts = [
  {
    id: uuidv4(),
    title: 'Getting Started with GraphQL',
    content: 'GraphQL is a powerful query language for APIs that provides a complete and understandable description of the data in your API...',
    excerpt: 'Learn the basics of GraphQL and how to implement it in your applications.',
    slug: 'getting-started-with-graphql',
    authorId: users[0].id,
    tags: ['GraphQL', 'API', 'JavaScript'],
    published: true,
    likes: [],
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date('2024-02-15').toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Modern UI Design Principles',
    content: 'User interface design has evolved significantly over the years. Modern UI design focuses on simplicity, accessibility, and user experience...',
    excerpt: 'Explore the key principles that guide modern user interface design.',
    slug: 'modern-ui-design-principles',
    authorId: users[1].id,
    tags: ['UI Design', 'UX', 'Design'],
    published: true,
    likes: [],
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Building Scalable APIs with Node.js',
    content: 'Node.js has become a popular choice for building APIs due to its performance and scalability. In this post, we will explore best practices...',
    excerpt: 'Best practices for building scalable and maintainable APIs using Node.js.',
    slug: 'building-scalable-apis-nodejs',
    authorId: users[2].id,
    tags: ['Node.js', 'API', 'Backend', 'JavaScript'],
    published: true,
    likes: [],
    createdAt: new Date('2024-02-25').toISOString(),
    updatedAt: new Date('2024-02-25').toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Draft: Future of Web Development',
    content: 'This is a draft post about the future trends in web development...',
    excerpt: 'A look into the future trends and technologies in web development.',
    slug: 'future-of-web-development',
    authorId: users[0].id,
    tags: ['Web Development', 'Future', 'Technology'],
    published: false,
    likes: [],
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
  },
];

const comments = [];

// Initialize comments after posts are created
const comment1 = {
  id: uuidv4(),
  content: 'Great introduction to GraphQL! Very helpful for beginners.',
  authorId: users[1].id,
  postId: posts[0].id,
  parentCommentId: null,
  likes: [],
  createdAt: new Date('2024-02-16').toISOString(),
  updatedAt: new Date('2024-02-16').toISOString(),
};

const comment2 = {
  id: uuidv4(),
  content: 'I agree! The examples really helped me understand the concepts.',
  authorId: users[2].id,
  postId: posts[0].id,
  parentCommentId: comment1.id,
  likes: [],
  createdAt: new Date('2024-02-17').toISOString(),
  updatedAt: new Date('2024-02-17').toISOString(),
};

const comment3 = {
  id: uuidv4(),
  content: 'These design principles are exactly what I needed for my current project.',
  authorId: users[0].id,
  postId: posts[1].id,
  parentCommentId: null,
  likes: [],
  createdAt: new Date('2024-02-21').toISOString(),
  updatedAt: new Date('2024-02-21').toISOString(),
};

comments.push(comment1, comment2, comment3);

module.exports = {
  users,
  posts,
  comments,
};
