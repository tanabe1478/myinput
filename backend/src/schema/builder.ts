import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';

type Context = {
  db: D1Database;
};

export const builder = new SchemaBuilder<{
  Context: Context;
}>({
  plugins: [RelayPlugin],
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
});

// Define base Query and Mutation types
builder.queryType({});
builder.mutationType({});
