import os
import logging
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# Import configuration
from config.config import config

# Import models
from models.article import Article, db as article_db
from models.user import User, db as user_db
from models.user_preferences import UserPreferences, db as prefs_db

# Import services
from services.ai_service import AIService
from services.ranking_service import RankingService
from scrapers.rss_scraper import AI_RSS_SOURCES

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db = SQLAlchemy(app)
    migrate = Migrate(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Initialize services
    ai_service = AIService()
    ranking_service = RankingService()
    
    # Define models within app context
    class Article(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        title = db.Column(db.String(500), nullable=False)
        url = db.Column(db.String(1000), unique=True, nullable=False)
        content = db.Column(db.Text)
        summary = db.Column(db.Text)
        author = db.Column(db.String(200))
        source = db.Column(db.String(200), nullable=False)
        category = db.Column(db.String(100), default='AI')
        published_at = db.Column(db.DateTime, nullable=False)
        scraped_at = db.Column(db.DateTime, default=datetime.utcnow)
        updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
        shares = db.Column(db.Integer, default=0)
        comments = db.Column(db.Integer, default=0)
        citations = db.Column(db.Integer, default=0)
        views = db.Column(db.Integer, default=0)
        likes = db.Column(db.Integer, default=0)
        hotness_score = db.Column(db.Float, default=0.0)
        keywords = db.Column(db.Text)
        tags = db.Column(db.Text)
        image_url = db.Column(db.String(1000))
        sentiment = db.Column(db.String(20))
        importance_score = db.Column(db.Float, default=0.0)

        def to_dict(self):
            return {
                'id': self.id,
                'title': self.title,
                'url': self.url,
                'content': self.content,
                'summary': self.summary,
                'author': self.author,
                'source': self.source,
                'category': self.category,
                'published_at': self.published_at.isoformat() if self.published_at else None,
                'scraped_at': self.scraped_at.isoformat() if self.scraped_at else None,
                'updated_at': self.updated_at.isoformat() if self.updated_at else None,
                'shares': self.shares,
                'comments': self.comments,
                'citations': self.citations,
                'views': self.views,
                'likes': self.likes,
                'hotness_score': self.hotness_score,
                'keywords': self.keywords,
                'tags': self.tags,
                'image_url': self.image_url,
                'sentiment': self.sentiment,
                'importance_score': self.importance_score
            }
    
    # Routes
    @app.route('/')
    def index():
        """Serve the main page"""
        return render_template('index.html')
    
    @app.route('/api/articles', methods=['GET'])
    def get_articles():
        """Get articles with filtering and pagination"""
        try:
            # Get query parameters
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            source = request.args.get('source')
            category = request.args.get('category')
            keyword = request.args.get('keyword')
            min_hotness = request.args.get('min_hotness', type=float)
            sort_by = request.args.get('sort_by', 'hotness')  # hotness, date, relevance
            
            # Build query
            query = Article.query
            
            # Apply filters
            if source:
                query = query.filter(Article.source.ilike(f'%{source}%'))
            
            if category:
                query = query.filter(Article.category == category)
            
            if keyword:
                query = query.filter(
                    db.or_(
                        Article.title.ilike(f'%{keyword}%'),
                        Article.content.ilike(f'%{keyword}%'),
                        Article.keywords.ilike(f'%{keyword}%')
                    )
                )
            
            if min_hotness:
                query = query.filter(Article.hotness_score >= min_hotness)
            
            # Apply sorting
            if sort_by == 'hotness':
                query = query.order_by(Article.hotness_score.desc())
            elif sort_by == 'date':
                query = query.order_by(Article.published_at.desc())
            else:
                query = query.order_by(Article.hotness_score.desc())
            
            # Paginate
            articles = query.paginate(
                page=page, 
                per_page=min(per_page, 100),  # Max 100 per page
                error_out=False
            )
            
            return jsonify({
                'articles': [article.to_dict() for article in articles.items],
                'pagination': {
                    'page': articles.page,
                    'pages': articles.pages,
                    'per_page': articles.per_page,
                    'total': articles.total,
                    'has_next': articles.has_next,
                    'has_prev': articles.has_prev
                }
            })
        
        except Exception as e:
            logger.error(f"Error getting articles: {e}")
            return jsonify({'error': 'Failed to fetch articles'}), 500
    
    @app.route('/api/articles/trending', methods=['GET'])
    def get_trending_articles():
        """Get trending articles (highest hotness scores)"""
        try:
            limit = request.args.get('limit', 20, type=int)
            
            articles = Article.query.order_by(
                Article.hotness_score.desc()
            ).limit(min(limit, 50)).all()
            
            return jsonify({
                'articles': [article.to_dict() for article in articles],
                'count': len(articles)
            })
        
        except Exception as e:
            logger.error(f"Error getting trending articles: {e}")
            return jsonify({'error': 'Failed to fetch trending articles'}), 500
    
    @app.route('/api/articles/<int:article_id>', methods=['GET'])
    def get_article(article_id):
        """Get a specific article by ID"""
        try:
            article = Article.query.get_or_404(article_id)
            
            # Increment view count
            article.views += 1
            db.session.commit()
            
            return jsonify(article.to_dict())
        
        except Exception as e:
            logger.error(f"Error getting article {article_id}: {e}")
            return jsonify({'error': 'Article not found'}), 404
    
    @app.route('/api/scrape', methods=['POST'])
    def trigger_scrape():
        """Manually trigger article scraping"""
        try:
            scraped_count = 0
            
            for scraper in AI_RSS_SOURCES[:5]:  # Limit to 5 sources for demo
                try:
                    articles = scraper.scrape_articles(max_articles=20)
                    
                    # Process articles with AI
                    processed_articles = ai_service.batch_process_articles(articles)
                    
                    # Save to database
                    for article_data in processed_articles:
                        existing = Article.query.filter_by(url=article_data['url']).first()
                        if not existing:
                            article = Article(**article_data)
                            
                            # Calculate hotness score
                            article.hotness_score = ranking_service.calculate_hotness_score(
                                article_data
                            )
                            
                            db.session.add(article)
                            scraped_count += 1
                    
                    db.session.commit()
                    
                except Exception as e:
                    logger.error(f"Error scraping from {scraper.name}: {e}")
                    continue
            
            return jsonify({
                'message': f'Successfully scraped {scraped_count} new articles',
                'count': scraped_count
            })
        
        except Exception as e:
            logger.error(f"Error during scraping: {e}")
            return jsonify({'error': 'Scraping failed'}), 500
    
    @app.route('/api/stats', methods=['GET'])
    def get_stats():
        """Get overall statistics"""
        try:
            # Get recent articles (last 7 days)
            week_ago = datetime.utcnow() - timedelta(days=7)
            recent_articles = Article.query.filter(
                Article.scraped_at >= week_ago
            ).all()
            
            articles_data = [article.to_dict() for article in recent_articles]
            stats = ranking_service.get_engagement_stats(articles_data)
            
            # Get trending keywords
            trending_keywords = ranking_service.get_trending_keywords(articles_data)
            
            # Get source distribution
            sources = {}
            for article in recent_articles:
                source = article.source
                sources[source] = sources.get(source, 0) + 1
            
            return jsonify({
                'stats': stats,
                'trending_keywords': trending_keywords,
                'sources': sources,
                'period': '7 days'
            })
        
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return jsonify({'error': 'Failed to fetch statistics'}), 500
    
    @app.route('/api/keywords/trending', methods=['GET'])
    def get_trending_keywords():
        """Get trending keywords"""
        try:
            limit = request.args.get('limit', 20, type=int)
            
            # Get recent articles
            week_ago = datetime.utcnow() - timedelta(days=7)
            recent_articles = Article.query.filter(
                Article.scraped_at >= week_ago
            ).all()
            
            articles_data = [article.to_dict() for article in recent_articles]
            trending = ranking_service.get_trending_keywords(articles_data, limit)
            
            return jsonify({
                'keywords': trending,
                'count': len(trending)
            })
        
        except Exception as e:
            logger.error(f"Error getting trending keywords: {e}")
            return jsonify({'error': 'Failed to fetch trending keywords'}), 500
    
    @app.route('/api/search', methods=['GET'])
    def search_articles():
        """Search articles by query"""
        try:
            query_text = request.args.get('q', '').strip()
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 20, type=int)
            
            if not query_text:
                return jsonify({'error': 'Query parameter required'}), 400
            
            # Search in title, content, and keywords
            articles = Article.query.filter(
                db.or_(
                    Article.title.ilike(f'%{query_text}%'),
                    Article.content.ilike(f'%{query_text}%'),
                    Article.keywords.ilike(f'%{query_text}%')
                )
            ).order_by(Article.hotness_score.desc()).paginate(
                page=page,
                per_page=min(per_page, 100),
                error_out=False
            )
            
            return jsonify({
                'articles': [article.to_dict() for article in articles.items],
                'pagination': {
                    'page': articles.page,
                    'pages': articles.pages,
                    'per_page': articles.per_page,
                    'total': articles.total,
                    'has_next': articles.has_next,
                    'has_prev': articles.has_prev
                },
                'query': query_text
            })
        
        except Exception as e:
            logger.error(f"Error searching articles: {e}")
            return jsonify({'error': 'Search failed'}), 500
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)