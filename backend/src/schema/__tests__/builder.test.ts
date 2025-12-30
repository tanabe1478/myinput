import { describe, it, expect } from 'vitest';
import { builder } from '../builder';
import { schema } from '../index';

describe('GraphQL Schema', () => {
  it('should build a valid schema', () => {
    expect(schema).toBeDefined();
    expect(schema.getQueryType()).toBeDefined();
    expect(schema.getMutationType()).toBeDefined();
  });

  it('should have Query type with health field', () => {
    const queryType = schema.getQueryType();
    expect(queryType).toBeDefined();

    const fields = queryType!.getFields();
    expect(fields.health).toBeDefined();
    expect(fields.health.type.toString()).toBe('String');
  });

  it('should have Mutation type with noop field', () => {
    const mutationType = schema.getMutationType();
    expect(mutationType).toBeDefined();

    const fields = mutationType!.getFields();
    expect(fields.noop).toBeDefined();
    expect(fields.noop.type.toString()).toBe('String');
  });
});
