import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Sun, Moon, Settings, LogOut, User, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface Notification {
  id: number;
  message: string;
  time: Date;
  read: boolean;
}

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      message: "New data scraped from KAP",
      time: new Date(Date.now() - 1000 * 60 * 30),
      read: false
    },
    {
      id: 2,
      message: "Analysis completed for recent data",
      time: new Date(Date.now() - 1000 * 60 * 60),
      read: false
    },
    {
      id: 3,
      message: "3 new posts scheduled",
      time: new Date(Date.now() - 1000 * 60 * 120),
      read: false
    }
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10 transition-colors duration-150">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
                >
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                  <Bell size={20} />
                </button>

                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            Mark all as read
                          </button>
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatNotificationTime(notification.time)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 w-full text-center">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative ml-3" ref={userMenuRef}>
                <button
                  type="button"
                  className="flex items-center rounded-full focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <User size={16} className="mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/api-settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;