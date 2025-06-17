'use client';

import { useEffect, useState } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import Button from '@/app/organization-dashboard/shared/ui/Button';
import { UniversityService } from '@/lib/api';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

interface SettingsForm {
  universityName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
}

export default function UniversitySettingsPage() {
  const { loading: authLoading } = useProtectedRoute(['university'], '/login');

  const [form, setForm] = useState<SettingsForm>({
    universityName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const settings = await UniversityService.getSettings();
        setForm(settings);
      } catch (err) {
        console.error('Error loading settings', err);
        setError('Failed to load settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await UniversityService.updateSettings(form);
      setForm(updated);
      setSuccess('Settings saved successfully.');
    } catch (err) {
      console.error('Error saving settings', err);
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <UnifiedDashboardLayout title="" userRole="university" breadcrumbs={[{ label: 'Settings' }]}>
      {loading ? (
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-gray-500">Loading settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {error && <p className="text-red-600 dark:text-red-400">{error}</p>}
          {success && <p className="text-green-600 dark:text-green-400">{success}</p>}

          <div>
            <label htmlFor="universityName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              University Name
            </label>
            <input
              type="text"
              name="universityName"
              id="universityName"
              value={form.universityName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              id="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contact Phone
            </label>
            <input
              type="tel"
              name="contactPhone"
              id="contactPhone"
              value={form.contactPhone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Website
            </label>
            <input
              type="url"
              name="website"
              id="website"
              value={form.website}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 sm:text-sm"
            />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="primary" size="md" loading={saving}>
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </UnifiedDashboardLayout>
  );
}
