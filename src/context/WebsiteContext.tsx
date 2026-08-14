import { createContext, useContext } from 'react';
import { WebsiteContent } from '../types';

export const defaultContent: WebsiteContent = {
  couple: {
    name1: 'Isabel',
    name2: 'Kevin',
    hashtag: '#Isabel&Kevin',
  },
  hero: {
    subtitle: 'We are getting married',
    date: '2026-08-22T11:00',
    location: '',
    image: '',
  },
  saveTheDate: {
    heading: 'Save the Date',
    quote: '',
  },
  countdown: {
    targetDate: '2026-08-22T11:00',
    heading: '',
  },
  story: {
    heading: 'Our Love Story',
    paragraph1:
      'It started with a chance encounter at a coffee shop, where Isabel ordered a tea and Kevin spilled his coffee. Nervous laughter turned into a conversation that lasted for hours, and we haven\'t stopped talking since.',
    paragraph2:
      'Through travels, late-night study sessions, and building a home together, our bond only grew stronger. We realized that we weren\'t just partners; we were best friends ready to take on the world together.\n\nThree years later, under a canopy of autumn leaves, Kevin got down on one knee. With tears of joy and a resounding "Yes!", we began this beautiful journey toward our wedding day.',
    image: '',
  },
  events: {
    ceremony: {
      time: '11:00 AM',
      venue: 'The Grand Chapel',
      location: '123 Love Avenue, City of Romance',
      mapCoords: undefined,
    },
    reception: {
      time: '1:00 PM onwards',
      venue: 'The Rose Garden Estate',
      location: '456 Sunset Blvd, City of Romance',
      mapCoords: undefined,
    },
    mapLocation: {
      address: '',
      city: '',
      region: '',
      mapUrl: '',
    },
    menuImage: '',
  },
  gallery: {
    enabled: false,
    images: [],
  },
  quote: {
    text: 'Two souls with but a single thought, two hearts that beat as one.',
    author: '',
  },
  rsvp: {
    heading: '',
    deadline: '',
    whatsapp: '',
  },
  entourage: {
    parents: '',
    sponsors: '',
    maidOfHonor: '',
    bestMan: '',
  },
  footer: {
    date: '',
    tagline: '',
    socials: {
      instagram: '',
      x: '',
      facebook: '',
    },
    image: '',
    text: '',
  },
  invitationCard: {
    image: '',
  },
  timeline: [
    { event: 'Ceremony', description: 'Exchange of vows and rings', time: '10:00 AM', icon: 'fas fa-church' },
    { event: 'Cocktails', description: 'Drinks and canapes by the garden', time: '12:00 PM', icon: 'fas fa-cocktail' },
    { event: 'Lunch & Program', description: 'Feast, speeches, and dancing', time: '1:00 PM', icon: 'fas fa-utensils' },
    { event: 'Cake Cutting', description: 'Sweet beginnings', time: '3:30 PM', icon: 'fas fa-birthday-cake' },
    { event: 'Farewell', description: 'Grand exit send-off', time: '5:00 PM', icon: 'fas fa-door-open' },
  ],
};

interface WebsiteContextValue {
  content: WebsiteContent;
  setContent: (content: WebsiteContent) => void;
}

export const WebsiteContext = createContext<WebsiteContextValue>({
  content: defaultContent,
  setContent: () => {},
});

export const useWebsite = () => useContext(WebsiteContext);
