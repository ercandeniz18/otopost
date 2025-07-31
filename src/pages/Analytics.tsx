import React from 'react';
import { Calendar, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Analytics: React.FC = () => {
  // Mock data for analytics
  const topPerformingPosts = [
    {
      id: 1,
      content: 'Breaking: ABC Corp announced a 15% increase in quarterly profits, beating market expectations.',
      performance: {
        impressions: 2547,
        engagements: 342,
        clicks: 86,
      },
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    },
    {
      id: 2,
      content: 'Market alert: Recent financial disclosures indicate potential merger between major tech companies.',
      performance: {
        impressions: 1892,
        engagements: 245,
        clicks: 63,
      },
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    },
    {
      id: 3,
      content: 'XYZ Holdings released their Q2 financial results showing strong growth in the tech sector.',
      performance: {
        impressions: 1356,
        engagements: 189,
        clicks: 47,
      },
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    },
  ];

  const monthlyStats = {
    postsCreated: 64,
    totalImpressions: 48750,
    totalEngagements: 6432,
    avgEngagementRate: 13.2,
    changeFromLastMonth: {
      postsCreated: 15,
      impressions: 12.5,
      engagements: 8.7,
      engagementRate: -2.1,
    },
  };

  // Format date for posts
  const formatPostDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Track performance of your automated posts</p>
      </div>

      {/* Monthly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Posts Created */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Posts Created</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{monthlyStats.postsCreated}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
              <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {monthlyStats.changeFromLastMonth.postsCreated > 0 ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {monthlyStats.changeFromLastMonth.postsCreated}% from last month
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDownRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {Math.abs(monthlyStats.changeFromLastMonth.postsCreated)}% from last month
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Total Impressions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Impressions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{monthlyStats.totalImpressions.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/20">
              <TrendingUp size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {monthlyStats.changeFromLastMonth.impressions > 0 ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {monthlyStats.changeFromLastMonth.impressions}% from last month
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDownRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {Math.abs(monthlyStats.changeFromLastMonth.impressions)}% from last month
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Total Engagements */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Engagements</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{monthlyStats.totalEngagements.toLocaleString()}</p>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20">
              <BarChart3 size={20} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {monthlyStats.changeFromLastMonth.engagements > 0 ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {monthlyStats.changeFromLastMonth.engagements}% from last month
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDownRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {Math.abs(monthlyStats.changeFromLastMonth.engagements)}% from last month
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Engagement Rate</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{monthlyStats.avgEngagementRate}%</p>
            </div>
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/20">
              <TrendingUp size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {monthlyStats.changeFromLastMonth.engagementRate > 0 ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <ArrowUpRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {monthlyStats.changeFromLastMonth.engagementRate}% from last month
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600 dark:text-red-400">
                <ArrowDownRight size={14} />
                <span className="text-xs font-medium ml-1">
                  {Math.abs(monthlyStats.changeFromLastMonth.engagementRate)}% from last month
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart (Placeholder) */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance Over Time</h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Chart would be implemented here with a library like Chart.js or Recharts
            </p>
          </div>
        </div>

        {/* Top Performing Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Top Performing Posts</h2>
          <div className="space-y-4">
            {topPerformingPosts.map((post) => (
              <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                  {post.content}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Impressions</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.performance.impressions.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Engagements</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.performance.engagements.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Clicks</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{post.performance.clicks.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar size={12} className="mr-1" />
                  {formatPostDate(post.postedAt)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-150">
              View all posts
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity Metrics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Posts</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Impressions</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Engagements</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Clicks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Eng. Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(7)].map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - index);
                
                // Generate random metrics for demonstration
                const posts = Math.floor(Math.random() * 4) + 1;
                const impressions = Math.floor(Math.random() * 1500) + 500;
                const engagements = Math.floor(impressions * (Math.random() * 0.15 + 0.05));
                const clicks = Math.floor(engagements * (Math.random() * 0.4 + 0.1));
                const engRate = ((engagements / impressions) * 100).toFixed(1);
                
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{posts}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{impressions.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{engagements.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{clicks.toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{engRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;