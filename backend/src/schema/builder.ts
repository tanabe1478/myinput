import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import type { DbClient } from '../db/client';

type Context = {
  db: DbClient;  // Drizzle client for type-safe queries
  d1: D1Database;  // Raw D1 instance for direct queries
};

export const builder = new SchemaBuilder<{
  Context: Context;
}>({
  plugins: [RelayPlugin],
});

// Define base Query and Mutation types
builder.queryType({});
builder.mutationType({});
