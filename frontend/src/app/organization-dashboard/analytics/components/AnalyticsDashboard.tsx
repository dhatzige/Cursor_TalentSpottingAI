'use client';

import { useState, useEffect } from 'react';
import { EmployerService } from '@/lib/api';

// Import types directly to ensure TypeScript can find them
interface OverviewMetric {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon?: string;
}

interface TimeSeriesDataPoint {
  date: string;
  applications: number;
  interviews: number;
  hires: number;
}

interface AnalyticsData {
  overviewMetrics: OverviewMetric[];
  applicationsTimeSeries: TimeSeriesDataPoint[];
  candidateMetrics: any[];
  candidateSources: any[];
  timeMetrics: any[];
  jobPerformance: any[];
}

// Import mock data - recreated to avoid import issues
const mockAnalyticsData: AnalyticsData = {
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
      value: 78,
      change: -3.1,
      trend: 'down',
      icon: 'users'
    },
    {
      label: 'Time to Hire',
      value: '18 days',
      change: -12.5,
      trend: 'up',
      icon: 'clock'
    }
  ],
  applicationsTimeSeries: [
    { date: '2023-06-01', applications: 12, interviews: 4, hires: 1 },
    { date: '2023-06-02', applications: 15, interviews: 5, hires: 2 },
    { date: '2023-06-03', applications: 8, interviews: 3, hires: 1 },
    { date: '2023-06-04', applications: 10, interviews: 4, hires: 0 },
    { date: '2023-06-05', applications: 14, interviews: 6, hires: 2 },
    { date: '2023-06-06', applications: 18, interviews: 7, hires: 3 },
    { date: '2023-06-07', applications: 16, interviews: 5, hires: 1 }
  ],
  candidateMetrics: [],
  candidateSources: [],
  timeMetrics: [],
  jobPerformance: []
};

// Import ApplicationsChart component from its own file
import ApplicationsChart from './ApplicationsChart';


// Comment out imports that cause TypeScript errors
// These components can be implemented later as needed
// import OverviewMetrics from './OverviewMetrics';
// import CandidateMetrics from './CandidateMetrics';
// import SourcesChart from './SourcesChart';
// import TimeMetrics from './TimeMetrics';
// import JobPerformance from './JobPerformance';

// New UI Components
import { TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

import ChartContainer from '@/components/dashboard/shared/ChartContainer';
import DateRangePicker, { DateRange } from '@/components/dashboard/shared/DateRangePicker';
import MetricGrid from '@/components/dashboard/shared/MetricGrid';

// Define analytics tabs
const analyticsTabs = [
  { id: 'overview', label: 'Overview', count: 4 },
  { id: 'applications', label: 'Applications', count: 2 },
  { id: 'candidates', label: 'Candidates', count: 2 },
  { id: 'jobs', label: 'Jobs', count: 2 }
];

// Loading indicator is now handled by the ChartContainer component

interface AnalyticsDashboardProps {
  isLoading?: boolean;
}

export default function AnalyticsDashboard({ isLoading = false }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    label: 'Last 30 days'
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setDataLoading(true);
      try {
        // In a real implementation, we would call the API with the date range
        // const data = await EmployerService.getAnalyticsData(dateRange.startDate, dateRange.endDate);
        
        // For now, we'll use mock data
        setTimeout(() => {
          setAnalyticsData(mockAnalyticsData);
          setDataLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setDataLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  // All loading and empty states are now handled by the ChartContainer component

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-white">Recruitment Analytics</h2>
        <DateRangePicker
          initialRange={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>
      
      <TabsList className="mb-6">
        {analyticsTabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            active={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
            {tab.count && <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">{tab.count}</span>}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {/* Overview Tab Content */}
      <TabsContent value="overview" activeValue={activeTab}>
          <ChartContainer 
            loading={isLoading || dataLoading}
            error={!analyticsData ? 'Failed to load analytics data' : undefined}
            height="auto"
          >
            {analyticsData && (
              <div className="space-y-6">
                {/* Metrics Overview */}
                <MetricGrid 
                  metrics={analyticsData.overviewMetrics.map((metric: OverviewMetric, index: number) => ({
                    id: `metric-${index}`,
                    label: metric.label,
                    value: metric.value,
                    change: metric.change,
                    changeLabel: metric.trend === 'up' ? '+' + metric.change + '%' : metric.change + '%',
                    color: metric.trend === 'up' ? 'green' : 
                          metric.trend === 'down' ? 'red' : 'blue'
                  }))}
                  columns={4}
                />
                
                {/* Applications Over Time */}
                <ChartContainer
                  title="Applications Over Time"
                  subtitle="Track application volume trends"
                  height="h-72"
                  className="mt-6"
                >
                  <ApplicationsChart data={analyticsData.applicationsTimeSeries} />
                </ChartContainer>
                
                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <ChartContainer
                    title="Applications Over Time"
                    subtitle="Track application volume trends"
                    height="h-64"
                  >
                    <ApplicationsChart data={analyticsData.applicationsTimeSeries} />
                  </ChartContainer>
                  
                  <ChartContainer
                    title="Candidate Metrics"
                    subtitle="Quality and engagement metrics"
                    height="h-64"
                  >
                    {/* <CandidateMetrics metrics={analyticsData.candidateMetrics} /> */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-center text-gray-600 dark:text-gray-300">Candidate metrics visualization coming soon</p>
                    </div>
                  </ChartContainer>
                </div>
              </div>
            )}
          </ChartContainer>
        </TabsContent>
      
      {/* Applications Tab Content */}
      <TabsContent value="applications" activeValue={activeTab}>
        <ChartContainer
          loading={isLoading || dataLoading}
          error={!analyticsData ? 'Failed to load analytics data' : undefined}
          height="auto"
        >
          {analyticsData && (
            <div className="space-y-6">
              <ApplicationsChart data={analyticsData.applicationsTimeSeries} />
              {/* <TimeMetrics data={analyticsData.timeMetrics} /> */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-center text-gray-600 dark:text-gray-300">Time metrics visualization coming soon</p>
              </div>
            </div>
          )}
        </ChartContainer>
        </TabsContent>
      
      {/* Candidates Tab Content */}
      {activeTab === 'candidates' && (
        <ChartContainer
          loading={isLoading || dataLoading}
          error={!analyticsData ? 'Failed to load analytics data' : undefined}
          height="auto"
        >
          {analyticsData && (
            <div className="space-y-6">
              {/* <CandidateMetrics metrics={analyticsData.candidateMetrics} /> */}
              {/* <SourcesChart data={analyticsData.candidateSources} /> */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-center text-gray-500">Candidate analytics visualization coming soon</p>
              </div>
            </div>
          )}
        </ChartContainer>
      )}
      
      {/* Jobs Tab Content */}
      {activeTab === 'jobs' && (
        <ChartContainer
          loading={isLoading || dataLoading}
          error={!analyticsData ? 'Failed to load analytics data' : undefined}
          height="auto"
        >
          {analyticsData && (
            <div className="space-y-6">
              {/* <JobPerformance jobs={analyticsData.jobPerformance} /> */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-center text-gray-500">Job performance analytics coming soon</p>
              </div>
            </div>
          )}
        </ChartContainer>
      )}
    </div>
  );
}
