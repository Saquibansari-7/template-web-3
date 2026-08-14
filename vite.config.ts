import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const injectSupabaseEnv = {
  name: 'inject-supabase-env',
  transformIndexHtml(html: string) {
    const env = loadEnv('', process.cwd(), ['VITE_']);
    const url = typeof env.VITE_PUBLIC_SUPABASE_URL === 'string' ? env.VITE_PUBLIC_SUPABASE_URL.trim() : '';
    const key = typeof env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY === 'string' ? env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim() : '';
    if (url || key) console.log('[vite] injecting supabase env into index.html');
    return html.replace(/%SUPABASE_URL%/g, url).replace(/%SUPABASE_KEY%/g, key);
  },
};

// Dev-only middleware so the admin works under `npm run dev` exactly like the
// production server: serves /data from data.json and accepts /api/update-data.
const devDataApi = {
  name: 'dev-data-api',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const root = server.config.root || process.cwd();

      if (req.url?.startsWith('/data') && req.method === 'GET') {
        const file = path.join(root, 'data.json');
        if (fs.existsSync(file)) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(fs.readFileSync(file, 'utf8'));
          return;
        }
        next();
        return;
      }

      if (req.url?.startsWith('/api/update-data') && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => (body += chunk));
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body || '{}');
            const websiteContent = parsed.content || parsed;
            const existing = fs.existsSync(path.join(root, 'data.json'))
              ? JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'))
              : {};
            const flat = {
              ...existing,
              weddingDate:
                websiteContent?.countdown?.targetDate || websiteContent?.hero?.date || existing.weddingDate,
              texts: {
                ...existing.texts,
                welcome: websiteContent?.quote?.text || websiteContent?.texts?.welcome || existing.texts?.welcome || '',
                story:
                  [websiteContent?.story?.paragraph1, websiteContent?.story?.paragraph2]
                    .filter(Boolean)
                    .join('\n\n') || existing.texts?.story || '',
                hashtag: websiteContent?.couple?.hashtag || existing.texts?.hashtag || '',
              },
              images: {
                ...existing.images,
                couple: websiteContent?.hero?.image || existing.images?.couple || '',
                story: websiteContent?.story?.image || existing.images?.story || '',
                final: websiteContent?.invitationCard?.image || existing.images?.final || '',
                menu: websiteContent?.events?.menuImage || existing.images?.menu || '',
              },
              locationCoords:
                websiteContent?.events?.ceremony?.mapCoords || existing.locationCoords || null,
              ceremony: {
                ...existing.ceremony,
                location: websiteContent?.events?.ceremony?.venue || existing.ceremony?.location || '',
                address: websiteContent?.events?.ceremony?.location || existing.ceremony?.address || '',
                time: websiteContent?.events?.ceremony?.time || existing.ceremony?.time || '',
              },
              reception: {
                ...existing.reception,
                location: websiteContent?.events?.reception?.venue || existing.reception?.location || '',
                address: websiteContent?.events?.reception?.location || existing.reception?.address || '',
                time: websiteContent?.events?.reception?.time || existing.reception?.time || '',
              },
              timeline: Array.isArray(websiteContent?.timeline)
                ? websiteContent.timeline
                : existing.timeline || [],
              frontNames: `${websiteContent?.couple?.name1 || ''} & ${websiteContent?.couple?.name2 || ''}`,
              endNames: `${websiteContent?.couple?.name1 || ''} & ${websiteContent?.couple?.name2 || ''}`,
              entourage: {
                parents: websiteContent?.entourage?.parents || existing.entourage?.parents || '',
                sponsors: websiteContent?.entourage?.sponsors || existing.entourage?.sponsors || '',
                maidOfHonor: websiteContent?.entourage?.maidOfHonor || existing.entourage?.maidOfHonor || '',
                bestMan: websiteContent?.entourage?.bestMan || existing.entourage?.bestMan || '',
              },
              footer: {
                ...existing.footer,
                text: websiteContent?.footer?.text || existing.footer?.text || '',
                image: websiteContent?.footer?.image || existing.footer?.image || '',
                date: websiteContent?.footer?.date || existing.footer?.date || '',
                tagline: websiteContent?.footer?.tagline || existing.footer?.tagline || '',
                socials: websiteContent?.footer?.socials || existing.footer?.socials || { instagram: '', x: '', facebook: '' },
              },
              rsvp: websiteContent?.rsvp || existing.rsvp || { heading: '', deadline: '', whatsapp: '' },
              gallery: websiteContent?.gallery || existing.gallery || { enabled: false, images: [] },
              saveTheDate: websiteContent?.saveTheDate || existing.saveTheDate || { heading: '', quote: '' },
              hero: {
                ...existing.hero,
                subtitle: websiteContent?.hero?.subtitle || existing.hero?.subtitle || '',
                date: websiteContent?.hero?.date || existing.hero?.date || '',
                location: websiteContent?.hero?.location || existing.hero?.location || '',
                image: websiteContent?.hero?.image || existing.hero?.image || '',
              },
              events: {
                ...existing.events,
                ceremony: {
                  ...existing.events?.ceremony,
                  time: websiteContent?.events?.ceremony?.time || existing.events?.ceremony?.time || '',
                  venue: websiteContent?.events?.ceremony?.venue || existing.events?.ceremony?.venue || '',
                  location: websiteContent?.events?.ceremony?.location || existing.events?.ceremony?.location || '',
                  mapCoords:
                    websiteContent?.events?.ceremony?.mapCoords ||
                    existing.events?.ceremony?.mapCoords || { latitude: '', longitude: '' },
                },
                reception: {
                  ...existing.events?.reception,
                  time: websiteContent?.events?.reception?.time || existing.events?.reception?.time || '',
                  venue: websiteContent?.events?.reception?.venue || existing.events?.reception?.venue || '',
                  location: websiteContent?.events?.reception?.location || existing.events?.reception?.location || '',
                },
                mapLocation:
                  websiteContent?.events?.mapLocation ||
                  existing.events?.mapLocation || { address: '', city: '', region: '', mapUrl: '' },
                menuImage: websiteContent?.events?.menuImage || existing.events?.menuImage || '',
              },
            };
            fs.writeFileSync(path.join(root, 'data.json'), JSON.stringify(flat, null, 2));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: e?.message || 'write failed' }));
          }
        });
        return;
      }

      next();
    });
  },
};

export default defineConfig({
  plugins: [react(), injectSupabaseEnv, devDataApi],
  build: {
    outDir: 'dist',
  },
});
