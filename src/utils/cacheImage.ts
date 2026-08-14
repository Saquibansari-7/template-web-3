import { normalizeImage } from './imageUrl';

export function cacheBust(value: string): string {
  const url = normalizeImage(value || '').trim();
  if (!url) return url;
  return url.includes('?') ? `${url}&_=${Date.now()}` : `${url}?_=${Date.now()}`;
}
