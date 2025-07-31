import React from 'react';
import { CalendarClock, Twitter, Edit, Trash2 } from 'lucide-react';

// Mock data
const upcomingPosts = [
  {
    id: 1,
    content: 'Breaking: ABC Corp announced a 15% increase in quarterly profits, beating market expectations.',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
    isApproved: true,
  },
  {
    id: 2,
    content: 'XYZ Holdings released their Q2 financial results showing strong growth in the tech sector.',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    isApproved: false,
  },
  {
    id: 3,
    content: 'Market alert: Recent financial disclosures indicate potential merger between major tech companies.',
    scheduledTime: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
    isApproved: false,
  },
];

const formatScheduledTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(date);
};

const UpcomingPosts: React.FC = () => {
  return (
    <div className="space-y-4">
      {upcomingPosts.length === 0 ? (
        <div className="text-center py-8">
          <CalendarClock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No upcoming posts</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your next post will appear here once scheduled.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {upcomingPosts.map((post) => (
            <li key={post.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Twitter size={18} className="text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">{post.content}</p>
                  <div className="flex items-center mt-2">
                    <CalendarClock size={14} className="text-gray-500 dark:text-gray-400" />
                    <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {formatScheduledTime(post.scheduledTime)}
                    </span>
                    <span className={`ml-3 px-2 py-0.5 text-xs rounded-full ${
                      post.isApproved 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {post.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex space-x-1">
                  <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150">
                    <Edit size={16} />
                  </button>
                  <button className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-150">
          View all scheduled posts
        </button>
      </div>
    </div>
  );
};

export default UpcomingPosts;