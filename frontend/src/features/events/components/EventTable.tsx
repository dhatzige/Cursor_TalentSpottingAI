"use client";
import { Event } from '../types';
import { PencilIcon, ArchiveBoxIcon, TrashIcon, ShareIcon } from '@heroicons/react/24/outline';

interface Props {
  events: Event[];
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function EventTable({ events, onEdit, onArchive, onDelete }: Props) {
  if (events.length === 0) return <p className="text-sm text-gray-500 dark:text-gray-400">No events found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Title</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Type</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Date</th>
            <th className="px-4 py-2 text-left font-medium text-gray-500 dark:text-gray-300">Status</th>
            <th className="px-4 py-2 text-right font-medium text-gray-500 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {events.map((event) => (
            <tr key={event.id} className={event.status === 'archived' ? 'opacity-60' : ''}>
              <td className="px-4 py-2 whitespace-nowrap text-gray-900 dark:text-gray-100">{event.title}</td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300 capitalize">{event.type.replace('_', ' ')}</td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300">{new Date(event.date).toLocaleDateString()}</td>
              <td className="px-4 py-2 whitespace-nowrap text-gray-700 dark:text-gray-300 capitalize">{event.status}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right space-x-2">
                <button onClick={() => onEdit(event.id)} className="text-indigo-600 hover:text-indigo-800">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onArchive(event.id)} className="text-amber-600 hover:text-amber-800">
                  <ArchiveBoxIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
