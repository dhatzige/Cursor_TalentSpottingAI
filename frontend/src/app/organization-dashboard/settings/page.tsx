'use client';

export const dynamic = 'force-dynamic';

import React, { useState, ChangeEvent } from 'react';
import { useSaveSettings } from '@/lib/hooks/useSaveSettings';
import { UnifiedDashboardLayout } from '@/components/dashboard';
import { getPreferredTheme } from '@/lib/theme';
import { useEffect } from 'react';
import AppearanceSection from '@/components/settings/AppearanceSection';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';
import { FileUploadInput, PlanCard, DangerZone } from '@/components/settings';
import { SettingsService, EmployerPlan } from '@/lib/api/employer/settings-service';
import { AcceptedFile } from '@/components/settings/FileUploadInput';

// Define types for the settings state to avoid TypeScript errors
type NotificationsSettings = {
  weeklySummary: boolean;
  applicationUpdates: boolean;
  newCandidates: boolean;
  marketingEmails: boolean;
};

type PrivacySettings = {
  companyVisibility: string;
  showContactInfo: boolean;
  jobVisibility: string;
  dataSharing: boolean;
};

type AccountSettings = {
  twoFactorAuth: boolean;
  darkMode: boolean;
  language: string;
};

type SettingsState = {
  notifications: NotificationsSettings;
  privacy: PrivacySettings;
  account: AccountSettings;
};

