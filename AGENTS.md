# AGENTS.md - Comic Book Price Evaluator

This document provides guidelines for AI agents working on this codebase.

## Project Structure

This is a monorepo with three main components:
- **client/** - React/TypeScript frontend (Vite + React 19)
- **server/** - Express/TypeScript backend API
- **python-service/** - Python FastAPI service for image processing (barcode scanning, pricing)

## Build/Lint/Test Commands

### Client (React)
```bash
cd client
npm run dev          # Start dev server
npm run build        # TypeScript build + Vite production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm test             # Run vitest in watch mode
npm run test:run     # Run vitest once (CI mode)
```

### Server (Express)
```bash
cd server
npm run dev          # Start with tsx watch
npm run build        # TypeScript compilation to dist/
npm run start        # Run compiled production build
npm test             # Run vitest in watch mode
npm run test:run     # Run vitest once (CI mode)
npm run test:coverage # Run tests with coverage
```

### Python Service
```bash
cd python-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### Single Test Pattern
```bash
# Using vitest filter
npm test -- --testNamePattern="test name"
npm run test:run -- --testNamePattern="test name"

# Server tests (from server/ dir)
npm run test:run app.test.ts
```

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** - no implicit `any`, strict null checks
- Use TypeScript ES2022 target with NodeNext module system
- Always use explicit types for function parameters and return values
- Use `import type` for type-only imports

### React Components (Client)
- Use function components with hooks (useState, useEffect, useMemo, useCallback)
- Named exports for components: `export function ComponentName()`
- Props interfaces defined in `./types/` directory
- Use `.tsx` extension for components

### Express Routes (Server)
- Use `express.json()` middleware for JSON body parsing
- Route handlers return JSON responses: `res.json({ data })`
- Error handling: `res.status(400).json({ error: 'message' })`
- Input validation with 400 status codes for bad requests

### Error Handling
- Validate all user inputs, return 400 with error message
- Use try/catch in async route handlers
- Log errors to console in production code
- API errors return: `{ error: "descriptive message" }`

### Imports Ordering
1. Node.js built-in imports
2. Third-party library imports (alphabetical)
3. Relative imports (alphabetical)
4. Type imports (`import type`)
5. CSS/assets imports

### Naming Conventions
- **Files**: kebab-case for CSS, PascalCase for components, camelCase for utilities
- **Variables/functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **React Components**: PascalCase, same as filename

### API Conventions
- RESTful endpoints with JSON responses
- Query parameters for filters: `/api/comics?search=query`
- Environment variables:
  - Client: `VITE_*` prefix
  - Server: `PORT`, `DATABASE_URL`, `JWT_SECRET`, etc.

### Testing
- Use **vitest** for all tests
- **supertest** for API endpoint tests
- **@testing-library/react** for component tests
- Mock external services (fetch, databases)
- Tests in `*.test.ts` files alongside source

### Database
- PostgreSQL with node-postgres (`pg` package)
- Use parameterized queries to prevent SQL injection
- Connection pool configured in `db.ts`

### Security
- JWT for authentication (jsonwebtoken package)
- Passwords hashed with bcrypt
- CORS enabled for dev (configure appropriately for production)
- Environment variables for secrets (never commit `.env`)
