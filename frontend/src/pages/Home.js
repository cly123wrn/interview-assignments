import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { 
  ArrowPathIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline';

// Components
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner, { ArticleCardSkeleton } from '../components/LoadingSpinner';

// Services
import { articlesAPI, statsAPI, queryKeys, buildArticleQuery, getErrorMessage } from '../services/api';

// Context
import { useFilter } from '../contexts/FilterContext';

function Home() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();
  const filters = useFilter();

  // Build query parameters from filters
  const queryParams = buildArticleQuery(filters);

  // Fetch articles
  const {
    data: articlesData,
    isLoading: articlesLoading,
    error: articlesError,
    refetch: refetchArticles
  } = useQuery({
    queryKey: queryKeys.articles(filters, page),
    queryFn: () => articlesAPI.getArticles({ ...queryParams, page, per_page: 20 }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: (data) => {
      if (page === 1) {
        setArticles(data.articles || []);
      } else {
        setArticles(prev => [...prev, ...(data.articles || [])]);
      }
      setHasMore(data.pagination?.has_next || false);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    }
  });

  // Fetch statistics
  const {
    data: stats,
    isLoading: statsLoading
  } = useQuery({
    queryKey: queryKeys.stats(),
    queryFn: statsAPI.getStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch trending keywords
  const {
    data: trendingKeywords,
    isLoading: keywordsLoading
  } = useQuery({
    queryKey: queryKeys.trendingKeywords(10),
    queryFn: () => statsAPI.getTrendingKeywords(10),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setHasMore(true);
  }, [filters.selectedSources, filters.selectedCategories, filters.minHotness, filters.sortBy]);

  // Load more articles for infinite scroll
  const loadMore = () => {
    if (!articlesLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    try {
      setPage(1);
      setArticles([]);
      setHasMore(true);
      await queryClient.invalidateQueries(queryKeys.articles(filters, 1));
      toast.success('Articles refreshed!');
    } catch (error) {
      toast.error('Failed to refresh articles');
    }
  };

  // Trigger scraping
  const handleScrape = async () => {
    try {
      const response = await articlesAPI.triggerScrape();
      toast.success(response.message || 'Scraping started!');
      // Refresh after a delay to allow scraping to complete
      setTimeout(() => {
        queryClient.invalidateQueries(queryKeys.articles(filters, 1));
        queryClient.invalidateQueries(queryKeys.stats());
      }, 5000);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            AI News Hub
          </h1>
          <p className="text-gray-600 mt-1">
            Stay updated with the latest in artificial intelligence
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={articlesLoading}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${articlesLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleScrape}
            className="btn-primary flex items-center space-x-2"
          >
            <NewspaperIcon className="h-4 w-4" />
            <span>Update News</span>
          </button>
        </div>
      </div>

      {/* Stats Section */}
      {stats && !statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <NewspaperIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Articles</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.stats?.total_articles || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Hotness</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(stats.stats?.average_hotness || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Views</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(stats.stats?.total_views || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Period</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats.period || '7 days'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trending Keywords */}
      {trendingKeywords && trendingKeywords.keywords && trendingKeywords.keywords.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Trending Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.keywords.slice(0, 15).map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200 cursor-pointer transition-colors duration-200"
                onClick={() => filters.setSearchQuery(item.keyword)}
              >
                {item.keyword}
                <span className="ml-1.5 text-primary-500">({item.count})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Active Filters Display */}
        {(filters.selectedSources.length > 0 || filters.selectedCategories.length > 1 || filters.minHotness > 0) && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">Active Filters:</h4>
              <button
                onClick={filters.resetFilters}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {filters.selectedSources.map(source => (
                <span key={source} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                  Source: {source}
                </span>
              ))}
              {filters.selectedCategories.filter(cat => cat !== 'AI').map(category => (
                <span key={category} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                  Category: {category}
                </span>
              ))}
              {filters.minHotness > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700">
                  Min Hotness: {(filters.minHotness * 100).toFixed(0)}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Articles Feed */}
        {articlesError ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <NewspaperIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load articles</h3>
            <p className="text-gray-600 mb-4">{getErrorMessage(articlesError)}</p>
            <button onClick={refetchArticles} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : articles.length === 0 && !articlesLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <NewspaperIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or check back later for new content.
            </p>
            <button onClick={handleScrape} className="btn-primary">
              Update News
            </button>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={articles.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="space-y-4 mt-4">
                {[...Array(3)].map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </div>
            }
            endMessage={
              <div className="text-center py-8 text-gray-500">
                <p>You've reached the end of the feed!</p>
              </div>
            }
          >
            <div className="space-y-4">
              {articlesLoading && page === 1 ? (
                [...Array(5)].map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))
              ) : (
                articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    showSummary={filters.showSummaries}
                    showImage={filters.showImages}
                  />
                ))
              )}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

export default Home;