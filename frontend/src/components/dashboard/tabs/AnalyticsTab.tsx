'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';

export default function AnalyticsTab() {
  return (
    <Card>
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <CardTitle>Recruiting Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-20 text-gray-500">
          <p>Analytics features coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
}
