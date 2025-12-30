import { builder } from '../builder';

// Health check query
builder.queryField('health', (t) =>
  t.string({
    resolve: () => {
      return 'ok';
    },
  })
);
