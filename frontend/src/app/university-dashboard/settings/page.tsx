'use client';

export const dynamic = 'force-dynamic';

import React, { useState, ChangeEvent } from 'react';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import { useSaveSettings } from '@/lib/hooks/useSaveSettings';
import Button from '@/app/organization-dashboard/shared/ui/Button';
import { getPreferredTheme } from '@/lib/theme';
import { useEffect } from 'react';
import AppearanceSection from '@/components/settings/AppearanceSection';

// University settings structure
interface UniversityProfile {
  universityName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
}

interface NotificationsSettings {
  weeklyDigest: boolean;
  placementUpdates: boolean;
  partnerNews: boolean;
}

interface AccountSettings {
  twoFactorAuth: boolean;
  darkMode: boolean;
  language: string;
}

interface SettingsState {
  profile: UniversityProfile;
  notifications: NotificationsSettings;
  account: AccountSettings;
}

export default function UniversitySettingsPage() {
  // Restrict access to university role
  const { loading: authLoading } = useProtectedRoute(['university'], '/login');

  // Local state
  const [settings, setSettings] = useState<SettingsState>({
    profile: {
      universityName: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      address: ''
    },
    notifications: {
      weeklyDigest: true,
      placementUpdates: true,
      partnerNews: false
    },
    account: {
      twoFactorAuth: false,
      darkMode: false,
      language: 'english'
    }
  });

  const { saveSettings, saving, saved } = useSaveSettings<SettingsState>();
  const [dirty, setDirty] = useState(false);

  // Sync dark mode preference on mount to avoid SSR mismatch
  useEffect(() => {
    const prefersDark = getPreferredTheme() === 'dark';
    setSettings(prev => ({
      ...prev,
      account: { ...prev.account, darkMode: prefersDark },
    }));
  }, []);

  // Handlers
  const toggle = (category: keyof SettingsState, field: string) => {
    setDirty(true);
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: !prev[category][field as keyof (typeof prev)[typeof category]]
      }
    }));
  };

  const input = (category: keyof SettingsState, field: string, value: string) => {
    setDirty(true);
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const save = () => saveSettings(settings).then(() => setDirty(false));

  // Main content
  const content = (
    <div className="space-y-6">
      {/* --- Appearance --- */}
      <AppearanceSection
        darkMode={settings.account.darkMode}
        onChange={(val: boolean) => {
          setDirty(true);
          setSettings(prev => ({
            ...prev,
            account: {
              ...prev.account,
              darkMode: val,
            },
          }));
        }}
      />

      {/* --- Profile --- */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-6">
        {/* header */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">University Profile</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Update basic information about your institution.</p>
        </div>

        {/* form grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['universityName', 'contactEmail', 'contactPhone', 'website'] as const).map((f) => (
            <div key={f} className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
                {f.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type={f === 'contactEmail' ? 'email' : f === 'website' ? 'url' : 'text'}
                value={settings.profile[f]}
                placeholder={f === 'universityName' ? 'e.g. Stanford University' : f === 'contactEmail' ? 'contact@university.edu' : undefined}
                onChange={(e: ChangeEvent<HTMLInputElement>) => input('profile', f, e.target.value)}
                className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3"
              />
            </div>
          ))}

          {/* address spans full width */}
          <div className="md:col-span-2 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <textarea
              rows={3}
              value={settings.profile.address}
              placeholder="450 Jane Stanford Way, Stanford, CA 94305"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => input('profile', 'address', e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3"
            />
          </div>
        </div>
      </div>

      {/* --- Notifications --- */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h2>
        {([
          ['Weekly Digest', 'weeklyDigest', 'Receive a weekly digest of platform activity'],
          ['Placement Updates', 'placementUpdates', 'Notify me when new placement data is available'],
          ['Partner News', 'partnerNews', 'Announcements from employer partners'],
        ] as const).map(([label, field, desc]) => (
          <div key={field} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.notifications[field as keyof NotificationsSettings]}
                onChange={() => toggle('notifications', field)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:border after:border-gray-300 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>
        ))}
      </div>

      {/* --- Account --- */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account</h2>
        {(['twoFactorAuth'] as const).map((field) => (
          <div key={field} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {field === 'twoFactorAuth' ? 'Two-Factor Authentication' : 'Dark Mode'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.account[field]}
                onChange={() => toggle('account', field)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:border after:border-gray-300 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
            </label>
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
          <select
            value={settings.account.language}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => input('account', 'language', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>
      </div>

      {/* --- Save --- */}
      <div className="flex justify-end">
        <Button variant="primary" size="md" disabled={!dirty || saving} loading={saving} onClick={save}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <UnifiedDashboardLayout
      title=""
      userRole="university"
      breadcrumbs={[
        { label: 'Dashboard', href: isDev ? '/university-dashboard' : '/university-dashboard' },
        { label: 'Settings' },
      ]}
      children={content}
    />
  );
}
