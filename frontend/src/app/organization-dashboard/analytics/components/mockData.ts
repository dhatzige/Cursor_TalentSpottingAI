import { AnalyticsData } from './types';

// Mock data for analytics dashboard
export const mockAnalyticsData: AnalyticsData = {
  overviewMetrics: [
    {
      label: 'Total Applications',
      value: 268,
      change: 12.3,
      trend: 'up',
      icon: 'document'
    },
    {
      label: 'Active Jobs',
      value: 14,
      change: 5.2,
      trend: 'up',
      icon: 'briefcase'
    },
    {
      label: 'Interviews Conducted',
      value: 47,
      change: 8.7,
      trend: 'up',
      icon: 'chat'
    },
    {
      label: 'Avg. Time to Hire',
      value: '18 days',
      change: -2.8,
      trend: 'down', // Down is positive for time metrics
      icon: 'clock'
    }
  ],
  applicationsTimeSeries: [
    { date: '2025-04-21', applications: 8, interviews: 1, hires: 0 },
    { date: '2025-04-22', applications: 12, interviews: 2, hires: 0 },
    { date: '2025-04-23', applications: 10, interviews: 3, hires: 1 },
    { date: '2025-04-24', applications: 15, interviews: 4, hires: 0 },
    { date: '2025-04-25', applications: 11, interviews: 1, hires: 0 },
    { date: '2025-04-26', applications: 6, interviews: 0, hires: 0 },
    { date: '2025-04-27', applications: 4, interviews: 0, hires: 0 },
    { date: '2025-04-28', applications: 14, interviews: 2, hires: 1 },
    { date: '2025-04-29', applications: 17, interviews: 5, hires: 2 },
    { date: '2025-04-30', applications: 13, interviews: 3, hires: 0 },
    { date: '2025-05-01', applications: 12, interviews: 2, hires: 1 },
    { date: '2025-05-02', applications: 14, interviews: 4, hires: 0 },
    { date: '2025-05-03', applications: 8, interviews: 1, hires: 0 },
    { date: '2025-05-04', applications: 5, interviews: 0, hires: 0 },
    { date: '2025-05-05', applications: 16, interviews: 3, hires: 1 },
    { date: '2025-05-06', applications: 18, interviews: 4, hires: 0 },
    { date: '2025-05-07', applications: 15, interviews: 2, hires: 1 },
    { date: '2025-05-08', applications: 13, interviews: 3, hires: 0 },
    { date: '2025-05-09', applications: 14, interviews: 2, hires: 0 },
    { date: '2025-05-10', applications: 7, interviews: 0, hires: 0 },
    { date: '2025-05-11', applications: 5, interviews: 0, hires: 0 },
    { date: '2025-05-12', applications: 16, interviews: 3, hires: 1 },
    { date: '2025-05-13', applications: 19, interviews: 4, hires: 0 },
    { date: '2025-05-14', applications: 17, interviews: 3, hires: 1 },
    { date: '2025-05-15', applications: 14, interviews: 2, hires: 0 },
    { date: '2025-05-16', applications: 15, interviews: 3, hires: 0 },
    { date: '2025-05-17', applications: 9, interviews: 1, hires: 0 },
    { date: '2025-05-18', applications: 6, interviews: 0, hires: 0 },
    { date: '2025-05-19', applications: 18, interviews: 3, hires: 1 },
    { date: '2025-05-20', applications: 21, interviews: 5, hires: 2 }
  ],
  candidateSources: [
    { source: 'LinkedIn', count: 98, percentage: 36.6 },
    { source: 'Indeed', count: 72, percentage: 26.9 },
    { source: 'Company Website', count: 45, percentage: 16.8 },
    { source: 'Referrals', count: 32, percentage: 11.9 },
    { source: 'Job Fairs', count: 12, percentage: 4.5 },
    { source: 'Other', count: 9, percentage: 3.3 }
  ],
  candidateMetrics: [
    { label: 'Total Candidates', value: 325, subtext: 'in database' },
    { label: 'Average Match Score', value: 72, subtext: 'out of 100' },
    { label: 'Response Rate', value: 85, subtext: '%' },
    { label: 'Offer Acceptance', value: 78, subtext: '%' }
  ],
  timeMetrics: [
    { stage: 'Application to Screen', averageDays: 2.3, previousAverageDays: 2.5, change: -8.0 },
    { stage: 'Screen to Interview', averageDays: 5.8, previousAverageDays: 6.2, change: -6.5 },
    { stage: 'Interview to Decision', averageDays: 4.2, previousAverageDays: 4.6, change: -8.7 },
    { stage: 'Decision to Offer', averageDays: 1.8, previousAverageDays: 1.9, change: -5.3 },
    { stage: 'Offer to Acceptance', averageDays: 3.9, previousAverageDays: 4.3, change: -9.3 }
  ],
  jobPerformance: [
    {
      id: 'j001',
      title: 'Senior Frontend Developer',
      applications: 48,
      interviews: 12,
      hired: 2,
      conversionRate: 4.2,
      timeToHire: 21
    },
    {
      id: 'j002',
      title: 'Product Manager',
      applications: 64,
      interviews: 15,
      hired: 1,
      conversionRate: 1.6,
      timeToHire: 28
    },
    {
      id: 'j003',
      title: 'UX Designer',
      applications: 36,
      interviews: 8,
      hired: 2,
      conversionRate: 5.6,
      timeToHire: 16
    },
    {
      id: 'j004',
      title: 'Backend Engineer',
      applications: 42,
      interviews: 10,
      hired: 1,
      conversionRate: 2.4,
      timeToHire: 19
    },
    {
      id: 'j005',
      title: 'Marketing Specialist',
      applications: 38,
      interviews: 7,
      hired: 2,
      conversionRate: 5.3,
      timeToHire: 14
    }
  ]
};
