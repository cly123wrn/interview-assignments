import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Components
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { ArticleCardSkeleton } from '../components/LoadingSpinner';

// Services
import { articlesAPI, queryKeys, getErrorMessage } from '../services/api';

// Context
import { useFilter } from '../contexts/FilterContext';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [localQuery, setLocalQuery] = useState('');
  const filters = useFilter();

  const query = searchParams.get('q') || '';

  // Sync local query with URL parameter
  useEffect(() => {
    setLocalQuery(query);
    filters.setSearchQuery(query);
  }, [query]);

  // Fetch search results
  const {
    data: searchData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: queryKeys.search(query, filters, 1),
    queryFn: () => articlesAPI.search(query, { per_page: 50 }),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchParams({ q: localQuery.trim() });
    }
  };

  const articles = searchData?.articles || [];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary-100 rounded-lg">
            <MagnifyingGlassIcon className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Search AI News
            </h1>
            <p className="text-gray-600 mt-1">
              Find specific AI articles, topics, or keywords
            </p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Search for AI news, topics, or keywords..."
                className="input-field w-full text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={!localQuery.trim()}
              className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Search Results */}
      {!query ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search AI News</h3>
          <p className="text-gray-600">
            Enter keywords to search through our AI news database
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search failed</h3>
          <p className="text-gray-600 mb-4">{getErrorMessage(error)}</p>
          <button onClick={refetch} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 loading-skeleton"></div>
            <div className="h-6 w-24 loading-skeleton"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results for "{query}"
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {searchData?.pagination?.total || articles.length} articles found
              </p>
            </div>
            {searchData?.pagination && (
              <div className="text-sm text-gray-500">
                Page {searchData.pagination.page} of {searchData.pagination.pages}
              </div>
            )}
          </div>

          {/* No Results */}
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                No articles match your search query "{query}". Try different keywords or check your spelling.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Search suggestions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['machine learning', 'chatgpt', 'neural networks', 'openai', 'deep learning'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setLocalQuery(suggestion);
                        setSearchParams({ q: suggestion });
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  showSummary={filters.showSummaries}
                  showImage={filters.showImages}
                />
              ))}
            </div>
          )}

          {/* Search Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Search Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use specific keywords like "GPT-4", "machine learning", or "neural networks"</li>
              <li>• Search for company names like "OpenAI", "Google", or "Microsoft"</li>
              <li>• Try topic-based searches like "AI regulation", "computer vision", or "robotics"</li>
              <li>• Use quotes for exact phrases: "large language model"</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;