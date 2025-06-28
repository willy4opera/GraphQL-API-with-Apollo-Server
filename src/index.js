const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginLandingPageLocalDefault } = require('@apollo/server/plugin/landingPage/default');
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { json } = require('body-parser');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const { getUser } = require('./utils/auth');
const { createLoaders } = require('./utils/dataLoaders');
const { getBindAddress, generateServerUrls } = require('./utils/hostDetector');

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      // Enable GraphQL Playground in development
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    introspection: true, // Enable introspection
  });

  await server.start();
  
  // Middleware
  app.use(helmet({ 
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // Disable CSP for GraphQL Playground
  }));
  app.use(cors());
  app.use(morgan('dev'));
  
  // GraphQL endpoint
  app.use('/graphql', 
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        const user = getUser({ token });
        const loaders = createLoaders();
        
        return {
          token,
          user,
          loaders,
        };
      },
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'GraphQL API is running' });
  });

  // Start server
  const PORT = process.env.PORT || 4000;
  const bindAddress = getBindAddress();
  httpServer.listen(PORT, bindAddress, () => {
    const serverUrls = generateServerUrls(PORT);
    console.log('🚀 Server ready at');
    serverUrls.all.forEach(url => console.log(`  - ${url}/graphql`));
    console.log('📊 GraphQL Playground available at');
    serverUrls.all.forEach(url => console.log(`  - ${url}/graphql`));
    console.log('🔍 Health check available at');
    serverUrls.all.forEach(url => console.log(`  - ${url}/health`));
  });
};

startServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});
