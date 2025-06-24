"use client";

import React, { useState } from "react";
import { Button } from '@/components/ui/button';

interface DangerZoneProps {
  /** Callback after successful deletion */
  onDeleteAccount: () => Promise<void>;
}

/**
 * Red zone component prompting user to delete their account.
 */
const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteAccount }) => {
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    try {
      await onDeleteAccount();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border border-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Danger Zone</h2>
      <p className="text-sm text-red-600 dark:text-red-300">
        Deleting your account is irreversible. All data associated with your account will be permanently removed.
        Type <strong>DELETE</strong> to confirm.
      </p>
      <input
        type="text"
        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 p-2"
        placeholder="Type DELETE to confirm"
        value={confirmText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmText(e.target.value.toUpperCase())}
      />
      <Button
        variant="danger"
        disabled={confirmText !== "DELETE" || deleting}
        loading={deleting}
        onClick={handleDelete}
      >
        Delete Account
      </Button>
    </div>
  );
};

export default DangerZone;
