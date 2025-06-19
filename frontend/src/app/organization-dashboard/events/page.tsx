"use client";

export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import { UnifiedDashboardLayout } from '@/components/dashboard';
import EventTable from '@/features/events/components/EventTable';
import EventFormModal from '@/features/events/components/EventFormModal';
import { useEvents } from '@/features/events/useEvents';
import { Event } from '@/features/events/types';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function EmployerEventsPage() {
  const { loading: authLoading } = useProtectedRoute(['employer'], '/login');
  const {
    events,
    addEvent,
    updateEvent,
    archiveEvent,
    deleteEvent,
  } = useEvents();

  const [filter, setFilter] = useState<'active' | 'archived'>('active');
  const [modalOpen, setModalOpen] = useState(false);

  if (authLoading) return null;

  const filteredEvents = events.filter((e) => e.status === filter);

  return (
    <UnifiedDashboardLayout
      title="Events"
      userRole="employer"
      breadcrumbs={[{ label: 'Dashboard', href: '/organization-dashboard' }, { label: 'Events' }]}
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="space-x-4">
            {(['active', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  filter === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setFilter(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <button
            className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Create Event
          </button>
        </div>

        <EventTable
          events={filteredEvents}
          onEdit={(id) => {
            /* placeholder edit logic */
          }}
          onArchive={archiveEvent}
          onDelete={deleteEvent}
        />
      </div>

      <EventFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(data) =>
          addEvent({ ...data, ownerRole: 'employer' } as Omit<Event, 'id' | 'status'>)
        }
        role="employer"
      />
    </UnifiedDashboardLayout>
  );
}
