// Reference: Admin_dashboard.jpg
import ActivityCard from '../components/dashboard/ActivityCard';

interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  type?: 'default' | 'success' | 'warning' | 'error';
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="mb-8">
      <ActivityCard
        title="Recent Activity"
        activities={activities}
        viewAllLink="/admin-dashboard/activity"
        maxItems={5}
      />
    </div>
  );
}
