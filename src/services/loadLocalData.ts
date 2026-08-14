import { WebsiteContent } from '../types';
import { defaultContent } from '../context/WebsiteContext';

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
  footer?: { text?: string; image?: string };
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
      date: raw.weddingDate || defaultContent.hero.date,
      location: raw.ceremony?.address || '',
      image: raw.images?.couple || '',
    },
    saveTheDate: {
      ...defaultContent.saveTheDate,
      heading: 'Save the Date',
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
        time: (raw.ceremony?.time || '').trim() || defaultContent.events.ceremony.time,
        venue: (raw.ceremony?.location || '').trim() || defaultContent.events.ceremony.venue,
        location: (raw.ceremony?.address || '').trim() || defaultContent.events.ceremony.location,
        mapCoords: {
          latitude: raw.locationCoords?.latitude || '',
          longitude: raw.locationCoords?.longitude || '',
        },
      },
      reception: {
        time: (raw.reception?.time || '').trim() || defaultContent.events.reception.time,
        venue: (raw.reception?.location || '').trim() || defaultContent.events.reception.venue,
        location: (raw.reception?.address || '').trim() || defaultContent.events.reception.location,
      },
      mapLocation: defaultContent.events.mapLocation,
      menuImage: raw.images?.menu || '',
    },
    gallery: defaultContent.gallery,
    rsvp: defaultContent.rsvp,
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
