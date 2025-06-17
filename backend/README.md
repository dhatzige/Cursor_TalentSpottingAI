# Backend

This folder contains the Node.js (Express, TypeScript) backend for TalentSpottingAI.

- All API routes, business logic, and database access live here.
- Uses Prisma ORM for PostgreSQL.
- Each module/service should be <300-400 lines and single-responsibility.

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations (when database is configured):
```bash
npx prisma migrate dev --name add_all_models
```

5. Start development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── index.ts               # Entry point
├── controllers/           # Business logic
│   ├── university.controller.ts    # University dashboard logic
│   ├── employer/          # Employer-specific controllers
│   └── talent-search/     # Talent search functionality
├── middleware/            # Request processing
│   └── auth.ts            # Authentication middleware
├── routes/                # API endpoints
│   ├── university.routes.ts        # University dashboard routes
│   └── talent-search.routes.ts     # Talent search routes
└── utils/                 # Helper functions
```

## API Routes

### University Dashboard

- `GET /api/university/dashboard/stats` - Get university statistics (students, placement rates, etc.)
- `GET /api/university/placements` - Get student placement data by degree
- `GET /api/university/employer-partners` - Get employers who have hired university students

### Authentication

All university routes require authentication and the 'university' role. Middleware:
```typescript
router.use(authenticateToken, authorizeRoles(['university']));
```

## Database Schema

The Prisma schema includes the following key models:

### University Models
- `University` - Institution details and relationships to users and degrees
- `Degree` - Academic programs offered by universities
- `Student` - Student profiles with placement status and employer info
- `Education` - Links students, universities, and degrees
- `Employer` - Organizations that hire students

### Additional Models
- `User` - Authentication and role-based access
- `Organization` - Company/institution details
- `Job` - Employment opportunities
- `Application` - Job applications

## Type Safety

The codebase uses TypeScript for type safety. When working with models that aren't yet recognized by the IDE:

1. Ensure Prisma client is generated: `npx prisma generate`
2. Consider restarting the TypeScript server in your IDE
3. Use explicit type declarations when necessary

## Environment Setup

Required environment variables in `.env`:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/talentspottingai"
PORT=4000
JWT_SECRET="your_jwt_secret_here"
```
