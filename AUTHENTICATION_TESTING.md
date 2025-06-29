## 🧪 Testing Authentication Workflow

### Step 1: Register a user
curl -X POST http://77.37.121.27:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation RegisterUser { register(input: { username: \"demo2025\", email: \"demo2025@example.com\", password: \"demopassword\", firstName: \"Demo\", lastName: \"User\" }) { token user { id username email } } }"
  }'

### Step 2: Login to get a fresh token
curl -X POST http://77.37.121.27:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation LoginUser { login(email: \"demo2025@example.com\", password: \"demopassword\") { token user { id username email } } }"
  }'

### Step 3: Use the token for authenticated requests
# Replace TOKEN_HERE with the actual token from step 2
curl -X POST http://77.37.121.27:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "query": "mutation CreatePost { createPost(input: { title: \"Demo Post\", content: \"This post was created using authentication\", published: true }) { id title content author { username } } }"
  }'

### Step 4: Test the 'me' query to verify authentication
curl -X POST http://77.37.121.27:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_HERE" \
  -d '{
    "query": "query GetMyProfile { me { id username email firstName lastName } }"
  }'
