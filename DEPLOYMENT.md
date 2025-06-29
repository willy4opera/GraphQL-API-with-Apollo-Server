# 🚀 Production Deployment Guide

This guide provides step-by-step instructions for deploying the GraphQL API with Apollo Server to any production environment using Docker.

## 📋 Prerequisites

- **Docker**: Version 20.10 or higher
- **Git**: For cloning the repository
- **Server**: Linux-based server with Docker support

## 🔧 Installation Steps

### Step 1: Install Docker

Choose your platform and follow the instructions:

#### Ubuntu/Debian
```bash
# Update system packages
sudo apt-get update

# Install required packages
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Add Docker repository
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Update package index
sudo apt-get update

# Install Docker CE
sudo apt-get install -y docker-ce

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (optional)
sudo usermod -aG docker $USER
```

#### CentOS/RHEL
```bash
# Update system
sudo yum update -y

# Install required packages
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# Add Docker repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker
sudo yum install -y docker-ce

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### Other Platforms
Visit [Docker Official Installation Guide](https://docs.docker.com/get-docker/)

### Step 2: Verify Docker Installation

```bash
# Check Docker version
docker --version

# Test Docker installation
docker run hello-world
```

### Step 3: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/willy4opera/GraphQL-API-with-Apollo-Server.git

# Navigate to project directory
cd GraphQL-API-with-Apollo-Server
```

### Step 4: Build Docker Image

```bash
# Build the Docker image
docker build -t graphql-api .
```

Expected output:
```
Successfully built [image-id]
Successfully tagged graphql-api:latest
```

### Step 5: Run the Application

```bash
# Run the container
docker run -d \
  --name graphql-api \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-super-secret-production-key-change-this \
  --restart unless-stopped \
  graphql-api
```

### Step 6: Verify Deployment

```bash
# Check if container is running
docker ps

# Test health endpoint
curl http://localhost:4000/health

# Expected response:
# {"status":"OK","message":"GraphQL API is running"}
```

### Step 7: Test GraphQL Endpoint

```bash
# Test GraphQL query
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { posts { posts { id title author { username } } } }"}'
```

## 🌐 Access Your API

- **GraphQL Playground**: `http://your-server-ip:4000/graphql`
- **Health Check**: `http://your-server-ip:4000/health`
- **API Endpoint**: `http://your-server-ip:4000/graphql`

## 🔧 Configuration Options

### Environment Variables

Customize your deployment with environment variables:

```bash
docker run -d \
  --name graphql-api \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  -e PORT=4000 \
  -e CORS_ORIGIN=* \
  -e GRAPHQL_INTROSPECTION=true \
  -e GRAPHQL_PLAYGROUND=true \
  --restart unless-stopped \
  graphql-api
```

### Custom Port

To run on a different port:

```bash
# Run on port 8080
docker run -d \
  --name graphql-api \
  -p 8080:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  graphql-api
```

## 🐳 Docker Compose Deployment

For easier management, use Docker Compose:

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  graphql-api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=your-super-secret-production-key
      - PORT=4000
      - HOST=0.0.0.0
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Deploy with:

```bash
# Start the application
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop the application
docker-compose -f docker-compose.prod.yml down
```

## 🔍 Monitoring and Maintenance

### View Logs

```bash
# View container logs
docker logs graphql-api

# Follow logs in real-time
docker logs -f graphql-api
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild image
docker build -t graphql-api .

# Stop current container
docker stop graphql-api
docker rm graphql-api

# Start new container
docker run -d \
  --name graphql-api \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret-key \
  --restart unless-stopped \
  graphql-api
```

### Container Management

```bash
# Start container
docker start graphql-api

# Stop container
docker stop graphql-api

# Restart container
docker restart graphql-api

# Remove container
docker rm graphql-api

# Remove image
docker rmi graphql-api
```

## 🔒 Security Considerations

1. **Change JWT Secret**: Always use a strong, unique JWT secret in production
2. **Firewall**: Configure firewall to allow only necessary ports
3. **HTTPS**: Use a reverse proxy (nginx, Apache) with SSL/TLS
4. **Updates**: Regularly update Docker and the application
5. **Monitoring**: Implement logging and monitoring solutions

## 🚨 Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs graphql-api

# Check if port is already in use
sudo netstat -tulpn | grep :4000

# Check Docker daemon status
sudo systemctl status docker
```

### Application Not Accessible

```bash
# Check if container is running
docker ps

# Check firewall settings
sudo ufw status

# Test from server
curl http://localhost:4000/health
```

### Performance Issues

```bash
# Check container resource usage
docker stats graphql-api

# Check system resources
htop
df -h
```

## 📊 Production Checklist

- [ ] Docker installed and running
- [ ] Repository cloned
- [ ] Docker image built successfully
- [ ] Container running without errors
- [ ] Health check endpoint responding
- [ ] GraphQL endpoint functional
- [ ] Environment variables configured
- [ ] Firewall rules configured
- [ ] Monitoring set up
- [ ] Backup strategy implemented

## 🎯 Quick Deploy Script

Save this as `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting GraphQL API deployment..."

# Clone repository
echo "📥 Cloning repository..."
git clone https://github.com/willy4opera/GraphQL-API-with-Apollo-Server.git
cd GraphQL-API-with-Apollo-Server

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t graphql-api .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop graphql-api 2>/dev/null || true
docker rm graphql-api 2>/dev/null || true

# Run new container
echo "🏃 Starting new container..."
docker run -d \
  --name graphql-api \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=$(openssl rand -base64 32) \
  --restart unless-stopped \
  graphql-api

# Verify deployment
echo "✅ Verifying deployment..."
sleep 5
curl -f http://localhost:4000/health

echo "🎉 Deployment complete!"
echo "🌐 Access your API at: http://$(curl -s ifconfig.me):4000/graphql"
```

Make it executable and run:

```bash
chmod +x deploy.sh
./deploy.sh
```

## 📞 Support

For deployment issues:
- 📧 Email: icare@williamsobi.com.ng
- 🐛 Issues: [GitHub Issues](https://github.com/willy4opera/GraphQL-API-with-Apollo-Server/issues)
