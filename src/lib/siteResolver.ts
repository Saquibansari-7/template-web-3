export interface SiteRow {
  id: string;
  subdomain: string;
  data?: Record<string, unknown> | null;
  template_id?: string;
  status?: string;
  [key: string]: unknown;
}

export async function resolveSite(customerSubdomain: string): Promise<SiteRow | null> {
  let subdomain = (customerSubdomain || '').trim().toLowerCase();
  if (!subdomain) return null;

  subdomain = subdomain.replace(/\/+$/, '');

  const safe = subdomain.replace(/[^a-z0-9-]/g, '');
  if (safe !== subdomain) {
    console.warn('[siteResolver] stripped invalid chars from subdomain:', subdomain, '->', safe);
    subdomain = safe;
  }
  if (!subdomain) return null;

  try {
    const res = await fetch(
      `https://weddappvows.vercel.app/api/site/lookup?customer=${encodeURIComponent(subdomain)}`,
    );

    if (!res.ok) {
      console.error('[siteResolver] HTTP', res.status, await res.text().catch(() => ''));
      return null;
    }

    const site = (await res.json()) as SiteRow;
    console.log('[siteResolver] site returned for', subdomain, ':', site?.id);
    return site ?? null;
  } catch (err) {
    console.error('[siteResolver] fetch failed:', err);
    return null;
  }
}
