import { builder } from './builder';

// Import query/mutation resolvers
import './queries/health';
import './mutations/noop';

// Build and export the schema
export const schema = builder.toSchema();
