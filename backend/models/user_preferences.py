from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class UserPreferences(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Keyword preferences (JSON string)
    preferred_keywords = db.Column(db.Text)  # JSON array of keywords
    blocked_keywords = db.Column(db.Text)   # JSON array of blocked keywords
    
    # Source preferences (JSON string)
    preferred_sources = db.Column(db.Text)  # JSON array of preferred sources
    blocked_sources = db.Column(db.Text)    # JSON array of blocked sources
    
    # Category preferences
    preferred_categories = db.Column(db.Text)  # JSON array of categories
    
    # Notification settings
    notification_frequency = db.Column(db.String(20), default='daily')  # hourly, daily, weekly
    notification_time = db.Column(db.Time)  # preferred time for notifications
    min_hotness_score = db.Column(db.Float, default=0.5)  # minimum hotness score for notifications
    
    # Display preferences
    articles_per_page = db.Column(db.Integer, default=20)
    show_images = db.Column(db.Boolean, default=True)
    show_summaries = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<UserPreferences for user {self.user_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'preferred_keywords': self.preferred_keywords,
            'blocked_keywords': self.blocked_keywords,
            'preferred_sources': self.preferred_sources,
            'blocked_sources': self.blocked_sources,
            'preferred_categories': self.preferred_categories,
            'notification_frequency': self.notification_frequency,
            'notification_time': self.notification_time.strftime('%H:%M') if self.notification_time else None,
            'min_hotness_score': self.min_hotness_score,
            'articles_per_page': self.articles_per_page,
            'show_images': self.show_images,
            'show_summaries': self.show_summaries,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }