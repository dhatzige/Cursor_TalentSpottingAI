#!/bin/bash

# TalentSpottingAI Setup Script
# This script helps developers quickly set up the project locally

set -e

echo "🚀 Setting up TalentSpottingAI development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ $NODE_VERSION -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) detected"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

print_success "pnpm $(pnpm --version) detected"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    print_status "Creating backend .env from example..."
    cp env.example .env
    print_warning "Please update backend/.env with your actual configuration values"
fi

pnpm install
print_success "Backend dependencies installed"

# Setup database
print_status "Setting up database..."
if command -v docker &> /dev/null; then
    print_status "Docker detected. You can run 'docker-compose up -d' to start PostgreSQL"
else
    print_warning "Docker not found. Make sure PostgreSQL is running manually"
fi

# Run Prisma migrations
if [ -f ".env" ]; then
    print_status "Running database migrations..."
    pnpm prisma generate
    pnpm prisma db push
    print_status "Seeding database with initial data..."
    pnpm ts-node prisma/seed.ts
    print_success "Database setup complete"
else
    print_warning "No .env file found. Skipping database setup"
fi

cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
if [ ! -f ".env.local" ]; then
    print_status "Creating frontend .env.local from example..."
    cp env.example .env.local
    print_warning "Please update frontend/.env.local with your actual configuration values"
fi

pnpm install
print_success "Frontend dependencies installed"

cd ..

# Create development script
print_status "Creating development startup script..."
cat > start-dev.sh << 'EOF'
#!/bin/bash

# Start both backend and frontend in development mode
echo "Starting TalentSpottingAI development servers..."

# Function to cleanup background processes
cleanup() {
    echo "Shutting down servers..."
    jobs -p | xargs -r kill
    exit
}

# Trap SIGINT and SIGTERM to cleanup
trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting backend server on port 4000..."
cd backend && pnpm dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend server on port 3000..."
cd ../frontend && pnpm dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x start-dev.sh

print_success "Setup complete! 🎉"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your database and API keys"
echo "2. Update frontend/.env.local with your Clerk keys"
echo "3. Start PostgreSQL (or run 'docker-compose up -d')"
echo "4. Run './start-dev.sh' to start both servers"
echo ""
echo "🔗 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:4000"
echo "   Dev Dashboard: http://localhost:3000/dev-dashboard"
echo ""
echo "📚 Documentation:"
echo "   README.md - Project overview"
echo "   docs/ARCHITECTURE.md - Technical architecture"
echo "   MEMORY.md - Development history and decisions"
echo ""
print_success "Happy coding! 🚀" 