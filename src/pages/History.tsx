import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Twitter, Database, Bot, Search } from 'lucide-react';

interface HistoryEntry {
  id: number;
  timestamp: Date;
  type: 'scrape' | 'analyze' | 'post';
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: {
    url?: string;
    postContent?: string;
    errorCode?: string;
    errorMessage?: string;
  };
}

const History: React.FC = () => {
  // Mock data for the history
  const [entries] = useState<HistoryEntry[]>([
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'scrape',
      status: 'success',
      message: 'Successfully scraped 15 new items from KAP.org.tr',
      details: {
        url: 'https://www.kap.org.tr/tr/bist-sirketler',
      },
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 29),
      type: 'analyze',
      status: 'success',
      message: 'OpenAI analysis completed for 15 items',
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 28),
      type: 'post',
      status: 'success',
      message: 'Posted new analysis to Twitter',
      details: {
        postContent: '📈 Financial Update: XYZ Corp has reported quarterly earnings of $2.5B. This represents a 15% increase from previous period. #FinancialNews #XYZ',
      },
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      type: 'scrape',
      status: 'error',
      message: 'Error scraping data: Connection timeout',
      details: {
        url: 'https://www.kap.org.tr/tr/bildirim-sorgu',
        errorCode: 'ETIMEDOUT',
        errorMessage: 'Connection timed out after 30 seconds',
      },
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      type: 'analyze',
      status: 'warning',
      message: 'No significant updates found in the data',
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: 'post',
      status: 'success',
      message: 'Posted new analysis to Twitter',
      details: {
        postContent: '🚨 BREAKING: ABC Inc has just announced a major acquisition of DEF Technologies. Market implications could be significant. #MarketNews #Tech',
      },
    },
    {
      id: 7,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      type: 'scrape',
      status: 'success',
      message: 'Successfully scraped 8 new items from KAP.org.tr',
      details: {
        url: 'https://www.kap.org.tr/tr/bist-sirketler',
      },
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<{
    type: string | null;
    status: string | null;
    search: string;
  }>({
    type: null,
    status: null,
    search: '',
  });
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);

  const entriesPerPage = 5;

  // Filter entries based on the current filter
  const filteredEntries = entries.filter(entry => {
    let matches = true;
    
    if (filter.type && filter.type !== 'all') {
      matches = matches && entry.type === filter.type;
    }
    
    if (filter.status && filter.status !== 'all') {
      matches = matches && entry.status === filter.status;
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      matches = matches && (
        entry.message.toLowerCase().includes(searchLower) ||
        entry.details?.url?.toLowerCase().includes(searchLower) ||
        entry.details?.postContent?.toLowerCase().includes(searchLower) ||
        false
      );
    }
    
    return matches;
  });

  const viewDetails = (entry: HistoryEntry) => {
    setSelectedEntry(entry);
  };

  const closeDetails = () => {
    setSelectedEntry(null);
  };
  // Paginate the filtered entries
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'scrape':
        return <Database size={20} className="text-blue-500" />;
      case 'analyze':
        return <Bot size={20} className="text-green-500" />;
      case 'post':
        return <Twitter size={20} className="text-blue-400" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (date: Date) => {
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Activity History</h1>
        <p className="text-gray-600 dark:text-gray-400">View past automation activities and results</p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search activities..."
              value={filter.search}
              onChange={(e) => setFilter({...filter, search: e.target.value})}
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filter.type || 'all'}
              onChange={(e) => setFilter({...filter, type: e.target.value === 'all' ? null : e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="scrape">Scraping</option>
              <option value="analyze">Analysis</option>
              <option value="post">Posts</option>
            </select>
            
            <select
              value={filter.status || 'all'}
              onChange={(e) => setFilter({...filter, status: e.target.value === 'all' ? null : e.target.value})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            
            <button
              onClick={() => setFilter({type: null, status: null, search: ''})}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {formatTimestamp(entry.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        {getEntryIcon(entry.type)}
                        <span className="ml-2 capitalize">{entry.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.status === 'success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : entry.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                      {entry.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        onClick={() => viewDetails(entry)}
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* No results */}
          {paginatedEntries.length === 0 && (
            <div className="text-center py-10">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No results found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setFilter({type: null, status: null, search: ''})}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 ${
                    currentPage === 1 
                      ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(currentPage - 1) * entriesPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * entriesPerPage, filteredEntries.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredEntries.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === 1 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft size={18} />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight size={18} />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Details</h3>
                <button
                  onClick={closeDetails}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{selectedEntry.type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${
                    selectedEntry.status === 'success' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                      : selectedEntry.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }`}>
                    {selectedEntry.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedEntry.message}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedEntry.timestamp.toLocaleString()}</p>
                </div>
                
                {selectedEntry.details && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
                    <div className="mt-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      {selectedEntry.details.url && (
                        <p className="text-sm text-gray-900 dark:text-white mb-2">
                          <strong>URL:</strong> {selectedEntry.details.url}
                        </p>
                      )}
                      {selectedEntry.details.postContent && (
                        <p className="text-sm text-gray-900 dark:text-white mb-2">
                          <strong>Post Content:</strong> {selectedEntry.details.postContent}
                        </p>
                      )}
                      {selectedEntry.details.errorCode && (
                        <p className="text-sm text-gray-900 dark:text-white mb-2">
                          <strong>Error Code:</strong> {selectedEntry.details.errorCode}
                        </p>
                      )}
                      {selectedEntry.details.errorMessage && (
                        <p className="text-sm text-gray-900 dark:text-white">
                          <strong>Error Message:</strong> {selectedEntry.details.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;