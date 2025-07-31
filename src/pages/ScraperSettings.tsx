import React, { useState } from 'react';
import { Database, Clock, Plus, Trash2, Settings, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface ScraperConfig {
  id: number;
  url: string;
  selector: string;
  interval: number;
  enabled: boolean;
}

const ScraperSettings: React.FC = () => {
  const [scraperConfigs, setScraperConfigs] = useState<ScraperConfig[]>([
    {
      id: 1,
      url: 'https://www.kap.org.tr/tr/bist-sirketler',
      selector: '.comp-cell',
      interval: 15,
      enabled: true,
    },
    {
      id: 2,
      url: 'https://www.kap.org.tr/tr/bildirim-sorgu',
      selector: '.disclosure-item',
      interval: 30,
      enabled: false,
    }
  ]);

  const [newConfig, setNewConfig] = useState<Omit<ScraperConfig, 'id'>>({
    url: '',
    selector: '',
    interval: 15,
    enabled: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const addScraperConfig = () => {
    if (!newConfig.url || !newConfig.selector) return;
    
    setScraperConfigs([
      ...scraperConfigs,
      {
        id: Date.now(),
        ...newConfig,
      }
    ]);
    
    toast.success('Data source added successfully');
    
    // Reset form
    setNewConfig({
      url: '',
      selector: '',
      interval: 15,
      enabled: true,
    });
  };

  const removeConfig = (id: number) => {
    setScraperConfigs(scraperConfigs.filter(config => config.id !== id));
    toast.success('Data source removed');
  };

  const toggleConfig = (id: number) => {
    setScraperConfigs(scraperConfigs.map(config => 
      config.id === id ? { ...config, enabled: !config.enabled } : config
    ));
    const config = scraperConfigs.find(c => c.id === id);
    toast.success(`Data source ${config?.enabled ? 'disabled' : 'enabled'}`);
  };

  const updateInterval = (id: number, interval: number) => {
    setScraperConfigs(scraperConfigs.map(config => 
      config.id === id ? { ...config, interval } : config
    ));
  };

  const saveSettings = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    toast.loading('Saving settings...', { id: 'save-settings' });
    
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully', { id: 'save-settings' });
    } catch (error) {
      toast.error('Failed to save settings', { id: 'save-settings' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scraper Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure data sources and scraping intervals</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Database size={24} className="text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Sources</h2>
        </div>
        
        <div className="space-y-6">
          {/* Existing Scraper Configs */}
          <div className="space-y-4">
            {scraperConfigs.map((config) => (
              <div 
                key={config.id} 
                className={`border rounded-lg p-4 ${
                  config.enabled 
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' 
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">{new URL(config.url).hostname}</h3>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        config.enabled 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {config.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-all">{config.url}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>Checks every {config.interval} minutes</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox"
                        id={`toggle-${config.id}`}
                        checked={config.enabled}
                        onChange={() => toggleConfig(config.id)}
                        className="sr-only"
                      />
                      <label 
                        htmlFor={`toggle-${config.id}`}
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
                          config.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span 
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in ${
                            config.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`} 
                        ></span>
                      </label>
                    </div>
                    
                    <select
                      value={config.interval}
                      onChange={(e) => updateInterval(config.id, parseInt(e.target.value))}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md px-2 py-1 text-sm"
                    >
                      <option value="5">5 min</option>
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">1 hour</option>
                      <option value="360">6 hours</option>
                    </select>
                    
                    <button 
                      onClick={() => removeConfig(config.id)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Add New Scraper Form */}
          <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Add New Data Source</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL to Scrape</label>
                <input
                  type="text"
                  value={newConfig.url}
                  onChange={(e) => setNewConfig({...newConfig, url: e.target.value})}
                  placeholder="https://www.kap.org.tr/tr/..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CSS Selector</label>
                <input
                  type="text"
                  value={newConfig.selector}
                  onChange={(e) => setNewConfig({...newConfig, selector: e.target.value})}
                  placeholder=".element-class or #element-id"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check Interval</label>
                <select
                  value={newConfig.interval}
                  onChange={(e) => setNewConfig({...newConfig, interval: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="5">Every 5 minutes</option>
                  <option value="15">Every 15 minutes</option>
                  <option value="30">Every 30 minutes</option>
                  <option value="60">Every hour</option>
                  <option value="360">Every 6 hours</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button 
                  onClick={addScraperConfig}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150"
                  disabled={!newConfig.url || !newConfig.selector}
                >
                  <Plus size={16} />
                  <span>Add Source</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Settings size={24} className="text-purple-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User Agent</label>
            <input
              type="text"
              defaultValue="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Custom user agent string for scraping requests
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Request Timeout (seconds)</label>
            <input
              type="number"
              defaultValue={30}
              min={5}
              max={120}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="use-proxy"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="use-proxy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Use proxy for scraping (avoid IP blocking)
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={saveSettings}
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          <span>{isSaving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default ScraperSettings;