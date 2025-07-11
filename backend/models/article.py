from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    url = db.Column(db.String(1000), unique=True, nullable=False)
    content = db.Column(db.Text)
    summary = db.Column(db.Text)
    author = db.Column(db.String(200))
    source = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), default='AI')
    
    # Timestamps
    published_at = db.Column(db.DateTime, nullable=False)
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Engagement metrics for hotness calculation
    shares = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)
    citations = db.Column(db.Integer, default=0)
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    
    # Calculated hotness score
    hotness_score = db.Column(db.Float, default=0.0)
    
    # Keywords and tags
    keywords = db.Column(db.Text)  # JSON string of keywords
    tags = db.Column(db.Text)     # JSON string of tags
    
    # Image and media
    image_url = db.Column(db.String(1000))
    
    # AI analysis
    sentiment = db.Column(db.String(20))  # positive, negative, neutral
    importance_score = db.Column(db.Float, default=0.0)
    
    def __repr__(self):
        return f'<Article {self.title[:50]}...>'
    
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