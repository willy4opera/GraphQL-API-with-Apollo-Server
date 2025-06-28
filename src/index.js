const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { json } = require('body-parser');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./resolvers');
const { getUser } = require('./utils/auth');

const startServer = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  // Apollo Server setup
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  
  // Middleware
  app.use(helmet({ crossOriginEmbedderPolicy: false }));
  app.use(cors());
  app.use(morgan('dev'));
  
  // GraphQL endpoint
  app.use('/graphql', 
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        token: req.headers.authorization,
        user: getUser({ token: req.headers.authorization }),
      }),
    })
  );

  // Start server
  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`📊 GraphQL Playground available at http://localhost:${PORT}/graphql`);
  });
};

startServer().catch(error => {
  console.error('Error starting server:', error);
  process.exit(1);
});
