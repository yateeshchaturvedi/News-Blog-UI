const fallbackSiteUrl = 'https://news-blog-ui.vercel.app';

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/+$/, '');
}

export function toAbsoluteUrl(path: string) {
  const normalizedPath = normalizeCanonicalPath(path);
  return `${getSiteUrl()}${normalizedPath}`;
}

export function normalizeCanonicalPath(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const noHash = normalizedPath.split('#')[0];
  const noQuery = noHash.split('?')[0];
  if (noQuery === '/') return '/';
  return noQuery.replace(/\/+$/, '');
}
