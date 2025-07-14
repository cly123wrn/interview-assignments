import React, { useState } from 'react';
import { 
  AdjustmentsHorizontalIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { useFilter } from '../contexts/FilterContext';

const SOURCES = [
  'TechCrunch AI',
  'VentureBeat AI',
  'MIT Technology Review AI',
  'The Verge AI',
  'Wired AI',
  'IEEE Spectrum AI',
  'Ars Technica AI',
  'AI News'
];

const CATEGORIES = [
  'AI',
  'Machine Learning',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Robotics',
  'Data Science',
  'Policy & Regulation'
];

function Sidebar() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    sources: true,
    categories: true,
    hotness: true,
    settings: false
  });

  const {
    selectedSources,
    selectedCategories,
    minHotness,
    sortBy,
    showSummaries,
    showImages,
    addSource,
    removeSource,
    addCategory,
    removeCategory,
    setMinHotness,
    setSortBy,
    setShowSummaries,
    setShowImages,
    resetFilters
  } = useFilter();

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSourceChange = (source) => {
    if (selectedSources.includes(source)) {
      removeSource(source);
    } else {
      addSource(source);
    }
  };

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      removeCategory(category);
    } else {
      addCategory(category);
    }
  };

  const getHotnessLabel = (value) => {
    if (value >= 0.8) return 'Very Hot';
    if (value >= 0.6) return 'Hot';
    if (value >= 0.4) return 'Warm';
    if (value >= 0.2) return 'Cool';
    return 'All';
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFiltersOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors duration-200"
      >
        <FunnelIcon className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {isFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <SidebarContent />
        </div>
      </aside>
    </>
  );

  function SidebarContent() {
    return (
      <div className="space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
          >
            Reset
          </button>
        </div>

        {/* Sources Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('sources')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">Sources</h4>
            {openSections.sources ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {openSections.sources && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {SOURCES.map((source) => (
                <label key={source} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => handleSourceChange(source)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{source}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categories Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">Categories</h4>
            {openSections.categories ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {openSections.categories && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {CATEGORIES.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Hotness Filter */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('hotness')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">Hotness Level</h4>
            {openSections.hotness ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {openSections.hotness && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Minimum Hotness: {getHotnessLabel(minHotness)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={minHotness}
                  onChange={(e) => setMinHotness(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>All</span>
                  <span>Hot</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Sort By</h4>
          <div className="space-y-2">
            {[
              { value: 'hotness', label: 'Hotness Score' },
              { value: 'date', label: 'Publication Date' },
              { value: 'relevance', label: 'Relevance' }
            ].map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.value}
                  checked={sortBy === option.value}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('settings')}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="text-sm font-medium text-gray-900">Display</h4>
            {openSections.settings ? (
              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {openSections.settings && (
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showSummaries}
                  onChange={(e) => setShowSummaries(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show Summaries</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showImages}
                  onChange={(e) => setShowImages(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show Images</span>
              </label>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Sidebar;