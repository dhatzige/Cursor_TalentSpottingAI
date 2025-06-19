"use client";
import { useState, useCallback } from 'react';
import { Event } from './types';
import { v4 as uuid } from 'uuid';

export interface UseEventsOptions {
  initialEvents?: Event[];
}

export function useEvents({ initialEvents = [] }: UseEventsOptions = {}) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = useCallback((event: Omit<Event, 'id' | 'status'>) => {
    setEvents((prev) => [
      ...prev,
      { ...event, id: uuid(), status: 'active' },
    ]);
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Event>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, []);

  const archiveEvent = useCallback((id: string) => {
    updateEvent(id, { status: 'archived' });
  }, [updateEvent]);

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    archiveEvent,
    deleteEvent,
  };
}
