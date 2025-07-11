#!/bin/bash

# AI News Hub - Development Server Startup Script

echo "🚀 Starting AI News Hub..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Start backend server in background
echo "🐍 Starting Flask backend server..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "venv/installed" ]; then
    echo "📥 Installing Python dependencies..."
    pip install -r requirements.txt
    touch venv/installed
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

# Start Flask server in background
echo "🌐 Starting Flask server on http://localhost:5000"
python app.py &
BACKEND_PID=$!

# Move to frontend directory
cd ../frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing Node.js dependencies..."
    npm install
fi

# Give backend time to start
sleep 3

# Start frontend server
echo "⚛️ Starting React development server on http://localhost:3000"
npm start &
FRONTEND_PID=$!

# Function to cleanup when script exits
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Cleanup complete"
    exit 0
}

# Trap CTRL+C and cleanup
trap cleanup SIGINT SIGTERM

echo ""
echo "✅ AI News Hub is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID