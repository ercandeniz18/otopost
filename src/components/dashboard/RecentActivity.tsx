import React from 'react';
import { FileText, AlertTriangle, Check, Twitter } from 'lucide-react';

// Mock data for activities
const activities = [
  {
    id: 1,
    type: 'scrape',
    status: 'success',
    message: 'Successfully scraped 15 new items from KAP.org.tr',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
  },
  {
    id: 2,
    type: 'analyze',
    status: 'success',
    message: 'OpenAI analysis completed for 15 items',
    timestamp: new Date(Date.now() - 1000 * 60 * 29), // 29 min ago
  },
  {
    id: 3,
    type: 'post',
    status: 'success',
    message: 'Posted new analysis to Twitter',
    timestamp: new Date(Date.now() - 1000 * 60 * 28), // 28 min ago
  },
  {
    id: 4,
    type: 'scrape',
    status: 'error',
    message: 'Error scraping data: Connection timeout',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
  },
  {
    id: 5,
    type: 'analyze',
    status: 'warning',
    message: 'No significant updates found in the data',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
  },
];

const getActivityIcon = (type: string, status: string) => {
  if (status === 'error') return <AlertTriangle size={16} className="text-red-500" />;
  if (status === 'warning') return <AlertTriangle size={16} className="text-yellow-500" />;
  
  switch (type) {
    case 'scrape':
      return <FileText size={16} className="text-blue-500" />;
    case 'analyze':
      return <Check size={16} className="text-green-500" />;
    case 'post':
      return <Twitter size={16} className="text-blue-400" />;
    default:
      return <Check size={16} className="text-green-500" />;
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffMinutes < 60) {
    return `${diffMinutes} min ago`;
  } else if (diffMinutes < 1440) {
    return `${Math.floor(diffMinutes / 60)} hours ago`;
  } else {
    return date.toLocaleDateString();
  }
};

const RecentActivity: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-y-auto max-h-96">
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li 
              key={activity.id} 
              className={`p-3 rounded-lg border-l-4 ${
                activity.status === 'error' 
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/10' 
                  : activity.status === 'warning'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10'
                  : 'border-green-500 bg-green-50 dark:bg-green-900/10'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type, activity.status)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-150">
          View all activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;