import requests
import time
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
from fake_useragent import UserAgent
import logging

logger = logging.getLogger(__name__)

class BaseScraper(ABC):
    def __init__(self, name, base_url, rate_limit=1):
        self.name = name
        self.base_url = base_url
        self.rate_limit = rate_limit  # seconds between requests
        self.session = requests.Session()
        self.ua = UserAgent()
        self.session.headers.update({
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
        })
    
    def make_request(self, url, timeout=30):
        """Make a rate-limited request with error handling"""
        try:
            time.sleep(self.rate_limit)
            response = self.session.get(url, timeout=timeout)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed for {url}: {e}")
            return None
    
    def parse_date(self, date_str):
        """Parse various date formats into datetime object"""
        if not date_str:
            return datetime.utcnow()
        
        # Common date formats
        formats = [
            '%Y-%m-%dT%H:%M:%SZ',
            '%Y-%m-%dT%H:%M:%S.%fZ',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d',
            '%a, %d %b %Y %H:%M:%S GMT',
            '%a, %d %b %Y %H:%M:%S %Z'
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        logger.warning(f"Could not parse date: {date_str}")
        return datetime.utcnow()
    
    def extract_text(self, soup, selector):
        """Safely extract text from soup using CSS selector"""
        element = soup.select_one(selector)
        return element.get_text(strip=True) if element else ""
    
    def extract_url(self, soup, selector, base_url=None):
        """Safely extract URL from soup using CSS selector"""
        element = soup.select_one(selector)
        if element:
            url = element.get('href') or element.get('src')
            if url and base_url and not url.startswith('http'):
                return f"{base_url.rstrip('/')}/{url.lstrip('/')}"
            return url
        return ""
    
    def clean_text(self, text):
        """Clean and normalize text"""
        if not text:
            return ""
        return ' '.join(text.split())
    
    def is_ai_related(self, title, content=""):
        """Check if article is AI-related"""
        ai_keywords = [
            'artificial intelligence', 'machine learning', 'deep learning',
            'neural network', 'algorithm', 'automation', 'chatgpt', 'openai',
            'llm', 'large language model', 'generative ai', 'computer vision',
            'natural language processing', 'nlp', 'robotics', 'ai model',
            'transformer', 'gpt', 'claude', 'gemini', 'data science'
        ]
        
        text = (title + " " + content).lower()
        return any(keyword in text for keyword in ai_keywords)
    
    @abstractmethod
    def scrape_articles(self, max_articles=50):
        """Scrape articles from the source"""
        pass
    
    @abstractmethod
    def parse_article(self, article_data):
        """Parse individual article data"""
        pass