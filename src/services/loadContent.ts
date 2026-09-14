import { WebsiteContent } from '../types';
import { normalizeImage } from '../utils/imageUrl';
import { defaultContent } from '../context/WebsiteContext';
import { resolveSite, type SiteRow } from '../lib/siteResolver';
import { supabase } from '../lib/supabase';

function mergeDeep<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = mergeDeep(tgtVal as any, srcVal as any);
    } else {
      result[key] = srcVal as any;
    }
  }
  return result;
}

export async function loadContent(siteId: string) {
  if (!supabase || typeof supabase.from !== 'function') {
    const err = new Error('Supabase not configured - check your .env file');
    if (import.meta.env.DEV) console.error('[loadContent]', err.message);
    throw err;
  }
  const { data, error } = await supabase
    .from('site_content')
    .select('data')
    .eq('site_id', siteId)
    .single();

  if (error) {
    if (import.meta.env.DEV) console.error('[loadContent] Supabase error:', error);
    throw error;
  }

  const raw = data?.data as Partial<WebsiteContent> | undefined;
  if (!raw) return null;

  const hero = raw.hero ?? { subtitle: '', date: '', location: '', image: '' };
  const story = raw.story ?? { heading: '', paragraph1: '', paragraph2: '', image: '' };
  const invitationCard = raw.invitationCard ?? { image: '' };
  const gallery = raw.gallery ?? { enabled: false, images: [] };

  const sanitized: WebsiteContent = {
    ...raw,
    couple: raw.couple ?? { name1: '', name2: '', hashtag: '' },
    hero: { ...hero, image: normalizeImage(hero.image) },
    saveTheDate: raw.saveTheDate ?? { heading: '', quote: '' },
    countdown: raw.countdown ?? { targetDate: '', heading: '' },
    story: { ...story, image: normalizeImage(story.image) },
    events: raw.events ?? {
      ceremony: { time: '', venue: '', location: '', mapCoords: { latitude: '', longitude: '' } },
      reception: { time: '', venue: '', location: '', mapCoords: { latitude: '', longitude: '' } },
      mapLocation: { address: '', city: '', region: '', mapUrl: '' },
      menuImage: '',
    },
    gallery: { ...gallery, images: Array.isArray(gallery.images) ? gallery.images.map(normalizeImage) : [] },
    quote: raw.quote ?? { text: '', author: '' },
    rsvp: raw.rsvp ?? { heading: '', deadline: '', whatsapp: '' },
    entourage: raw.entourage ?? { parents: '', sponsors: '', maidOfHonor: '', bestMan: '' },
    footer: raw.footer ?? { date: '', tagline: '', socials: { instagram: '', x: '', facebook: '' }, image: '', text: '' },
    invitationCard: { ...invitationCard, image: normalizeImage(invitationCard.image) },
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
  };

  if (import.meta.env.DEV) {
    console.log('[loadContent] FINAL heroImage:', sanitized.hero.image);
    console.log('[loadContent] FINAL storyImage:', sanitized.story.image);
    console.log('[loadContent] FINAL invitationImage:', sanitized.invitationCard.image);
  }
  return sanitized;
}

export interface LoadContentByCustomerResult {
  site: SiteRow;
  content: WebsiteContent;
}

export async function loadContentByCustomer(customer: string): Promise<LoadContentByCustomerResult | null> {
  const url = import.meta.env.VITE_PUBLIC_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) return null;

  const site = await resolveSite(customer, url, key);
  if (!site || !site.data) return null;

  const raw = site.data as Partial<WebsiteContent>;
  const merged = mergeDeep(defaultContent, raw);

  const sanitized: WebsiteContent = {
    ...merged,
    hero: { ...merged.hero, image: normalizeImage(merged.hero.image) },
    story: { ...merged.story, image: normalizeImage(merged.story.image) },
    invitationCard: { ...merged.invitationCard, image: normalizeImage(merged.invitationCard.image) },
    gallery: { ...merged.gallery, images: Array.isArray(merged.gallery.images) ? merged.gallery.images.map(normalizeImage) : [] },
  };

  return { site, content: sanitized };
}

