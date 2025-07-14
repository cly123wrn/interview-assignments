import feedparser
import json
from datetime import datetime
from .base_scraper import BaseScraper
import logging

logger = logging.getLogger(__name__)

class RSScraper(BaseScraper):
    def __init__(self, name, rss_url, rate_limit=1):
        super().__init__(name, rss_url, rate_limit)
        self.rss_url = rss_url
    
    def scrape_articles(self, max_articles=50):
        """Scrape articles from RSS feed"""
        try:
            feed = feedparser.parse(self.rss_url)
            articles = []
            
            for entry in feed.entries[:max_articles]:
                if self.is_ai_related(entry.get('title', ''), entry.get('summary', '')):
                    article = self.parse_article(entry)
                    if article:
                        articles.append(article)
            
            logger.info(f"Scraped {len(articles)} AI-related articles from {self.name}")
            return articles
        
        except Exception as e:
            logger.error(f"Error scraping RSS feed {self.name}: {e}")
            return []
    
    def parse_article(self, entry):
        """Parse RSS entry into article format"""
        try:
            # Extract basic information
            title = entry.get('title', '').strip()
            url = entry.get('link', '').strip()
            
            if not title or not url:
                return None
            
            # Get publication date
            published_at = self.parse_date(entry.get('published', ''))
            
            # Extract content/summary
            content = entry.get('content', [{}])
            if content and isinstance(content, list):
                content = content[0].get('value', '')
            else:
                content = entry.get('summary', '')
            
            # Clean content
            content = self.clean_text(content)
            
            # Extract author
            author = entry.get('author', '')
            
            # Extract tags/keywords
            tags = []
            if 'tags' in entry:
                tags = [tag.get('term', '') for tag in entry.tags]
            
            # Extract image
            image_url = ""
            if 'media_content' in entry:
                for media in entry.media_content:
                    if media.get('type', '').startswith('image'):
                        image_url = media.get('url', '')
                        break
            
            article_data = {
                'title': title,
                'url': url,
                'content': content,
                'author': author,
                'source': self.name,
                'published_at': published_at,
                'keywords': json.dumps(tags),
                'image_url': image_url,
                'category': 'AI'
            }
            
            return article_data
        
        except Exception as e:
            logger.error(f"Error parsing article from {self.name}: {e}")
            return None

# Predefined AI news RSS sources
AI_RSS_SOURCES = [
    RSScraper("AI News", "https://artificialintelligence-news.com/feed/"),
    RSScraper("VentureBeat AI", "https://venturebeat.com/ai/feed/"),
    RSScraper("TechCrunch AI", "https://techcrunch.com/category/artificial-intelligence/feed/"),
    RSScraper("MIT Technology Review AI", "https://www.technologyreview.com/topic/artificial-intelligence/feed"),
    RSScraper("The Verge AI", "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml"),
    RSScraper("Ars Technica AI", "https://feeds.arstechnica.com/arstechnica/technology-lab"),
    RSScraper("IEEE Spectrum AI", "https://spectrum.ieee.org/artificial-intelligence.rss"),
    RSScraper("Wired AI", "https://www.wired.com/feed/tag/ai/latest/rss"),
]