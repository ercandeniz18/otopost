import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Clock, 
  BarChart3, 
  Database,
  Twitter,
  Bot,
  CreditCard
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'API Settings', icon: <Settings size={20} />, path: '/api-settings' },
    { name: 'Scraper Settings', icon: <Database size={20} />, path: '/scraper-settings' },
    { name: 'Post Templates', icon: <FileText size={20} />, path: '/templates' },
    { name: 'History', icon: <Clock size={20} />, path: '/history' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Subscription', icon: <CreditCard size={20} />, path: '/subscription' },
  ];

  return (
    <aside 
      className={`${isExpanded ? 'w-64' : 'w-20'} h-screen bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hidden md:block`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
        <div className={`flex items-center ${isExpanded ? 'justify-start pl-4' : 'justify-center'} space-x-2 flex-1`}>
          <div className="flex items-center justify-center p-2 rounded-lg bg-blue-600">
            <Bot size={24} className="text-white" />
          </div>
          {isExpanded && (
            <span className="text-xl font-bold text-gray-800 dark:text-white">AutoPost</span>
          )}
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mr-4 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${isExpanded ? 'rotate-0' : 'rotate-180'}`} 
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-lg
                  ${isActive 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                  transition-colors duration-150
                `}
              >
                <span className="min-w-[20px]">{item.icon}</span>
                {isExpanded && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom section with Twitter info */}
      {isExpanded && (
        <div className="absolute bottom-0 w-full p-4 border-t dark:border-gray-700">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Twitter size={16} />
            <span className="text-sm">Connected</span>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;