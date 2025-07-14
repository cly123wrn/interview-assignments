import React from 'react';
import { 
  Cog6ToothIcon,
  BellIcon,
  EyeIcon,
  DocumentTextIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';
import { useFilter } from '../contexts/FilterContext';

function Settings() {
  const filters = useFilter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your AI News Hub experience
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Display Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <EyeIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Display Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Show Article Summaries</label>
                <p className="text-sm text-gray-500">Display AI-generated summaries for articles</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showSummaries}
                  onChange={(e) => filters.setShowSummaries(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">Show Article Images</label>
                <p className="text-sm text-gray-500">Display thumbnail images when available</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.showImages}
                  onChange={(e) => filters.setShowImages(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <BellIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Coming Soon:</strong> Push notifications for trending articles and personalized news alerts.
              </p>
            </div>

            <div className="space-y-3 opacity-50">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Push Notifications</label>
                  <p className="text-sm text-gray-500">Get notified about trending AI news</p>
                </div>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input type="checkbox" disabled className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Email Digest</label>
                  <p className="text-sm text-gray-500">Weekly summary of top AI news</p>
                </div>
                <label className="relative inline-flex items-center cursor-not-allowed">
                  <input type="checkbox" disabled className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Content Preferences */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <DocumentTextIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Content Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Default Sort Order
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => filters.setSortBy(e.target.value)}
                className="input-field w-full max-w-xs"
              >
                <option value="hotness">Hotness Score</option>
                <option value="date">Publication Date</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Minimum Hotness Filter
              </label>
              <div className="max-w-xs">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.minHotness}
                  onChange={(e) => filters.setMinHotness(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>All Articles</span>
                  <span>Hot Only</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Current: {(filters.minHotness * 100).toFixed(0)}% minimum hotness
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <PaintBrushIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">About AI News Hub</h2>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              AI News Hub is your central destination for the latest developments in artificial intelligence. 
              We aggregate news from top sources and use advanced algorithms to rank articles by community engagement and relevance.
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Features:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Real-time news aggregation</li>
                  <li>AI-powered summarization</li>
                  <li>Hotness ranking algorithm</li>
                  <li>Advanced filtering</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-900">Sources:</p>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>TechCrunch AI</li>
                  <li>MIT Technology Review</li>
                  <li>VentureBeat AI</li>
                  <li>The Verge AI</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Reset Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reset Settings</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Reset all filters and preferences to their default values.
              </p>
            </div>
            <button
              onClick={filters.resetFilters}
              className="btn-secondary"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;