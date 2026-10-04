import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ request }, next) => {
  const url = new URL(request.url);
  if (url.hostname === 'www.creamfile.com') {
    url.hostname = 'creamfile.com';
    return Response.redirect(url.toString(), 301);
  }
  return next();
});
