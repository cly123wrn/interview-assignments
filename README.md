# AI News Hub

A comprehensive AI news aggregation platform that automatically scrapes, analyzes, and ranks the latest news in artificial intelligence. Built with Flask (backend) and React (frontend), featuring AI-powered summarization, hotness ranking, and personalized filtering.

![AI News Hub](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=AI+News+Hub)

## Features

### Core Functionality
- **Automated News Scraping**: Daily aggregation from top AI news sources
- **Hotness Ranking**: Advanced algorithm ranking articles by engagement metrics
- **AI Summarization**: OpenAI-powered article summaries
- **Real-time Updates**: Live news feed with automatic refresh
- **Multi-platform Support**: Responsive design for desktop and mobile

### Personalization
- **Advanced Filtering**: Filter by sources, categories, keywords, and hotness score
- **Customizable Display**: Toggle summaries, images, and layout preferences
- **Search Functionality**: Full-text search across articles and metadata
- **Trending Keywords**: Discover popular topics and emerging trends

### Technical Features
- **RESTful API**: Clean, documented API endpoints
- **Infinite Scroll**: Smooth loading of additional content
- **Real-time Statistics**: Engagement metrics and analytics
- **Responsive UI**: Modern, clean interface built with Tailwind CSS

## Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: ORM and database management
- **OpenAI API**: AI-powered content analysis
- **BeautifulSoup**: Web scraping and parsing
- **Feedparser**: RSS feed processing
- **TextBlob**: Natural language processing

### Frontend
- **React 18**: Modern UI framework
- **React Query**: Data fetching and caching
- **Tailwind CSS**: Utility-first styling
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Framer Motion**: Animations

### Data Sources
- TechCrunch AI
- VentureBeat AI
- MIT Technology Review
- The Verge AI
- Wired AI
- IEEE Spectrum AI
- Ars Technica AI
- AI News

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-news-hub
   ```

2. **Set up Python environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   python app.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   ```bash
   # Create .env file if needed
   echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   python app.py
   ```
   Backend will be available at `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will be available at `http://localhost:3000`

### Production Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure production environment**
   ```bash
   cd ../backend
   export FLASK_ENV=production
   export SECRET_KEY=your-production-secret-key
   ```

3. **Run with production server**
   ```bash
   gunicorn app:app
   ```

## Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SECRET_KEY` | Flask secret key | Yes | - |
| `DATABASE_URL` | Database connection string | No | SQLite |
| `OPENAI_API_KEY` | OpenAI API key for summarization | No | - |
| `NEWS_API_KEY` | News API key for additional sources | No | - |
| `REDIS_URL` | Redis connection for caching | No | - |
| `CORS_ORIGINS` | Allowed CORS origins | No | localhost:3000 |

### Optional Integrations

#### OpenAI API Setup
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add to `.env`: `OPENAI_API_KEY=your-key-here`
3. Restart the backend server

#### Redis Setup (for caching)
1. Install Redis locally or use a cloud service
2. Add to `.env`: `REDIS_URL=redis://localhost:6379/0`
3. Restart the backend server

## API Documentation

### Endpoints

#### Articles
- `GET /api/articles` - Get articles with filtering and pagination
- `GET /api/articles/trending` - Get trending articles
- `GET /api/articles/{id}` - Get specific article
- `GET /api/search` - Search articles
- `POST /api/scrape` - Trigger manual scraping

#### Statistics
- `GET /api/stats` - Get overall statistics
- `GET /api/keywords/trending` - Get trending keywords

### Example Requests

```bash
# Get latest articles
curl "http://localhost:5000/api/articles?page=1&per_page=20"

# Search articles
curl "http://localhost:5000/api/search?q=machine%20learning"

# Get trending articles
curl "http://localhost:5000/api/articles/trending?limit=10"

# Trigger scraping
curl -X POST "http://localhost:5000/api/scrape"
```

## Usage

### Basic Navigation
1. **Home Page**: Browse latest AI news with infinite scroll
2. **Trending**: View hottest articles ranked by engagement
3. **Search**: Find specific articles or topics
4. **Categories**: Browse by AI domains (coming soon)
5. **Settings**: Customize display preferences and filters

### Filtering & Customization
- Use the sidebar to filter by sources, categories, and hotness
- Adjust display settings to show/hide summaries and images
- Set minimum hotness threshold for quality filtering
- Search for specific keywords or topics

### Advanced Features
- Click trending keywords to search for related articles
- Share articles using the built-in share functionality
- Bookmark articles for later reading
- Use the refresh button to get latest content
- Trigger manual news updates with the "Update News" button

## Development

### Project Structure
```
ai-news-hub/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config/             # Configuration files
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── scrapers/           # News scraping modules
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   └── package.json        # Node.js dependencies
└── database/               # SQLite database files
```

### Adding New News Sources
1. Create a new scraper in `backend/scrapers/`
2. Inherit from `BaseScraper` class
3. Implement `scrape_articles()` and `parse_article()` methods
4. Add to the scrapers list in the main application

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Troubleshooting

### Common Issues

**Backend won't start**
- Check Python version (3.8+ required)
- Ensure all dependencies are installed
- Verify environment variables in `.env`

**Frontend won't start**
- Check Node.js version (16+ required)
- Run `npm install` to ensure dependencies are installed
- Check for port conflicts (default: 3000)

**No articles loading**
- Trigger manual scraping: `POST /api/scrape`
- Check network connectivity
- Verify RSS feed URLs are accessible

**AI summaries not working**
- Ensure OpenAI API key is configured
- Check API key validity and quota
- Verify network access to OpenAI API

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the AI community
