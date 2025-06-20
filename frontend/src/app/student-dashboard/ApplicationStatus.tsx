// Reference: Student_dashboard.jpg
import ActivityCard from '../components/dashboard/ActivityCard';

interface ApplicationItem {
  id: string;
  title: string;
  company: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  timestamp: string;
}

interface ApplicationStatusProps {
  applications: ApplicationItem[];
}

export default function ApplicationStatus({ applications }: ApplicationStatusProps) {
  // Map application data to activity format
  const activitiesFromApplications = applications.map(app => {
    // Generate icon and type based on status
    let type: 'default' | 'success' | 'warning' | 'error' = 'default';
    if (app.status === 'accepted') type = 'success';
    if (app.status === 'reviewing') type = 'warning';
    if (app.status === 'interview') type = 'warning';
    if (app.status === 'rejected') type = 'error';

    // Format status text
    const statusText = {
      pending: 'Application submitted',
      reviewing: 'Application under review',
      interview: 'Interview scheduled',
      accepted: 'Application accepted',
      rejected: 'Application not selected',
    }[app.status];

    return {
      id: app.id,
      title: statusText,
      description: `${app.title} at ${app.company}`,
      timestamp: app.timestamp,
      type,
    };
  });

  return (
    <ActivityCard
      title="Application Status"
      activities={activitiesFromApplications}
      viewAllLink="/student-dashboard/applications"
      maxItems={5}
    />
  );
}
