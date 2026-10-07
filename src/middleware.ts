import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url);
  if (url.hostname === 'www.creamfile.com') {
    url.hostname = 'creamfile.com';
    return Response.redirect(url.toString(), 301);
  }
  const response = await next();
  const { pathname } = url;
  if (!pathname.startsWith('/_astro/') && !pathname.startsWith('/fonts/')) {
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'public, max-age=0, s-maxage=300');
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
  return response;
});
