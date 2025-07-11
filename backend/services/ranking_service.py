import math
import logging
from datetime import datetime, timedelta
from flask import current_app

logger = logging.getLogger(__name__)

class RankingService:
    def __init__(self):
        self.weights = {
            'shares': 0.3,
            'comments': 0.25,
            'citations': 0.2,
            'views': 0.15,
            'recency': 0.1
        }
        self.decay_factor = 0.1
    
    def calculate_hotness_score(self, article):
        """Calculate hotness score for an article"""
        try:
            # Get engagement metrics
            shares = article.get('shares', 0)
            comments = article.get('comments', 0)
            citations = article.get('citations', 0)
            views = article.get('views', 0)
            likes = article.get('likes', 0)
            
            # Get publication time
            published_at = article.get('published_at')
            if isinstance(published_at, str):
                published_at = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
            
            # Calculate time decay factor
            time_decay = self._calculate_time_decay(published_at)
            
            # Calculate engagement score
            engagement_score = self._calculate_engagement_score(
                shares, comments, citations, views, likes
            )
            
            # Calculate importance bonus
            importance_score = article.get('importance_score', 0.5)
            
            # Calculate final hotness score
            hotness = (
                engagement_score * 0.6 +
                importance_score * 0.3 +
                time_decay * 0.1
            )
            
            return min(max(hotness, 0.0), 1.0)  # Clamp between 0 and 1
        
        except Exception as e:
            logger.error(f"Error calculating hotness score: {e}")
            return 0.5  # Default score
    
    def _calculate_time_decay(self, published_at):
        """Calculate time decay factor (newer articles get higher scores)"""
        if not published_at:
            return 0.5
        
        try:
            now = datetime.utcnow()
            if published_at.tzinfo:
                now = now.replace(tzinfo=published_at.tzinfo)
            
            hours_ago = (now - published_at).total_seconds() / 3600
            
            # Time decay using exponential function
            # Recent articles (< 6 hours) get full score
            # Score decreases exponentially after that
            if hours_ago <= 6:
                return 1.0
            elif hours_ago <= 24:
                return 0.8
            elif hours_ago <= 72:  # 3 days
                return 0.6
            elif hours_ago <= 168:  # 1 week
                return 0.4
            else:
                return 0.2
        
        except Exception as e:
            logger.error(f"Error calculating time decay: {e}")
            return 0.5
    
    def _calculate_engagement_score(self, shares, comments, citations, views, likes):
        """Calculate normalized engagement score"""
        try:
            # Normalize metrics using log scale to handle wide ranges
            def log_normalize(value, base=10):
                if value <= 0:
                    return 0
                return math.log(value + 1) / math.log(base + 1)
            
            # Normalize each metric
            shares_norm = log_normalize(shares, 1000)
            comments_norm = log_normalize(comments, 500)
            citations_norm = log_normalize(citations, 100)
            views_norm = log_normalize(views, 10000)
            likes_norm = log_normalize(likes, 1000)
            
            # Calculate weighted score
            engagement_score = (
                shares_norm * self.weights['shares'] +
                comments_norm * self.weights['comments'] +
                citations_norm * self.weights['citations'] +
                views_norm * self.weights['views'] +
                likes_norm * 0.1  # Small weight for likes
            )
            
            return min(engagement_score, 1.0)
        
        except Exception as e:
            logger.error(f"Error calculating engagement score: {e}")
            return 0.0
    
    def rank_articles(self, articles):
        """Rank articles by hotness score"""
        try:
            # Calculate hotness scores for all articles
            for article in articles:
                hotness_score = self.calculate_hotness_score(article)
                article['hotness_score'] = hotness_score
            
            # Sort by hotness score (descending)
            ranked_articles = sorted(
                articles,
                key=lambda x: x.get('hotness_score', 0),
                reverse=True
            )
            
            return ranked_articles
        
        except Exception as e:
            logger.error(f"Error ranking articles: {e}")
            return articles
    
    def get_trending_keywords(self, articles, limit=20):
        """Extract trending keywords from top articles"""
        try:
            import json
            from collections import Counter
            
            # Get keywords from top articles
            all_keywords = []
            top_articles = sorted(
                articles,
                key=lambda x: x.get('hotness_score', 0),
                reverse=True
            )[:50]  # Top 50 articles
            
            for article in top_articles:
                keywords_str = article.get('keywords', '[]')
                try:
                    keywords = json.loads(keywords_str)
                    if isinstance(keywords, list):
                        all_keywords.extend(keywords)
                except json.JSONDecodeError:
                    continue
            
            # Count keyword frequency
            keyword_counts = Counter(all_keywords)
            trending = keyword_counts.most_common(limit)
            
            return [{'keyword': kw, 'count': count} for kw, count in trending]
        
        except Exception as e:
            logger.error(f"Error getting trending keywords: {e}")
            return []
    
    def get_engagement_stats(self, articles):
        """Get overall engagement statistics"""
        try:
            if not articles:
                return {}
            
            total_shares = sum(article.get('shares', 0) for article in articles)
            total_comments = sum(article.get('comments', 0) for article in articles)
            total_views = sum(article.get('views', 0) for article in articles)
            
            avg_hotness = sum(article.get('hotness_score', 0) for article in articles) / len(articles)
            
            return {
                'total_articles': len(articles),
                'total_shares': total_shares,
                'total_comments': total_comments,
                'total_views': total_views,
                'average_hotness': round(avg_hotness, 3),
                'top_score': max(article.get('hotness_score', 0) for article in articles)
            }
        
        except Exception as e:
            logger.error(f"Error calculating engagement stats: {e}")
            return {}
    
    def filter_by_hotness(self, articles, min_score=0.3):
        """Filter articles by minimum hotness score"""
        return [
            article for article in articles
            if article.get('hotness_score', 0) >= min_score
        ]