import type { MetadataRoute } from 'next';

const BASE_URL = process.env.APP_URL || 'https://faizulfoundation.org';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/our-work',
    '/projects',
    '/request-help',
    '/support-us',
    '/contact',
    '/legal',
    '/privacy-policy',
    '/terms-and-conditions',
    '/disclaimer',
    '/data-protection',
    '/cookie-policy',
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' || route === '/our-work' || route === '/projects' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/request-help' ? 0.9 : 0.7,
  }));
}
