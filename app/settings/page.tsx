'use client';

import { useState, useEffect } from 'react';
import { 
  Key, 
  Camera, 
  Database, 
  Info, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { clearAllHistory, getStorageStats } from '@/lib/storage';
import { checkApiKey } from '@/lib/api-client';

export default function SettingsPage() {
  const [isApiKeyValid, setIsApiKeyValid] = useState(false);
  const [storageStats, setStorageStats] = useState({ count: 0, sizeKB: 0 });
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check API key status
    const checkKey = async () => {
      setIsChecking(true);
      const result = await checkApiKey();
      setIsApiKeyValid(result.valid);
      setIsChecking(false);
    };

    checkKey();

    // Get storage stats
    const stats = getStorageStats();
    setStorageStats(stats);
  }, []);

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllHistory();
      const stats = getStorageStats();
      setStorageStats(stats);
      alert('All data cleared successfully!');
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600 mb-8">Configure your Re3 app</p>

        {/* API Configuration */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#20B2AA] to-[#2E8B57] rounded-full flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">OpenAI API Key</h2>
              <p className="text-sm text-gray-600">Required for product analysis</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Status</span>
              {isChecking ? (
                <span className="text-sm text-gray-500">Checking...</span>
              ) : isApiKeyValid ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Configured</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Not Configured</span>
                </div>
              )}
            </div>

            {!isApiKeyValid && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-yellow-800 mb-2">
                  ⚠️ API key not found. Add it to your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file:
                </p>
                <code className="block text-xs bg-gray-900 text-green-400 p-2 rounded mt-2">
                  OPENAI_API_KEY=sk-your-key-here
                </code>
              </div>
            )}
          </div>

          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group"
          >
            <span className="text-sm font-medium text-gray-700">Get OpenAI API Key</span>
            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          </a>
        </div>

        {/* Camera Settings */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#20B2AA] to-[#2E8B57] rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Camera</h2>
              <p className="text-sm text-gray-600">Camera permissions and settings</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Default Camera</span>
              <span className="text-sm text-gray-500">Back (Environment)</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Resolution</span>
              <span className="text-sm text-gray-500">1920x1080</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Auto-scan Barcode</span>
              <span className="text-sm text-green-600 font-medium">Enabled</span>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#20B2AA] to-[#2E8B57] rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Data Storage</h2>
              <p className="text-sm text-gray-600">Manage local storage and history</p>
            </div>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Saved Scans</span>
              <span className="text-sm font-medium text-gray-800">{storageStats.count}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Storage Used</span>
              <span className="text-sm font-medium text-gray-800">{storageStats.sizeKB} KB</span>
            </div>
          </div>

          <button
            onClick={handleClearData}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 font-semibold rounded-full hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Clear All Data
          </button>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#20B2AA] to-[#2E8B57] rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">About Re3</h2>
              <p className="text-sm text-gray-600">Reduce Reuse Recycle</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Version</span>
              <span className="text-sm text-gray-800 font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Framework</span>
              <span className="text-sm text-gray-800 font-medium">Next.js 16</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">AI Model</span>
              <span className="text-sm text-gray-800 font-medium">GPT-4o</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-[#e0f7f4] to-[#e8f5e9] rounded-lg">
            <p className="text-sm text-gray-700 mb-2">
              Re3 uses AI to help you make more sustainable choices by analyzing products for their environmental impact.
            </p>
            <p className="text-xs text-gray-600">
              Data is stored locally on your device. API calls are made to OpenAI for product analysis.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-600 hover:text-[#20B2AA] transition-colors"
          >
            View on GitHub
          </a>
          <a
            href="#"
            className="block text-sm text-gray-600 hover:text-[#20B2AA] transition-colors"
          >
            Privacy Policy
          </a>
          <p className="text-xs text-gray-500 mt-4">
            Made with 💚 for a sustainable future
          </p>
        </div>
      </div>
    </div>
  );
}


