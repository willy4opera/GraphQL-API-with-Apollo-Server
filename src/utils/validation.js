const Joi = require('joi');

// User validation schemas
const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  bio: Joi.string().max(500).optional(),
});

const updateUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().optional(),
});

// Post validation schemas
const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().min(1).required(),
  excerpt: Joi.string().max(300).optional(),
  tags: Joi.array().items(Joi.string().min(1).max(50)).max(10).optional(),
  published: Joi.boolean().optional(),
});

const updatePostSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  content: Joi.string().min(1).optional(),
  excerpt: Joi.string().max(300).optional(),
  tags: Joi.array().items(Joi.string().min(1).max(50)).max(10).optional(),
  published: Joi.boolean().optional(),
});

// Comment validation schemas
const createCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  postId: Joi.string().required(),
  parentCommentId: Joi.string().optional(),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Pagination validation schema
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

// Validation middleware function
const validateInput = (schema, input) => {
  const { error, value } = schema.validate(input, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    throw new Error(`Validation Error: ${errorMessages.join(', ')}`);
  }
  
  return value;
};

module.exports = {
  createUserSchema,
  updateUserSchema,
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema,
  loginSchema,
  paginationSchema,
  validateInput,
};
