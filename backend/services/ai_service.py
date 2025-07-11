import openai
import json
import logging
from textblob import TextBlob
from flask import current_app

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize OpenAI client"""
        try:
            api_key = current_app.config.get('OPENAI_API_KEY')
            if api_key:
                self.client = openai.OpenAI(api_key=api_key)
            else:
                logger.warning("OpenAI API key not configured")
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
    
    def summarize_article(self, title, content, max_words=100):
        """Generate a summary of the article using AI"""
        if not self.client or not content:
            return self._fallback_summary(content, max_words)
        
        try:
            prompt = f"""
            Please provide a concise summary of this AI news article in {max_words} words or less.
            Focus on the key technological breakthrough, application, or industry impact.
            
            Title: {title}
            Content: {content[:2000]}  # Limit content to avoid token limits
            
            Summary:
            """
            
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an AI news analyst. Provide clear, concise summaries of AI-related news articles."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=150,
                temperature=0.3
            )
            
            summary = response.choices[0].message.content.strip()
            return summary
        
        except Exception as e:
            logger.error(f"Error generating AI summary: {e}")
            return self._fallback_summary(content, max_words)
    
    def _fallback_summary(self, content, max_words=100):
        """Generate a simple extractive summary as fallback"""
        if not content:
            return ""
        
        sentences = content.split('.')[:3]  # Take first 3 sentences
        summary = '. '.join(sentences).strip()
        
        words = summary.split()
        if len(words) > max_words:
            summary = ' '.join(words[:max_words]) + '...'
        
        return summary
    
    def extract_keywords(self, text, max_keywords=10):
        """Extract keywords from text using NLP"""
        try:
            blob = TextBlob(text)
            
            # Extract noun phrases as potential keywords
            keywords = []
            for phrase in blob.noun_phrases:
                if len(phrase.split()) <= 3:  # Keep short phrases
                    keywords.append(phrase.lower())
            
            # Remove duplicates and limit
            keywords = list(set(keywords))[:max_keywords]
            return keywords
        
        except Exception as e:
            logger.error(f"Error extracting keywords: {e}")
            return []
    
    def analyze_sentiment(self, text):
        """Analyze sentiment of the text"""
        try:
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            
            if polarity > 0.1:
                return 'positive'
            elif polarity < -0.1:
                return 'negative'
            else:
                return 'neutral'
        
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return 'neutral'
    
    def calculate_importance_score(self, title, content, keywords=None):
        """Calculate importance score based on content analysis"""
        try:
            score = 0.0
            
            # Title length and complexity
            title_words = len(title.split())
            if 5 <= title_words <= 15:
                score += 0.1
            
            # Content length
            content_words = len(content.split()) if content else 0
            if content_words > 100:
                score += 0.2
            
            # AI importance keywords
            importance_keywords = [
                'breakthrough', 'revolutionary', 'first time', 'major',
                'significant', 'milestone', 'achievement', 'innovation',
                'funding', 'billion', 'million', 'startup', 'acquisition',
                'regulation', 'policy', 'ban', 'law', 'government'
            ]
            
            text_lower = (title + ' ' + content).lower()
            keyword_matches = sum(1 for keyword in importance_keywords if keyword in text_lower)
            score += min(keyword_matches * 0.1, 0.5)
            
            # Keywords relevance
            if keywords:
                if any(kw in ['gpt', 'chatgpt', 'openai', 'google', 'microsoft'] for kw in keywords):
                    score += 0.2
            
            return min(score, 1.0)
        
        except Exception as e:
            logger.error(f"Error calculating importance score: {e}")
            return 0.5
    
    def batch_process_articles(self, articles):
        """Process multiple articles for AI analysis"""
        processed = []
        
        for article in articles:
            try:
                # Generate summary
                summary = self.summarize_article(
                    article.get('title', ''),
                    article.get('content', '')
                )
                
                # Extract keywords
                text = f"{article.get('title', '')} {article.get('content', '')}"
                keywords = self.extract_keywords(text)
                
                # Analyze sentiment
                sentiment = self.analyze_sentiment(text)
                
                # Calculate importance score
                importance_score = self.calculate_importance_score(
                    article.get('title', ''),
                    article.get('content', ''),
                    keywords
                )
                
                # Update article data
                article.update({
                    'summary': summary,
                    'keywords': json.dumps(keywords),
                    'sentiment': sentiment,
                    'importance_score': importance_score
                })
                
                processed.append(article)
                
            except Exception as e:
                logger.error(f"Error processing article: {e}")
                processed.append(article)  # Add original article even if processing fails
        
        return processed