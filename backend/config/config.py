import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///../../database/ai_news.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # OpenAI Configuration
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    
    # News API Keys
    NEWS_API_KEY = os.environ.get('NEWS_API_KEY')
    
    # Redis Configuration for Celery
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    CELERY_BROKER_URL = REDIS_URL
    CELERY_RESULT_BACKEND = REDIS_URL
    
    # Scraping Configuration
    SCRAPE_INTERVAL_HOURS = 6
    MAX_ARTICLES_PER_SOURCE = 50
    
    # Ranking Configuration
    HOTNESS_DECAY_FACTOR = 0.1
    ENGAGEMENT_WEIGHTS = {
        'shares': 0.3,
        'comments': 0.25,
        'citations': 0.2,
        'views': 0.15,
        'recency': 0.1
    }
    
    # Pagination
    ARTICLES_PER_PAGE = 20
    
    # CORS
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}