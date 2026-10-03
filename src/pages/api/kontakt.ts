import type { APIRoute } from 'astro';

export const POST: APIRoute = () => {
  return new Response(JSON.stringify({ error: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
};
