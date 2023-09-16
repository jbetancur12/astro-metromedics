export function onRequest (request, next) {
console.log("🚀 ~ file: middleware.ts:2 ~ onRequest ~ request:", request.url)






  // intercept response data from a request
  // optionally, transform the response by modifying `locals`

  // return a Response or the result of calling `next()`
  return next();
};

export const config = {
  // Use a regex to match routes starting with /dashboard/
  matcher: /^\/dashboard\//,
};
