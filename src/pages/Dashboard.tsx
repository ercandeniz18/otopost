import React from 'react';
import { Play, Pause, RefreshCw, Check, AlertTriangle, Clock, Twitter } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusCard from '../components/dashboard/StatusCard';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpcomingPosts from '../components/dashboard/UpcomingPosts';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const [automationActive, setAutomationActive] = React.useState(true);
  const [isRunning, setIsRunning] = React.useState(false);
  const lastSuccessfulRun = '2 hours ago';
  const nextScheduledRun = '1 hour';
  const postsCreated = 12;
  const dataSources = 3;

  const toggleAutomation = async () => {
    try {
      setAutomationActive(!automationActive);
      toast.success(automationActive ? 'Automation paused' : 'Automation started');
    } catch (error) {
      toast.error('Failed to toggle automation');
    }
  };

  const runNow = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    toast.loading('Running automation...', { id: 'run-now' });
    
    try {
      // Simulate automation run
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast.success('Automation completed successfully', { id: 'run-now' });
    } catch (error) {
      toast.error('Automation failed', { id: 'run-now' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and control your automation</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button 
            onClick={toggleAutomation}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              automationActive 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            } transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {automationActive ? (
              <>
                <Pause size={16} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Start</span>
              </>
            )}
          </button>
          <button 
            onClick={runNow}
            disabled={isRunning}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={16} className={isRunning ? 'animate-spin' : ''} />
            <span>{isRunning ? 'Running...' : 'Run Now'}</span>
          </button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          title="Automation Status" 
          value={automationActive ? 'Active' : 'Inactive'} 
          icon={automationActive ? <Check className="text-green-500" size={20} /> : <Pause className="text-gray-500" size={20} />}
          color={automationActive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800'}
          textColor={automationActive ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-400'}
        />
        <StatusCard 
          title="Last Run" 
          value={lastSuccessfulRun} 
          icon={<Clock className="text-blue-500" size={20} />}
          color="bg-blue-100 dark:bg-blue-900/20"
          textColor="text-blue-700 dark:text-blue-400"
        />
        <StatusCard 
          title="Next Run" 
          value={nextScheduledRun} 
          icon={<Clock className="text-purple-500" size={20} />}
          color="bg-purple-100 dark:bg-purple-900/20"
          textColor="text-purple-700 dark:text-purple-400"
        />
        <StatusCard 
          title="Posts Created" 
          value={postsCreated.toString()} 
          icon={<Twitter className="text-blue-400" size={20} />}
          color="bg-blue-100 dark:bg-blue-900/20"
          textColor="text-blue-700 dark:text-blue-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h2>
          <RecentActivity />
        </div>

        {/* Upcoming Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Posts</h2>
          <UpcomingPosts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;