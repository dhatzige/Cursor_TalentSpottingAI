export type EventStatus = 'active' | 'archived';

export type EventType = 'career_fair' | 'workshop' | 'webinar' | 'other';

export type EventMode = 'online' | 'in_person' | 'hybrid';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO string (YYYY-MM-DD)
  description: string;

  // New extended fields
  mode: EventMode;
  locationAddress?: string;
  locationLink?: string; // Google Maps URL
  isFree: boolean;
  price?: number; // applicable when isFree is false
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;

  status: EventStatus;
  sharedTo: string[]; // IDs or names of entities the event is shared with
  ownerRole: 'university' | 'employer';
}
