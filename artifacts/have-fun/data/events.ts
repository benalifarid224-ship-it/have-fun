import { ImageSourcePropType } from 'react-native';

export type CategoryId =
  | 'all'
  | 'music'
  | 'sports'
  | 'drift'
  | 'food'
  | 'art'
  | 'gaming'
  | 'outdoor'
  | 'party';

export type TimeFilter = 'today' | 'tomorrow' | 'week' | 'month';

export type Event = {
  id: string;
  title: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  icon: string;
  description: string;
  dateLabel: string;
  time: string;
  location: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  interested: number;
  image: ImageSourcePropType;
  accent: string;
  tint: string;
  ticketUrl?: string;
  websiteUrl?: string;
  timeFilter: TimeFilter;
};

export const categories: Array<{
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
}> = [
  { id: 'all', label: 'All', icon: 'star-four-points', color: '#a977ff' },
  { id: 'music', label: 'Music', icon: 'music-note', color: '#ff4fa4' },
  { id: 'sports', label: 'Sports', icon: 'soccer', color: '#91ed77' },
  { id: 'party', label: 'Party', icon: 'party-popper', color: '#ff8d4d' },
  { id: 'food', label: 'Food', icon: 'silverware-fork-knife', color: '#ffbd63' },
  { id: 'art', label: 'Art', icon: 'palette-outline', color: '#64f6d5' },
  { id: 'drift', label: 'Drift', icon: 'car-sports', color: '#ff667c' },
  { id: 'gaming', label: 'Gaming', icon: 'controller-classic-outline', color: '#3dc8ff' },
  { id: 'outdoor', label: 'Outdoor', icon: 'weather-sunny', color: '#50d9c2' },
];

export const events: Event[] = [
  {
    id: 'live-concert-tunis',
    title: 'Live Concert — Tunis',
    category: 'music',
    categoryLabel: 'Music',
    icon: 'music-note',
    description:
      'A night built for good music, open skies, and the kind of energy that follows you home. Meet your people at the amphitheatre.',
    dateLabel: 'Tonight',
    time: '20:00',
    location: 'Carthage',
    venue: 'Carthage Amphitheatre',
    address: 'Avenue de la République, Carthage',
    city: 'Tunis',
    country: 'Tunisia',
    interested: 1800,
    image: require('../assets/images/event-concert.jpg'),
    accent: '#ff4fa4',
    tint: '#a977ff',
    timeFilter: 'today',
    ticketUrl: 'https://www.google.com/search?q=concerts+in+tunis',
  },
  {
    id: 'football-night-tunis',
    title: 'Football Match Night',
    category: 'sports',
    categoryLabel: 'Sports',
    icon: 'soccer',
    description:
      'The lights are on and the stands are loud. Make tonight a match night with the city.',
    dateLabel: 'Tonight',
    time: '21:00',
    location: 'Tunis',
    venue: 'Stade Olympique de Radès',
    address: 'Radès, Ben Arous',
    city: 'Tunis',
    country: 'Tunisia',
    interested: 2400,
    image: require('../assets/images/event-concert.jpg'),
    accent: '#91ed77',
    tint: '#3dc8ff',
    timeFilter: 'today',
  },
  {
    id: 'tunis-drift-show',
    title: 'Tunis Drift Show',
    category: 'drift',
    categoryLabel: 'Cars & Drift',
    icon: 'car-sports',
    description:
      'Engines, smoke, and a full afternoon of sideways action. Come close to the track and feel every pass.',
    dateLabel: 'Tomorrow',
    time: '16:00',
    location: 'Tunis',
    venue: 'Tunis Motor Park',
    address: 'Les Berges du Lac, Tunis',
    city: 'Tunis',
    country: 'Tunisia',
    interested: 642,
    image: require('../assets/images/event-drift.jpg'),
    accent: '#ff667c',
    tint: '#ff8d4d',
    timeFilter: 'tomorrow',
    ticketUrl: 'https://www.google.com/search?q=tunis+drift+show',
  },
  {
    id: 'street-food-festival',
    title: 'Street Food Festival',
    category: 'food',
    categoryLabel: 'Food',
    icon: 'silverware-fork-knife',
    description:
      'Local flavors, late-night bites, and a waterfront crowd. Bring an appetite and stay for one more plate.',
    dateLabel: 'This week',
    time: '18:30',
    location: 'La Marsa',
    venue: 'Marsa Corniche',
    address: 'Avenue Habib Bourguiba, La Marsa',
    city: 'La Marsa',
    country: 'Tunisia',
    interested: 950,
    image: require('../assets/images/event-food.jpg'),
    accent: '#ffbd63',
    tint: '#ff8d4d',
    timeFilter: 'week',
  },
  {
    id: 'art-after-dark',
    title: 'Art After Dark',
    category: 'art',
    categoryLabel: 'Art & Culture',
    icon: 'palette-outline',
    description:
      'A late opening for new voices, bright rooms, and the conversations that happen when the gallery stays open.',
    dateLabel: 'This week',
    time: '19:00',
    location: 'Tunis',
    venue: 'M7 Contemporary',
    address: 'Rue du Lac Windermere, Tunis',
    city: 'Tunis',
    country: 'Tunisia',
    interested: 320,
    image: require('../assets/images/event-food.jpg'),
    accent: '#64f6d5',
    tint: '#a977ff',
    timeFilter: 'week',
  },
  {
    id: 'gaming-tournament',
    title: 'Gaming Tournament',
    category: 'gaming',
    categoryLabel: 'Gaming',
    icon: 'controller-classic-outline',
    description:
      'Fast rounds, local rivals, and a room full of players who came to win. Open bracket, all skill levels.',
    dateLabel: 'Tomorrow',
    time: '14:00',
    location: 'Tunis',
    venue: 'The Arcade House',
    address: 'Centre Urbain Nord, Tunis',
    city: 'Tunis',
    country: 'Tunisia',
    interested: 510,
    image: require('../assets/images/event-drift.jpg'),
    accent: '#3dc8ff',
    tint: '#a977ff',
    timeFilter: 'tomorrow',
  },
  {
    id: 'hammamet-outdoor-adventure',
    title: 'Hammamet Outdoor Adventure',
    category: 'outdoor',
    categoryLabel: 'Outdoor',
    icon: 'weather-sunny',
    description:
      'A full day outside: sea air, a little movement, and a new view before the week begins again.',
    dateLabel: 'Next month',
    time: '09:00',
    location: 'Hammamet',
    venue: 'Hammamet South Beach',
    address: 'Route Touristique, Hammamet',
    city: 'Hammamet',
    country: 'Tunisia',
    interested: 780,
    image: require('../assets/images/event-food.jpg'),
    accent: '#50d9c2',
    tint: '#3dc8ff',
    timeFilter: 'month',
  },
];

export function formatInterested(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
  return value.toString();
}