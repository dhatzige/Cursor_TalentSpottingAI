// Reference: University_dashboard.jpg
import StatCard from '../components/dashboard/StatCard';

interface StudentMetricsProps {
  metrics: {
    totalStudents: number;
    activeStudents: number;
    placementRate: number;
    averageSalary: string;
  };
}

export default function StudentMetrics({ metrics }: StudentMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Students"
        value={metrics.totalStudents}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
        }
      />
      
      <StatCard 
        title="Active Job Seekers"
        value={metrics.activeStudents}
        change={{ value: '8%', isPositive: true }}
      />
      
      <StatCard 
        title="Placement Rate"
        value={`${metrics.placementRate}%`}
        change={{ value: '5%', isPositive: true }}
      />
      
      <StatCard 
        title="Average Starting Salary"
        value={metrics.averageSalary}
        change={{ value: '3%', isPositive: true }}
      />
    </div>
  );
}
