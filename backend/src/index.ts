import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createYoga } from 'graphql-yoga';
import { schema } from './schema';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for local development
app.use('/*', cors());

// Create GraphQL Yoga instance
app.use('/graphql', async (c) => {
  const yoga = createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    landingPage: true,
    context: {
      db: c.env.DB,
    },
  });

  return yoga.handle(c.req.raw, {});
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
