import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { 
  ShareIcon, 
  BookmarkIcon, 
  EyeIcon,
  ChatBubbleLeftIcon,
  FireIcon,
  ClockIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { 
  ShareIcon as ShareIconSolid,
  BookmarkIcon as BookmarkIconSolid 
} from '@heroicons/react/24/solid';
import { useFilter } from '../contexts/FilterContext';

function ArticleCard({ article, showSummary = true, showImage = true }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const { showSummaries, showImages } = useFilter();

  const shouldShowSummary = showSummary && showSummaries && article.summary;
  const shouldShowImage = showImage && showImages && article.image_url;

  const getHotnessColor = (score) => {
    if (score >= 0.8) return 'text-red-600 bg-red-50';
    if (score >= 0.6) return 'text-orange-600 bg-orange-50';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-50';
    if (score >= 0.2) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getHotnessLabel = (score) => {
    if (score >= 0.8) return 'Very Hot';
    if (score >= 0.6) return 'Hot';
    if (score >= 0.4) return 'Warm';
    if (score >= 0.2) return 'Cool';
    return 'New';
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      case 'neutral': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimeAgo = (dateString) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary || 'Check out this AI news article',
          url: article.url,
        });
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(article.url);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Implement bookmark API call
  };

  const parseKeywords = (keywordsString) => {
    try {
      const keywords = JSON.parse(keywordsString || '[]');
      return Array.isArray(keywords) ? keywords.slice(0, 5) : [];
    } catch (error) {
      return [];
    }
  };

  const keywords = parseKeywords(article.keywords);

  return (
    <article className="article-card animate-fade-in">
      {/* Article Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span className="font-medium text-primary-600">{article.source}</span>
          <span>•</span>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            {formatTimeAgo(article.published_at)}
          </div>
          {article.author && (
            <>
              <span>•</span>
              <span>by {article.author}</span>
            </>
          )}
        </div>
        
        {/* Hotness Score */}
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getHotnessColor(article.hotness_score)}`}>
          <FireIcon className="h-3 w-3 mr-1" />
          {getHotnessLabel(article.hotness_score)}
        </div>
      </div>

      {/* Article Content */}
      <div className="flex gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900 mb-2 leading-tight hover:text-primary-600 transition-colors duration-200">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="line-clamp-2"
            >
              {article.title}
            </a>
          </h2>

          {/* Summary */}
          {shouldShowSummary && (
            <p className="text-gray-600 mb-3 leading-relaxed line-clamp-3">
              {article.summary}
            </p>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <TagIcon className="h-4 w-4 text-gray-400" />
              {keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors duration-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Article Image */}
        {shouldShowImage && (
          <div className="flex-shrink-0 w-32 h-24 lg:w-40 lg:h-28">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Article Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
        {/* Engagement Metrics */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {article.views > 0 && (
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {article.views.toLocaleString()}
            </div>
          )}
          {article.comments > 0 && (
            <div className="flex items-center">
              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
              {article.comments}
            </div>
          )}
          {article.sentiment && (
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(article.sentiment)}`}>
              {article.sentiment}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleShare}
            className={`p-2 rounded-md transition-colors duration-200 ${
              isShared 
                ? 'text-primary-600 bg-primary-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title="Share article"
          >
            {isShared ? (
              <ShareIconSolid className="h-4 w-4" />
            ) : (
              <ShareIcon className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={handleBookmark}
            className={`p-2 rounded-md transition-colors duration-200 ${
              isBookmarked 
                ? 'text-yellow-600 bg-yellow-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title="Bookmark article"
          >
            {isBookmarked ? (
              <BookmarkIconSolid className="h-4 w-4" />
            ) : (
              <BookmarkIcon className="h-4 w-4" />
            )}
          </button>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors duration-200"
          >
            Read Full Article
          </a>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;