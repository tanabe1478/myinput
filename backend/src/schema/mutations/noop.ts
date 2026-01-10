import { builder } from '../builder';

// Placeholder mutation - GraphQL requires at least one field in Mutation type
builder.mutationField('noop', (t) =>
  t.string({
    resolve: () => {
      return 'ok';
    },
  })
);
