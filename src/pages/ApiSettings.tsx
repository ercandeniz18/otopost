import React, { useState } from 'react';
import { Key, Bot, Twitter, Eye, EyeOff, Save, RefreshCw } from 'lucide-react';

interface ApiKeyInfo {
  key: string;
  status: 'verified' | 'invalid' | 'unverified';
  lastVerified?: string;
}

const ApiSettings: React.FC = () => {
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showTwitterKey, setShowTwitterKey] = useState(false);
  const [openAIKey, setOpenAIKey] = useState<ApiKeyInfo>({
    key: '',
    status: 'unverified',
  });
  const [twitterApiKey, setTwitterApiKey] = useState<ApiKeyInfo>({
    key: '',
    status: 'unverified',
  });
  const [twitterApiSecret, setTwitterApiSecret] = useState<ApiKeyInfo>({
    key: '',
    status: 'unverified',
  });
  const [twitterAccessToken, setTwitterAccessToken] = useState<ApiKeyInfo>({
    key: '',
    status: 'unverified',
  });
  const [twitterAccessSecret, setTwitterAccessSecret] = useState<ApiKeyInfo>({
    key: '',
    status: 'unverified',
  });

  const verifyKeys = () => {
    // Simulate API verification
    console.log("Verifying API keys...");
    // In a real app, this would call an API to verify the keys
  };

  const saveKeys = () => {
    // Save API keys
    console.log("Saving API keys...");
    // In a real app, this would securely store the API keys
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your API keys for OpenAI and Twitter</p>
      </div>

      <div className="grid gap-6">
        {/* OpenAI API Key */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bot size={24} className="text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">OpenAI API Key</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This key is used to analyze scraped data and generate Twitter posts. Get your API key from the 
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline"> OpenAI dashboard</a>.
            </p>
            
            <div className="relative">
              <input
                type={showOpenAIKey ? 'text' : 'password'}
                value={openAIKey.key}
                onChange={(e) => setOpenAIKey({...openAIKey, key: e.target.value, status: 'unverified'})}
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {showOpenAIKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {openAIKey.status === 'verified' && (
              <div className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <RefreshCw size={14} className="mr-1" />
                Last verified: {openAIKey.lastVerified}
              </div>
            )}
            
            {openAIKey.status === 'invalid' && (
              <div className="text-sm text-red-600 dark:text-red-400">
                Invalid API key. Please check and try again.
              </div>
            )}
          </div>
        </div>

        {/* Twitter API Keys */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Twitter size={24} className="text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Twitter API Keys</h2>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              These keys are used to post tweets automatically. Get your API keys from the 
              <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline"> Twitter Developer Portal</a>.
            </p>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showTwitterKey ? 'text' : 'password'}
                    value={twitterApiKey.key}
                    onChange={(e) => setTwitterApiKey({...twitterApiKey, key: e.target.value, status: 'unverified'})}
                    placeholder="Enter Twitter API Key"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => setShowTwitterKey(!showTwitterKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    {showTwitterKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* API Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Secret</label>
                <input
                  type="password"
                  value={twitterApiSecret.key}
                  onChange={(e) => setTwitterApiSecret({...twitterApiSecret, key: e.target.value, status: 'unverified'})}
                  placeholder="Enter Twitter API Secret"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {/* Access Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Access Token</label>
                <input
                  type="password"
                  value={twitterAccessToken.key}
                  onChange={(e) => setTwitterAccessToken({...twitterAccessToken, key: e.target.value, status: 'unverified'})}
                  placeholder="Enter Access Token"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              {/* Access Token Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Access Token Secret</label>
                <input
                  type="password"
                  value={twitterAccessSecret.key}
                  onChange={(e) => setTwitterAccessSecret({...twitterAccessSecret, key: e.target.value, status: 'unverified'})}
                  placeholder="Enter Access Token Secret"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button 
          onClick={verifyKeys}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150"
        >
          <RefreshCw size={16} />
          <span>Verify Keys</span>
        </button>
        <button 
          onClick={saveKeys}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors duration-150"
        >
          <Save size={16} />
          <span>Save Keys</span>
        </button>
      </div>
    </div>
  );
};

export default ApiSettings;