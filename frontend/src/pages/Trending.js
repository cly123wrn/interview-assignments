import React from 'react';
import { useQuery } from 'react-query';
import { toast } from 'react-hot-toast';
import { FireIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

// Components
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { ArticleCardSkeleton } from '../components/LoadingSpinner';

// Services
import { articlesAPI, queryKeys, getErrorMessage } from '../services/api';

// Context
import { useFilter } from '../contexts/FilterContext';

function Trending() {
  const filters = useFilter();

  // Fetch trending articles
  const {
    data: trendingData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: queryKeys.trending(50),
    queryFn: () => articlesAPI.getTrending(50),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });

  const articles = trendingData?.articles || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <FireIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Trending Now
            </h1>
            <p className="text-gray-600 mt-1">
              The hottest AI news based on engagement and community interest
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUpIcon className="h-4 w-4" />
          <span>Real-time rankings</span>
        </div>
      </div>

      {/* Trending Info */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <FireIcon className="h-5 w-5 text-orange-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-orange-900">How we rank trending articles</h3>
            <p className="text-sm text-orange-700 mt-1">
              Articles are ranked by our hotness algorithm which considers engagement metrics like shares, 
              comments, citations, views, and recency. Higher scores indicate more community interest and discussion.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <FireIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load trending articles</h3>
          <p className="text-gray-600 mb-4">{getErrorMessage(error)}</p>
          <button onClick={refetch} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(10)].map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FireIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No trending articles available</h3>
          <p className="text-gray-600">
            Check back later for trending content.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top 3 Articles - Featured Display */}
          {articles.slice(0, 3).length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded text-sm mr-2">
                  TOP 3
                </span>
                Most Trending Right Now
              </h2>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
                {articles.slice(0, 3).map((article, index) => (
                  <div key={article.id} className="relative">
                    {/* Ranking Badge */}
                    <div className="absolute -left-2 -top-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-6">
                      <ArticleCard
                        article={article}
                        showSummary={filters.showSummaries}
                        showImage={filters.showImages}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remaining Articles */}
          {articles.slice(3).length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                More Trending Articles
              </h2>
              <div className="space-y-4">
                {articles.slice(3).map((article, index) => (
                  <div key={article.id} className="relative">
                    {/* Ranking Number */}
                    <div className="absolute -left-8 top-4 text-sm font-semibold text-gray-400">
                      #{index + 4}
                    </div>
                    <ArticleCard
                      article={article}
                      showSummary={filters.showSummaries}
                      showImage={filters.showImages}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          {articles.length > 0 && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Trending Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Total Articles:</span>
                  <span className="ml-2 font-semibold">{articles.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Avg Hotness:</span>
                  <span className="ml-2 font-semibold">
                    {(articles.reduce((sum, a) => sum + (a.hotness_score || 0), 0) / articles.length).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Top Score:</span>
                  <span className="ml-2 font-semibold">
                    {Math.max(...articles.map(a => a.hotness_score || 0)).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Sources:</span>
                  <span className="ml-2 font-semibold">
                    {new Set(articles.map(a => a.source)).size}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Trending;