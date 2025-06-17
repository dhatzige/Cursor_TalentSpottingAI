// Analytics data types

export interface OverviewMetric {
  label: string;
  value: number | string;
  change: number; // Percentage change compared to previous period
  trend: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  applications: number;
  interviews: number;
  hires: number;
}

export interface SourceDataPoint {
  source: string;
  count: number;
  percentage: number;
}

export interface CandidateMetric {
  label: string;
  value: number;
  subtext?: string;
}

export interface TimeMetric {
  stage: string;
  averageDays: number;
  previousAverageDays: number;
  change: number;
}

export interface JobPerformanceData {
  id: string;
  title: string;
  applications: number;
  interviews: number;
  hired: number;
  conversionRate: number;
  timeToHire: number;
}

export interface AnalyticsData {
  overviewMetrics: OverviewMetric[];
  applicationsTimeSeries: TimeSeriesDataPoint[];
  candidateSources: SourceDataPoint[];
  candidateMetrics: CandidateMetric[];
  timeMetrics: TimeMetric[];
  jobPerformance: JobPerformanceData[];
}
