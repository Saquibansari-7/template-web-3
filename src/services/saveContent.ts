import { supabase } from '../lib/supabase';
import { WebsiteContent, SectionSettings } from '../types';
import { normalizeImage } from '../utils/imageUrl';

export async function saveContent(siteId: string, content: WebsiteContent, sections: SectionSettings) {
  if (import.meta.env.DEV) console.log('saveContent - siteId:', siteId);

  const normalizedContent: WebsiteContent = {
    ...content,
    hero: { ...content.hero, image: normalizeImage(content.hero.image) },
    story: { ...content.story, image: normalizeImage(content.story.image) },
    invitationCard: { ...content.invitationCard, image: normalizeImage(content.invitationCard.image) },
    gallery: { ...content.gallery, images: content.gallery.images.map(normalizeImage) },
  };

  // Primary: persist to data.json (the public site's source of truth) via the
  // local API. This keeps admin edits visible on the live site immediately.
  try {
    const res = await fetch('/api/update-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: normalizedContent }),
    });
    if (import.meta.env.DEV) console.log('saveContent - /api/update-data status:', res.status);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      if (import.meta.env.DEV) console.warn('saveContent - /api/update-data failed:', text.slice(0, 200));
    }
  } catch (err) {
    if (import.meta.env.DEV) console.warn('saveContent - /api/update-data error:', err);
  }

  // Secondary: also mirror to Supabase when configured (best effort).
  if (supabase && typeof supabase.from === 'function') {
    try {
      const result = await supabase
        .from('site_content')
        .upsert({
          site_id: siteId,
          data: {
            ...normalizedContent,
            sections,
          },
          updated_at: new Date().toISOString(),
        });
      if (import.meta.env.DEV) console.log('saveContent - supabase result:', result);
      if (result.error) {
        if (import.meta.env.DEV) console.warn('saveContent - supabase error:', result.error.message);
      }
    } catch (err) {
      if (import.meta.env.DEV) console.warn('saveContent - supabase error:', err);
    }
  }

  return { ok: true };
}
