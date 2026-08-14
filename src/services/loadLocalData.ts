import { WebsiteContent } from '../types';
import { defaultContent } from '../context/WebsiteContext';
import type { MapLocation, Rsvp, Socials } from '../types';

interface LegacyContent {
  weddingDate: string;
  texts?: { welcome?: string; story?: string; hashtag?: string };
  images?: { couple?: string; story?: string; final?: string; menu?: string };
  ceremony?: { location?: string; address?: string; time?: string };
  reception?: { location?: string; address?: string; time?: string };
  entourage?: { parents?: string; sponsors?: string; maidOfHonor?: string; bestMan?: string };
  timeline?: WebsiteContent['timeline'];
  frontNames?: string;
  endNames?: string;
  locationCoords?: { latitude?: string; longitude?: string };
  footer?: {
    text?: string;
    image?: string;
    date?: string;
    tagline?: string;
    socials?: Socials;
  };
  rsvp?: Rsvp;
  gallery?: { enabled?: boolean; images?: string[] };
  saveTheDate?: { heading?: string; quote?: string };
  hero?: { subtitle?: string; date?: string; location?: string; image?: string };
  events?: {
    ceremony?: { time?: string; venue?: string; location?: string; mapCoords?: { latitude?: string; longitude?: string } };
    reception?: { time?: string; venue?: string; location?: string };
    mapLocation?: MapLocation;
    menuImage?: string;
  };
}

function splitNames(value?: string): [string, string] {
  const raw = (value || '').trim();
  if (raw.includes('&') || raw.includes('and')) {
    const sep = raw.includes('&') ? '&' : 'and';
    const parts = raw.split(sep).map((s) => s.trim());
    if (parts.length >= 2) return [parts[0], parts[1]];
  }
  return [defaultContent.couple.name1, defaultContent.couple.name2];
}

function mapToContent(raw: LegacyContent): WebsiteContent {
  const [name1, name2] = splitNames(raw.frontNames);
  const storyParts = (raw.texts?.story || '').split('\n\n').map((s) => s.trim()).filter(Boolean);
  const parents = (raw.entourage?.parents || '').split('/').map((s) => s.trim()).filter(Boolean);
  const sponsors = (raw.entourage?.sponsors || '').split(',').map((s) => s.trim()).filter(Boolean);

  return {
    ...defaultContent,
    couple: {
      name1,
      name2,
      hashtag: raw.texts?.hashtag || defaultContent.couple.hashtag,
    },
    hero: {
      ...defaultContent.hero,
      subtitle: raw.hero?.subtitle || defaultContent.hero.subtitle,
      date: raw.hero?.date || raw.weddingDate || defaultContent.hero.date,
      location: raw.hero?.location || raw.ceremony?.address || '',
      image: raw.images?.couple || '',
    },
    saveTheDate: {
      ...defaultContent.saveTheDate,
      heading: raw.saveTheDate?.heading || 'Save the Date',
      quote: raw.saveTheDate?.quote || '',
    },
    countdown: {
      ...defaultContent.countdown,
      targetDate: raw.weddingDate || defaultContent.countdown.targetDate,
    },
    quote: {
      text: raw.texts?.welcome || defaultContent.quote.text,
      author: '',
    },
    story: {
      ...defaultContent.story,
      paragraph1: storyParts[0] || defaultContent.story.paragraph1,
      paragraph2: storyParts.slice(1).join('\n\n') || defaultContent.story.paragraph2,
      image: raw.images?.story || '',
    },
    events: {
      ceremony: {
        time: (raw.events?.ceremony?.time || raw.ceremony?.time || '').trim() || defaultContent.events.ceremony.time,
        venue: (raw.events?.ceremony?.venue || raw.ceremony?.location || '').trim() || defaultContent.events.ceremony.venue,
        location: (raw.events?.ceremony?.location || raw.ceremony?.address || '').trim() || defaultContent.events.ceremony.location,
        mapCoords: {
          latitude: raw.events?.ceremony?.mapCoords?.latitude || raw.locationCoords?.latitude || '',
          longitude: raw.events?.ceremony?.mapCoords?.longitude || raw.locationCoords?.longitude || '',
        },
      },
      reception: {
        time: (raw.events?.reception?.time || raw.reception?.time || '').trim() || defaultContent.events.reception.time,
        venue: (raw.events?.reception?.venue || raw.reception?.location || '').trim() || defaultContent.events.reception.venue,
        location: (raw.events?.reception?.location || raw.reception?.address || '').trim() || defaultContent.events.reception.location,
      },
      mapLocation: raw.events?.mapLocation || defaultContent.events.mapLocation,
      menuImage: raw.events?.menuImage || raw.images?.menu || '',
    },
    gallery: raw.gallery && Array.isArray(raw.gallery.images)
      ? { enabled: !!raw.gallery.enabled, images: raw.gallery.images }
      : defaultContent.gallery,
    rsvp: raw.rsvp || defaultContent.rsvp,
    entourage: {
      parents: parents.join(' / ') || defaultContent.entourage.parents,
      sponsors: sponsors.join(', ') || defaultContent.entourage.sponsors,
      maidOfHonor: raw.entourage?.maidOfHonor || defaultContent.entourage.maidOfHonor,
      bestMan: raw.entourage?.bestMan || defaultContent.entourage.bestMan,
    },
    footer: {
      ...defaultContent.footer,
      text: raw.footer?.text || '',
      image: raw.footer?.image || raw.images?.final || '',
      date: raw.footer?.date || '',
      tagline: raw.footer?.tagline || '',
      socials: raw.footer?.socials || defaultContent.footer.socials,
    },
    invitationCard: {
      image: raw.images?.final || '',
    },
    timeline: Array.isArray(raw.timeline) ? raw.timeline : defaultContent.timeline,
  };
}

export async function loadLocalData(): Promise<WebsiteContent | null> {
  try {
    const res = await fetch('/data');
    if (!res.ok) return null;
    const text = await res.text();
    const json = JSON.parse(text) as LegacyContent;
    return mapToContent(json);
  } catch {
    return null;
  }
}
