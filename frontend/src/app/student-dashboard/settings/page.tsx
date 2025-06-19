'use client';

import React, { useState, ChangeEvent } from 'react';
import { useSaveSettings } from '@/lib/hooks/useSaveSettings';
import UnifiedDashboardLayout from '@/components/dashboard/UnifiedDashboardLayout';
import { getPreferredTheme } from '@/lib/theme';
import { useEffect } from 'react';
import AppearanceSection from '@/components/settings/AppearanceSection';
import { useProtectedRoute } from '@/lib/hooks/useProtectedRoute';

// Define types for the settings state to avoid TypeScript errors
type NotificationsSettings = {
  weeklySummary: boolean;
  applicationUpdates: boolean;
  newJobs: boolean;
  marketingEmails: boolean;
};

type PrivacySettings = {
  profileVisibility: string;
  showContactInfo: boolean;
  allowRecruitersToContact: boolean;
  showActivity: boolean;
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
  // Protect this route - only students can access
  const { loading: authLoading } = useProtectedRoute(['student'], '/login');
  
  // Mock user info - In a real application, this would come from auth context
  const userInfo = {
    name: 'Alex Johnson',
    role: 'Student',
  };

  // State for the settings form with proper typing
  const [settings, setSettings] = useState<SettingsState>({
    notifications: {
      weeklySummary: false,
      
      applicationUpdates: true,
      newJobs: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'public',
      showContactInfo: false,
      allowRecruitersToContact: true,
      showActivity: true
    },
    account: {
      twoFactorAuth: false,
      darkMode: false,
      language: 'english'
    }
  });

  // Dirty flag & save hook
  const { saveSettings, saving, saved } = useSaveSettings<SettingsState>();

  // sync dark mode
  useEffect(() => {
    const prefersDark = getPreferredTheme() === 'dark';
    setSettings(prev => ({
      ...prev,
      account: { ...prev.account, darkMode: prefersDark },
    }));
  }, []);
  const [dirty, setDirty] = useState(false);

  // Handler for toggle inputs with proper typing
  const handleToggleChange = (category: keyof SettingsState, setting: string) => {
    setDirty(true);
    setSettings(prev => {
      const updatedCategory = { 
        ...prev[category], 
        [setting]: !prev[category][setting as keyof (typeof prev)[typeof category]]
      };
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  };

  // Handler for select inputs with proper typing
  const handleSelectChange = (category: keyof SettingsState, setting: string, value: string) => {
    setDirty(true);
    setSettings(prev => {
      const updatedCategory = {
        ...prev[category],
        [setting]: value
      };
      return {
        ...prev,
        [category]: updatedCategory
      };
    });
  };

  // Create the content to be used as children
  const content = (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 dark:text-white">Account Settings</h1>
        
        <button
            onClick={() => { saveSettings(settings).then(() => setDirty(false)); }}
            disabled={!dirty || saving}
            className={`px-4 py-2 rounded-md transition-colors ${(!dirty||saving) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
      
      {/* Appearance */}
      <AppearanceSection
        darkMode={settings.account.darkMode}
        onChange={(val) => {
          setDirty(true);
          setSettings(prev => ({
            ...prev,
            account: { ...prev.account, darkMode: val },
          }));
        }}
      />

      {/* Notifications Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Weekly Summary Emails</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive a weekly summary of your activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.notifications.weeklySummary}
                onChange={() => handleToggleChange('notifications', 'weeklySummary')} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-3">Notification Types</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Application Updates</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updates on your job applications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.applicationUpdates}
                  onChange={() => handleToggleChange('notifications', 'applicationUpdates')} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">New Job Matches</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Notifications for new jobs matching your profile</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.newJobs}
                  onChange={() => handleToggleChange('notifications', 'newJobs')} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Marketing Emails</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional content and offers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.notifications.marketingEmails}
                  onChange={() => handleToggleChange('notifications', 'marketingEmails')} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Privacy</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium mb-2">Profile Visibility</p>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={settings.privacy.profileVisibility}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectChange('privacy', 'profileVisibility', e.target.value)}
            >
              <option value="public">Public - Visible to all employers and recruiters</option>
              <option value="semi-private">Semi-Private - Only visible to approved employers</option>
              <option value="private">Private - Only visible when you apply</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Show Contact Information</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Display your email and phone number on your profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.privacy.showContactInfo}
                onChange={() => handleToggleChange('privacy', 'showContactInfo')} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Allow Recruiters to Contact Me</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive messages from recruiters about opportunities</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.privacy.allowRecruitersToContact}
                onChange={() => handleToggleChange('privacy', 'allowRecruitersToContact')} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Show Activity Status</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Display when you were last active on the platform</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.privacy.showActivity}
                onChange={() => handleToggleChange('privacy', 'showActivity')} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Account Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 dark:text-white mb-4">Account</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Increase security by requiring a second verification step</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.account.twoFactorAuth}
                onChange={() => handleToggleChange('account', 'twoFactorAuth')} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div>
              {/* Dark Mode setting removed */}
              <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme across the platform</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.account.darkMode}
                onChange={() => handleToggleChange('account', 'darkMode')} 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="mt-4">
            <p className="text-gray-900 dark:text-gray-100 dark:text-white font-medium mb-2">Language</p>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={settings.account.language}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectChange('account', 'language', e.target.value)}
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
            </select>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 dark:text-white mb-3">Danger Zone</h3>
            
            <div className="flex flex-col space-y-3">
              <button className="px-4 py-2 border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md transition-colors">
                Change Password
              </button>
              
              <button className="px-4 py-2 border border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
            onClick={() => { saveSettings(settings).then(() => setDirty(false)); }}
            disabled={!dirty || saving}
            className={`px-6 py-2.5 rounded-md text-base font-medium transition-colors ${(!dirty||saving) ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );

  // Check if we're in development environment
  const isDev = process.env.NODE_ENV === 'development';
  
  // Return the layout with content as children
  return (
    <UnifiedDashboardLayout
      // Removing title to prevent duplication
      title="" 
      description=""
      userRole="student"
      userInfo={userInfo}
      breadcrumbs={[
        // If in development, link to the no-auth version
        { label: 'Dashboard', href: isDev ? '/student-dashboard-noauth' : '/student-dashboard' },
        { label: 'Settings' }
      ]}
      className="pt-0 mt-0" // Removing padding at the top
      children={content} // Explicitly set children prop to fix TypeScript error
    >
      {content}
    </UnifiedDashboardLayout>
  );
}
