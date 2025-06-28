# GraphQL API with Apollo Server

A comprehensive GraphQL API built with Apollo Server demonstrating modern GraphQL patterns, query optimization, schema design, and resolver implementation. This project showcases a complete social media/blog platform API with user authentication, post management, comments, and real-time features.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Apollo Server](https://img.shields.io/badge/Apollo%20Server-4.x-purple.svg)](https://www.apollographql.com/)
[![GraphQL](https://img.shields.io/badge/GraphQL-16.x-pink.svg)](https://graphql.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://docker.com/)

## 🚀 Features

- **Complete GraphQL Schema**: Users, Posts, Comments with relationships
- **Authentication & Authorization**: JWT-based authentication system
- **Input Validation**: Comprehensive validation using Joi
- **Query Optimization**: DataLoader for efficient data fetching
- **Real-time Subscriptions**: WebSocket support for live updates
- **Docker Support**: Containerized deployment
- **Dynamic Host Detection**: Automatic network interface detection
- **GraphQL Playground**: Interactive API explorer
- **Mock Database**: In-memory data for testing and development

## 📋 Table of Contents

- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Docker Deployment](#-docker-deployment)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)

## 🛠 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (optional, for containerized deployment)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/willy4opera/GraphQL-API-with-Apollo-Server.git
   cd GraphQL-API-with-Apollo-Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start and display all available network addresses:
```
🚀 Server ready at
  - http://127.0.0.1:4000/graphql
  - http://localhost:4000/graphql
  - http://192.168.1.100:4000/graphql
📊 GraphQL Playground available at
  - http://localhost:4000/graphql
🔍 Health check available at
  - http://localhost:4000/health
```

## 🚀 Quick Start

### 1. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 2. Access GraphQL Playground

Open your browser and navigate to `http://localhost:4000/graphql` to access the interactive GraphQL Playground.

### 3. Health Check

Verify the server is running:
```bash
curl http://localhost:4000/health
```

### 4. Example Queries

#### Register a new user
```graphql
mutation RegisterUser {
  register(input: {
    username: "johndoe"
    email: "john@example.com"
    password: "password123"
    firstName: "John"
    lastName: "Doe"
  }) {
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

#### Login
```graphql
mutation LoginUser {
  login(email: "john@example.com", password: "password123") {
    token
    user {
      id
      username
      email
    }
  }
}
```

#### Get posts with pagination
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
      author {
        username
        firstName
        lastName
      }
      tags
      createdAt
    }
    pagination {
      currentPage
      totalPages
      totalItems
      hasNextPage
    }
  }
}
```

## 🌐 Deployment

### Standard Server Deployment

1. **Prepare the server**
   ```bash
   # Install Node.js 18+ on your server
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and setup the project**
   ```bash
   git clone https://github.com/willy4opera/GraphQL-API-with-Apollo-Server.git
   cd GraphQL-API-with-Apollo-Server
   npm ci --production
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   nano .env
   ```

4. **Start with PM2 (recommended for production)**
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start the application
   pm2 start src/index.js --name "graphql-api"
   pm2 startup
   pm2 save
   ```

### Cloud Platform Deployment

#### Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-super-secret-key
git push heroku main
```

#### Railway
```bash
# Connect your GitHub repository to Railway
# Set environment variables in Railway dashboard
# Deploy automatically on push
```

#### DigitalOcean App Platform
```yaml
# app.yaml
name: graphql-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/GraphQL-API-with-Apollo-Server
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: JWT_SECRET
    value: your-super-secret-key
```

## 📚 API Documentation

### Authentication

For protected endpoints, include the JWT token in the Authorization header:

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "query { me { id username email } }"}'
```

### Schema Overview

- **User**: User management and authentication
- **Post**: Blog posts with tags and publishing
- **Comment**: Nested comments system
- **Search**: Global search across posts and users

### Complete Examples

See [docs/examples/queries.md](docs/examples/queries.md) for comprehensive query examples including:

- User registration and authentication
- CRUD operations for posts and comments
- Search functionality
- Like/unlike features
- Pagination and filtering

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server Configuration
PORT=4000
HOST=localhost
NODE_ENV=development

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# GraphQL Configuration
GRAPHQL_INTROSPECTION=true
GRAPHQL_PLAYGROUND=true
```

## 🐳 Docker Deployment

### Using Docker

1. **Build the image**
   ```bash
   docker build -t graphql-api .
   ```

2. **Run the container**
   ```bash
   docker run -p 4000:4000 \
     -e NODE_ENV=production \
     -e JWT_SECRET=your-secret-key \
     graphql-api
   ```

### Using Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Docker Environment Variables

```yaml
# docker-compose.yml
environment:
  - NODE_ENV=production
  - HOST=0.0.0.0
  - PORT=4000
  - JWT_SECRET=your-production-jwt-secret
```

## 🧪 Testing

### Manual Testing

1. **Start the server**
   ```bash
   npm start
   ```

2. **Test health endpoint**
   ```bash
   curl http://localhost:4000/health
   ```

3. **Test GraphQL endpoint**
   ```bash
   curl -X POST http://localhost:4000/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "query { posts { posts { id title } } }"}'
   ```

### Using GraphQL Playground

1. Navigate to `http://localhost:4000/graphql`
2. Use the interactive query builder
3. Explore the schema documentation
4. Test mutations and queries

## 📁 Project Structure

```
GraphQL-API-with-Apollo-Server/
├── src/
│   ├── schema/
│   │   └── typeDefs.js          # GraphQL schema definitions
│   ├── resolvers/
│   │   ├── index.js             # Combined resolvers
│   │   ├── userResolvers.js     # User-related resolvers
│   │   ├── postResolvers.js     # Post-related resolvers
│   │   ├── commentResolvers.js  # Comment-related resolvers
│   │   └── searchResolvers.js   # Search functionality
│   ├── models/
│   │   └── mockData.js          # Mock database (in-memory)
│   ├── utils/
│   │   ├── auth.js              # Authentication utilities
│   │   ├── validation.js        # Input validation schemas
│   │   ├── dataLoaders.js       # DataLoader for optimization
│   │   └── hostDetector.js      # Network interface detection
│   └── index.js                 # Main server file
├── docs/
│   └── examples/
│       └── queries.md           # Query examples
├── Dockerfile                   # Docker configuration
├── docker-compose.yml          # Docker Compose setup
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🗄️ Database Information

**Important**: This project uses a **mock in-memory database** for demonstration purposes. The data includes:

- **3 sample users** with hashed passwords
- **4 sample posts** (3 published, 1 draft)
- **3 sample comments** with nested replies
- All data is reset when the server restarts

### Mock Data Structure

```javascript
// Sample users
users = [
  { username: 'john_doe', email: 'john@example.com', password: 'password123' },
  { username: 'jane_smith', email: 'jane@example.com', password: 'password123' },
  { username: 'tech_guru', email: 'guru@example.com', password: 'password123' }
]

// Sample posts with GraphQL, UI Design, and Node.js content
// Sample comments with realistic interactions
```

### Production Database Integration

To use with a real database (MongoDB, PostgreSQL, etc.):

1. Replace `src/models/mockData.js` with database models
2. Update resolvers to use database operations
3. Add database connection configuration
4. Update DataLoaders for database optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License. See the LICENSE file for details.

## 👥 Authors

- **ODIONYE OBIAJULU WILLIAMS** - [GitHub Profile](https://github.com/willy4opera)

## 🙏 Acknowledgments

- Apollo Server team for the excellent GraphQL server
- GraphQL community for best practices and patterns
- Contributors and testers

## 📞 Support

For support and questions:

- 📧 Email: icare@williamsobi.com.ng
- 🌐 Website: [Williamsobi.com.ng](https://Williamsobi.com.ng)
- 📱 Phone: +234 803 075 6350
- 🐛 Issues: [GitHub Issues](https://github.com/willy4opera/GraphQL-API-with-Apollo-Server/issues)
- 📖 Documentation: [GraphQL Docs](https://graphql.org/learn/)
- 🚀 Apollo Server: [Apollo Docs](https://www.apollographql.com/docs/apollo-server/)

---

**⭐ Star this repository if you found it helpful!**
