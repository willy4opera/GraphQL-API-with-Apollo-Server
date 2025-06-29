## 🧪 Sample Authentication Process

### Step 1: Register a user
curl -X POST http://demo-api.example.com:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RegisterUser { register(input: { username: \"demo2025\", email: \"demo2025@example.com\", password: \"demopassword\", firstName: \"Demo\", lastName: \"User\" }) { token user { id username email } } }"
  }'

### Step 2: Login to get a fresh token
curl -X POST http://demo-api.example.com:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation LoginUser { login(email: \"demo2025@example.com\", password: \"demopassword\") { token user { id username email } } }"
  }'

### Step 3: Use the token for authenticated requests
# Replace TOKEN_HERE with the actual token from step 2
curl -X POST http://demo-api.example.com:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "query": "mutation CreatePost { createPost(input: { title: \"Demo Post\", content: \"This post was created using authentication\", published: true }) { id title content author { username } } }"
  }'

### Step 4: Test the 'me' query to verify authentication
curl -X POST http://demo-api.example.com:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "query": "query GetMyProfile { me { id username email firstName lastName } }"
  }'

## 🌐 Demo API Endpoints

### **Base URL:** http://demo-api.example.com:4000

- **GraphQL Endpoint:** http://demo-api.example.com:4000/graphql
- **GraphQL Playground:** http://demo-api.example.com:4000/graphql (Interactive UI)
- **Health Check:** http://demo-api.example.com:4000/health

### Quick Test Commands:

#### Test Health Endpoint:
```bash
curl http://demo-api.example.com:4000/health
```

#### Get All Posts:
```bash
curl -X POST http://demo-api.example.com:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { posts(pagination: { page: 1, limit: 3 }) { posts { id title author { username } } } }"}'
```

#### Search API:
```bash
curl -X POST http://demo-api.example.com:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { search(query: \"GraphQL\") { posts { title } users { username } totalCount } }"}'
```

### **Note:** 
Replace `demo-api.example.com` with your actual server IP or domain. For production deployment, follow our [deployment guide](DEPLOYMENT.md).
