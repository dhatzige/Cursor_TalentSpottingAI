import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-1 h-full">
      <Card className="h-full flex flex-col bg-gray-800/60 border-gray-700 hover:border-blue-500/70 transition-all duration-300 ease-in-out shadow-lg hover:shadow-blue-500/20 group">
        <CardHeader className="p-0">
          <div className="flex items-center space-x-4 px-6 py-4 rounded-t-xl animated-gradient-bg-icon">
            <Icon className="h-8 w-8 text-gray-200 flex-shrink-0" />
            <CardTitle className="text-lg font-semibold text-gray-100 group-hover:text-white transition-colors">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 text-gray-300 group-hover:text-gray-200 transition-colors flex-grow">
          <p>{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
