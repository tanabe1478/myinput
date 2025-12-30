import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Health Check', () => {
  describe('REST endpoint', () => {
    it('should return ok status', async () => {
      const req = new Request('http://localhost/health');
      const res = await app.fetch(req, { DB: {} as D1Database });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.status).toBe('ok');
      expect(body.timestamp).toBeDefined();
      expect(typeof body.timestamp).toBe('string');
    });
  });

  describe('GraphQL endpoint', () => {
    it('should return ok from health query', async () => {
      const req = new Request('http://localhost/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '{ health }',
        }),
      });

      const res = await app.fetch(req, { DB: {} as D1Database });

      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.data).toBeDefined();
      expect(body.data.health).toBe('ok');
      expect(body.errors).toBeUndefined();
    });

    it('should handle GraphQL errors gracefully', async () => {
      const req = new Request('http://localhost/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '{ nonExistentField }',
        }),
      });

      const res = await app.fetch(req, { DB: {} as D1Database });

      expect(res.status).toBe(200); // GraphQL returns 200 even with errors

      const body = await res.json();
      expect(body.errors).toBeDefined();
      expect(body.errors.length).toBeGreaterThan(0);
    });
  });
});
