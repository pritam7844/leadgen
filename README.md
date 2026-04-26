# LeadFlow — Lead Generation & Outreach Automation Platform

## Tech Stack
- **Backend**: Spring Boot 3.x (Java 17), MongoDB, Redis, AWS S3
- **Frontend**: React 18 + Vite + TailwindCSS + Zustand
- **Scraper**: Node.js + Playwright microservice

## Project Structure
```
leadflow/
├── backend/          Spring Boot backend (port 8080)
├── frontend/         React + Vite frontend (port 5173)
└── scraper-service/  Node.js Playwright scraper (port 3001)
```

## Prerequisites
- Java 17+
- Node.js 18+
- MongoDB 6+
- Redis 7+

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your values
mvn spring-boot:run
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Scraper Microservice
```bash
cd scraper-service
npm install
npx playwright install chromium
npm start
```

## Environment Variables

### Backend (`.env`)
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_HOST` | Redis host |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `AES_KEY` | AES-256 encryption key (32 chars) |
| `AWS_ACCESS_KEY` | AWS access key for S3 |
| `AWS_SECRET_KEY` | AWS secret key |
| `S3_BUCKET` | S3 bucket name |

### Frontend (`.env`)
| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |

## API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints require: `Authorization: Bearer <token>`

### Auth
- `POST /auth/register` — Create account
- `POST /auth/login` — Login
- `POST /auth/refresh` — Refresh token
- `POST /auth/logout` — Logout

### Leads
- `GET /leads` — Get leads (paginated, filterable)
- `POST /leads` — Create lead
- `PUT /leads/:id` — Update lead
- `DELETE /leads/:id` — Delete lead
- `POST /leads/bulk-delete` — Bulk delete
- `POST /leads/export` — Export CSV
- `GET /leads/stats` — Lead stats

### Sources
- `GET /sources` — List sources
- `POST /sources` — Create source
- `POST /sources/csv-upload` — Upload CSV
- `POST /sources/:id/run` — Run source

### Automation
- `GET/POST /automation/email/providers` — Email SMTP providers
- `GET/POST /automation/calling/configs` — Call provider configs
- `GET/POST /automation/whatsapp/configs` — WhatsApp configs
- `GET/POST /automation/meetings/configs` — Meeting configs

### Campaigns
- `GET/POST /campaigns` — List/create campaigns
- `POST /campaigns/:id/start` — Start campaign
- `POST /campaigns/:id/pause` — Pause campaign

## Security
- JWT access tokens (15 min) + refresh tokens (7 days)
- Rate limiting: 100 req/min per IP via Redis
- AES-256 encryption for all credentials
- CORS locked to frontend origin
- Scraper service not exposed externally