export default function SettingsPage() {
  // Protect this route - only employers can access
  const { loading: authLoading } = useProtectedRoute(['employer']);
  
  // Mock user info - In a real application, this would come from auth context
  const userInfo = {
    name: 'Demo User',
    company: 'TalentSpotting Inc.',
  };

  // State for the settings form with proper typing
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      weeklySummary: false,
      
      applicationUpdates: true,
      newCandidates: true,
      marketingEmails: false,
    },
    privacy: {
      companyVisibility: 'public',
      showContactInfo: true,
      jobVisibility: 'public',
      dataSharing: true,
    },
    account: {
      twoFactorAuth: false,
      darkMode: false,
      language: 'english',
    },
  });

  // Extra state for logo & plan
  const [logo, setLogo] = useState<AcceptedFile | undefined>(undefined);
  const [currentPlan, setCurrentPlan] = useState<EmployerPlan | null>(null);
  const AVAILABLE_PLANS: EmployerPlan[] = [
    { id: 'basic', name: 'Basic', price: 'Free', features: ['1 active job posting'] },
    { id: 'pro', name: 'Pro', price: '$49/mo', features: ['10 active postings', 'Priority support'] },
    { id: 'enterprise', name: 'Enterprise', price: 'Contact us', features: ['Unlimited postings', 'Dedicated manager'] },
  ];

  // Fetch current plan on mount
  React.useEffect(() => {
    SettingsService.getPlan().then(setCurrentPlan).catch(console.error);
  }, []);

  // Auto-upload logo when selected
  React.useEffect(() => {
    if (logo) {
      SettingsService.uploadLogo(logo).then(() => {
        alert('Logo uploaded successfully');
      }).catch(console.error);
    }
  }, [logo]);

  const handlePlanSelect = async (planId: string) => {
    try {
      await SettingsService.upgradePlan(planId);
      const updated = AVAILABLE_PLANS.find(p => p.id === planId) || null;
      setCurrentPlan(updated);
      alert('Subscription updated');
    } catch (err) {
      console.error(err);
      alert('Failed to upgrade plan');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('This action will permanently delete your account. Type DELETE in the next dialog to confirm.')) return;
    try {
      await SettingsService.deleteAccount();
      alert('Account deleted');
      window.location.href = '/';
    } catch (err) {
      console.error(err);
      alert('Failed to delete account');
    }
  };

  // Handle toggle changes for boolean settings
  const handleToggleChange = (section: keyof SettingsState, setting: string) => {
    setDirty(true);
    setSettings(prev => {
      const sectionData = prev[section];
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [setting]: !sectionData[setting as keyof typeof sectionData],
        },
      };
    });
  };

  // Handle select changes for dropdown settings
  const handleSelectChange = (section: keyof SettingsState, setting: string, value: string) => {
    setDirty(true);
    setSettings(prev => {
      const sectionData = prev[section];
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [setting]: value,
        },
      };
    });
  };

  // Dirty flag & save hook
  const { saveSettings, saving, saved } = useSaveSettings<SettingsState>();

  // sync initial dark mode to avoid hydration mismatch
  useEffect(() => {
    const prefersDark = getPreferredTheme() === 'dark';
    setSettings(prev => ({
      ...prev,
      account: { ...prev.account, darkMode: prefersDark },
    }));
  }, []);
  const [dirty, setDirty] = useState(false);

  // Save settings handler
  const handleSaveSettings = () => {
    // In a real app, this would make an API call to save settings
    saveSettings(settings);
    // Show success message
    alert('Settings saved successfully!');
  };

  // Render settings content
  const renderSettingsContent = () => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h1>
          
          {/* Notification Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Notification Preferences</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">Weekly Summary Emails</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Receive a weekly summary of your hiring activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.weeklySummary}
                    onChange={() => handleToggleChange('notifications', 'weeklySummary')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
              

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">Application Updates</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Get notified when candidates apply or update their applications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.applicationUpdates}
                    onChange={() => handleToggleChange('notifications', 'applicationUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">New Candidate Alerts</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Get notified when new candidates match your job criteria</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.newCandidates}
                    onChange={() => handleToggleChange('notifications', 'newCandidates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Appearance */}
          <AppearanceSection
            darkMode={settings.account.darkMode}
            onChange={(val: boolean) => {
              setDirty(true);
              setSettings(prev => ({
                ...prev,
                account: { ...prev.account, darkMode: val },
              }));
            }}
          />

          {/* Privacy Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Privacy & Visibility</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
              <div>
                <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-2">Company Profile Visibility</h3>
                <select 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={settings.privacy.companyVisibility}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange('privacy', 'companyVisibility', e.target.value)}
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="registered">Registered Users - Visible only to registered candidates</option>
                  <option value="limited">Limited - Visible only to selected candidates</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">Show Contact Information</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Allow candidates to see your contact details</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.privacy.showContactInfo}
                    onChange={() => handleToggleChange('privacy', 'showContactInfo')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Account Settings */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Account Settings</h2>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">Two-Factor Authentication</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Add an extra layer of security to your account</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.account.twoFactorAuth}
                    onChange={() => handleToggleChange('account', 'twoFactorAuth')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-gray-800 dark:text-gray-200 font-medium">Dark Mode</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Switch between light and dark themes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.account.darkMode}
                    onChange={() => handleToggleChange('account', 'darkMode')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <h3 className="text-gray-800 dark:text-gray-200 font-medium mb-2">Language</h3>
                <select 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={settings.account.language}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange('account', 'language', e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Company Logo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Company Logo</h2>
            <FileUploadInput
              label="Select logo"
              accept="image/*"
              value={logo}
              onChange={setLogo}
              helperText="PNG/JPEG, max 2 MB"
            />
          </div>

          {/* Subscription Plan */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Subscription Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {AVAILABLE_PLANS.map((plan) => (
                <div key={plan.id}>
                <PlanCard
                  plan={{ ...plan, isCurrent: currentPlan?.id === plan.id }}
                  onSelect={handlePlanSelect}
                />
              </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mb-8">
            <DangerZone onDeleteAccount={handleDeleteAccount} />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={() => { handleSaveSettings(); setDirty(false); }}
              disabled={!dirty || saving}
              className={`px-4 py-2 rounded-md transition-colors ${(!dirty||saving) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
              {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the content first, then pass it as a prop
  const settingsContent = renderSettingsContent();
  
  return (
    <UnifiedDashboardLayout
      // Removing title to prevent duplication
      title=""
      description=""
      userRole="employer"
      userInfo={{
        name: 'Demo User',
        company: 'TalentSpottingAI Inc.',
      }}
      breadcrumbs={[
        { label: 'Dashboard', href: '/organization-dashboard' },
        { label: 'Settings' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
      children={settingsContent}
    />
  );
}
