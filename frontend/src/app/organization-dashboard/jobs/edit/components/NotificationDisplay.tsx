'use client';

interface NotificationDisplayProps {
  error: string | null;
  successMessage: string | null;
}

export function NotificationDisplay({ error, successMessage }: NotificationDisplayProps) {
  if (!error && !successMessage) return null;
  
  return (
    <>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-600">
          {successMessage}
        </div>
      )}
    </>
  );
}

export default NotificationDisplay;
