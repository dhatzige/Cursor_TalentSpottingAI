'use client';

import React from 'react';

interface SaveSearchDialogProps {
  searchName: string;
  onSearchNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function SaveSearchDialog({
  searchName,
  onSearchNameChange,
  onSave,
  onCancel
}: SaveSearchDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Save Current Search</h3>
        <input
          type="text"
          placeholder="Enter a name for this search"
          value={searchName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700/50 rounded-md border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            disabled={!searchName.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
