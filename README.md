# Evijnar - Global Health Arbitrage Exchange

> **Solving the Hidden Price Crisis in Healthcare**
>
> A decentralized global healthcare access platform that aggregates and normalizes hospital price transparency data from USA, Europe, and India using AI-powered mapping and outcome-driven ranking.

---

## 📑 Table of Contents

- [Vision](#-project-vision)
- [Status](#-current-status)
- [Features](#-core-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Testing & CI/CD](#-testing--cicd)
- [Development](#-development-workflow)
- [Security](#-security--compliance)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Documentation](#-documentation)
- [License](#-license)

---

## 🌍 Project Vision

**Problem**: Patients lack transparent access to hospital prices and quality metrics across global healthcare markets. Price discovery is manual, trust-based, and inefficient.

**Solution**: Evijnar creates a unified global marketplace where patients can:

- Access hospital price transparency data
- Compare quality metrics across hospitals
- Make informed decisions for healthcare services

**Mission**: Democratize global healthcare access through transparency, equity, and technology.

---

## 📊 Current Status

| Component                     | Status         | Phase    |
| ----------------------------- | -------------- | -------- |
| **Data Ingestion Engine**     | ✅ Complete    | Sprint 2 |
| **Phase 3 Integration Tests** | ✅ Complete    | Phase 3  |
| **GitHub Actions CI/CD**      | ✅ Complete    | Phase 3  |
| **Authentication System**     | ⏳ In Progress | Sprint 2 |
| **Hospital Search & Ranking** | ⏳ Planned     | Sprint 2 |
| **Recovery Bridge (IoMT)**    | ⏳ Planned     | Sprint 3 |
| **Rural Financing (UPI)**     | ⏳ Planned     | Sprint 3 |

**Latest Release**: Phase 3 - Integration Testing & CI/CD (2026-04-08)

---

## ✨ Core Features

### 1. **Success-Adjusted Value Ranking** 🏆

- Ranks hospitals by Cost + Risk + Quality
- AI-powered analysis using Claude API
- Outcome-driven decision support
- Real-time price/quality scoring

### 2. **Global Data Aggregation** 🌐

- **USA**: HHS Price Transparency data
- **Europe**: EHDS (European Health Data Space)
- **India**: ABDM/UHI (Ayushman Bharat Digital Mission)
- Unified schema across geographies

### 3. **Recovery Bridge (IoMT Monitoring)** 👁️

- 30-day post-operative monitoring
- Real-time vital tracking (HR, SpO2, Temp, BP)
- Automated alert escalation
- Cross-border safety coordination

### 4. **Rural Financing** 💚

- UPI 2.0 micro-financing
- Health-EMI with flexible payback
- Tier 2 city routing for affordability
- Zero-interest options for essential procedures

### 5. **HIPAA-Compliant Architecture** 🔒

- Audit logging for all PHI access
- Zero-knowledge encryption for records
- Client-side PII encryption
- Quarterly key rotation
- GDPR right-to-be-forgotten support

### 6. **Mobile-First Design** 📱

- Next.js 15 responsive frontend with TypeScript
- Low-bandwidth UI for rural connectivity
- Progressive loading & code splitting
- Image optimization (AVIF, WebP)
- Custom React hooks for data fetching
- Real-time vitals monitoring UI
- Responsive navigation (desktop nav + mobile hamburger)

### 7. **Comprehensive Dashboard** 🎯

- **Home View**: Hero section with features & real-time statistics
- **Search View**: Advanced hospital search with filters, voice input, price comparison
- **Procedures View**: Browsable medical procedures with success rates & costs
- **Health Tourism**: All-inclusive treatment packages & destination guides
- **Recovery Bridge**: Real-time vital signs monitoring (simulated)
- **Bookings**: Appointment management and history
- **Global Search**: Unified search across all sections with debouncing

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                         | Version |
| ---------------- | ------------------------------- | ------- |
| **Next.js**      | React framework with App Router | 15+     |
| **TypeScript**   | Type-safe development           | Latest  |
| **Tailwind CSS** | Utility-first styling           | Latest  |
| **Zustand**      | Lightweight state management    | Latest  |
| **Axios**        | HTTP client                     | Latest  |

### Backend

| Technology     | Purpose                    | Version |
| -------------- | -------------------------- | ------- |
| **FastAPI**    | Async Python web framework | 0.104+  |
| **SQLAlchemy** | ORM for database           | 2.0+    |
| **Pydantic**   | Data validation            | 2.5+    |
| **Alembic**    | Database migrations        | 1.12+   |
| **Uvicorn**    | ASGI server                | 0.24+   |
| **Python**     | Runtime                    | 3.11+   |

### Data & Infrastructure

| Technology         | Purpose                 | Version |
| ------------------ | ----------------------- | ------- |
| **PostgreSQL**     | Primary database        | 16+     |
| **Redis**          | Caching & session store | 7+      |
| **Prisma**         | Database ORM (packages) | Latest  |
| **Docker**         | Containerization        | Latest  |
| **docker-compose** | Local orchestration     | Latest  |

### DevOps & Testing

| Technology         | Purpose                    | Version  |
| ------------------ | -------------------------- | -------- |
| **GitHub Actions** | CI/CD pipeline             | Built-in |
| **pytest**         | Python testing framework   | 7.4+     |
| **pytest-asyncio** | Async test support         | 0.21+    |
| **Codecov**        | Coverage reporting         | Cloud    |
| **pnpm**           | Package manager (monorepo) | Latest   |

### AI & External Services

| Service                    | Purpose                     |
| -------------------------- | --------------------------- |
| **Claude API (Anthropic)** | Intelligent data mapping    |
| **Razorpay / UPI 2.0**     | Payment processing          |
| **Twilio**                 | SMS notifications (planned) |
| **Google Maps**            | Geographic routing          |

---

## 🚀 Quick Start

### Prerequisites

```bash
# System requirements
- Node.js 20+
- Python 3.11+
- PostgreSQL 16 (or Docker)
- Docker & Docker Compose (recommended)
- Git
```

### Installation

**1. Clone and Navigate**

```bash
git clone <repository>
cd Evijnar
```

**2. Install Global Tools**

```bash
npm install -g pnpm
```

**3. Install Dependencies**

```bash
pnpm install
```

**4. Configure Environment**

```bash
# API
cp apps/api/.env.example apps/api/.env

# Database
cp packages/database/.env.example packages/database/.env

# Web
cp apps/web/.env.example apps/web/.env
```

**5. Start Services (Recommended)**

```bash
# Option A: Docker Compose (includes PostgreSQL + Redis)
docker-compose up -d

# Option B: Manual Setup
# Terminal 1 - PostgreSQL
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16

# Terminal 2 - Redis
docker run -d -p 6379:6379 redis:7

# Terminal 3 - Backend
cd apps/api
python -m venv venv
source venv/bin/activate
pip install -e .
python run.py

# Terminal 4 - Frontend
cd apps/web
pnpm dev
```

**6. Setup Database**

> > > > > > > 96753de (Initial commit)

```bash
cd apps/api
alembic upgrade head
```

### Verify Installation

```bash
# API Health Check
curl http://localhost:8000/health

# Frontend
Open http://localhost:3000 in browser

# Database
```

### Common Commands

**Development**

```bash
pnpm dev              # Run all services
pnpm type-check       # TypeScript check
pnpm lint             # Run linters
```

**Testing**

```bash
cd apps/api
pytest tests/test_integration_phase3.py -v --cov=app
python scripts/verify_data.py
bash PHASE3_QUICKREF.sh
```

**Database**

```bash
cd apps/api
alembic upgrade head     # Run migrations
alembic downgrade -1     # Rollback one migration
```

**CI/CD**

```bash
# View GitHub Actions (after pushing)
git push origin main
# Check: GitHub repo → Actions tab

# Local CI simulation
cd apps/api
./run-local-ci.sh
```

**Docker**

```bash
docker-compose up -d       # Start all services
docker-compose logs -f     # View logs
docker-compose down        # Stop all services
docker-compose ps          # See running containers
```

---

## 🏗️ Project Structure

```
Evijnar/
│
├── 📁 apps/                                # Application layer
│   │
│   ├── 📁 api/                            # FastAPI Backend (Python)
│   │   ├── app/
│   │   │   ├── 📁 routers/                # API route handlers
│   │   │   │   ├── auth.py                # Authentication endpoints
│   │   │   │   ├── hospitals.py           # Hospital search & details
│   │   │   │   ├── pricing.py             # Pricing & normalization
│   │   │   │   ├── bookings.py            # Booking management
│   │   │   │   ├── recovery.py            # Recovery Bridge (IoMT)
│   │   │   │   ├── patients.py            # Patient profiles
│   │   │   │   ├── financing.py           # Rural financing
│   │   │   │   └── health.py              # Health checks
│   │   │   │
│   │   │   ├── 📁 services/               # Business logic
│   │   │   │   ├── 📁 data_ingestion/     # Data ingestion engine
│   │   │   │   │   ├── ingestion_engine.py
│   │   │   │   │   ├── 📁 loaders/        # Format-specific loaders
│   │   │   │   │   │   ├── hhs_loader.py
│   │   │   │   │   │   ├── ehds_loader.py
│   │   │   │   │   │   ├── abdm_loader.py
│   │   │   │   │   │   └── json_loader.py
│   │   │   │   │   ├── 📁 mappers/        # Claude-powered mappers
│   │   │   │   │   │   ├── hospital_mapper.py
│   │   │   │   │   │   ├── procedure_mapper.py
│   │   │   │   │   │   └── normalizer_mapper.py
│   │   │   │   │   ├── models.py          # Pydantic schemas
│   │   │   │   │   └── errors.py          # Custom exceptions
│   │   │   │   │
│   │   │   │   └── 📁 utils/              # Utilities
│   │   │   │       └── llm_client.py      # Claude API client
│   │   │   │
│   │   │   ├── 📁 repositories/           # Data access layer
│   │   │   │   ├── hospital.py
│   │   │   │   ├── procedure.py
│   │   │   │   ├── normalizer.py
│   │   │   │   └── audit.py
│   │   │   │
│   │   │   ├── 📁 models/                 # Database models
│   │   │   │   └── database.py
│   │   │   │
│   │   │   ├── 📁 db/                     # Database configuration
│   │   │   │   └── session.py
│   │   │   │
│   │   │   ├── config.py                  # Configuration
│   │   │   ├── middleware.py              # HIPAA, security
│   │   │   └── main.py                    # FastAPI app entry
│   │   │
│   │   ├── 📁 tests/                      # Test suite
│   │   │   ├── conftest.py                # Fixtures & setup
│   │   │   └── test_integration_phase3.py # Integration tests
│   │   │
│   │   ├── 📁 scripts/                    # Utility scripts
│   │   │   ├── ingest_data.py             # CLI ingestion tool
│   │   │   ├── verify_data.py             # Database verification
│   │   │   └── run_phase3_tests.py        # Test orchestrator
│   │   │
│   │   ├── 📁 alembic/                    # Database migrations
│   │   │   ├── env.py
│   │   │   └── 📁 versions/
│   │   │
│   │   ├── pyproject.toml                 # Python dependencies
│   │   ├── pytest.ini                     # Pytest configuration
│   │   ├── Dockerfile                     # Container image
│   │   ├── run.py                         # Entry point
│   │   └── .env.example                   # Environment template
│   │
│   └── 📁 web/                            # Next.js Frontend (TypeScript) ✅ COMPLETE
│       ├── 📁 src/
│       │   ├── 📁 app/
│       │   │   ├── page.tsx               # Main Dashboard (6 views)
│       │   │   ├── layout.tsx
│       │   │   └── globals.css
│       │   │
│       │   ├── 📁 components/             # Reusable UI Components ✅ COMPLETE
│       │   │   ├── SearchBar.tsx          # Advanced search with voice input
│       │   │   ├── HospitalsGrid.tsx      # Hospital search results
│       │   │   ├── ProceduresList.tsx     # Procedures browser
│       │   │   ├── HealthTourismPackages.tsx
│       │   │   ├── HealthTourismDestinations.tsx
│       │   │   └── index.ts               # Component exports
│       │   │
│       │   ├── 📁 lib/                    # Client Utilities ✅ COMPLETE
│       │   │   ├── api-client.ts          # HTTP client with auth
│       │   │   ├── types.ts               # 20+ TypeScript interfaces
│       │   │   ├── hooks.ts               # 15+ custom React hooks
│       │   │   └── utils.ts
│       │   │
│       │   └── 📁 styles/                 # Tailwind CSS
│       │
│       ├── 📁 public/                     # Static assets
│       ├── next.config.js
│       ├── tsconfig.json
│       ├── tailwind.config.js             # Extended with custom colors
│       ├── Dockerfile
│       ├── package.json
│       ├── COMPONENTS.md                  # Component documentation
│       ├── DASHBOARD_IMPLEMENTATION.md    # Dashboard guide
│       └── .env.example
│
├── 📁 packages/                            # Shared packages
│   │
│   ├── 📁 database/                       # Prisma database package
│   │   ├── 📁 prisma/
│   │   │   ├── schema.prisma              # Database schema
│   │   │   ├── seed.ts                    # Seed data
│   │   │   └── 📁 migrations/
│   │   │
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   ├── 📁 shared-types/                   # TypeScript types (planned)
│   └── 📁 utils/                          # Common utilities (planned)
│
├── 📁 docs/                                # Documentation
│   ├── ARCHITECTURE.md                    # System design & flows
│   ├── PHASE3_TESTING.md                  # Integration testing guide
│   ├── CI_CD_SETUP.md                     # GitHub Actions guide
│   ├── SPRINT2_IMPLEMENTATION.md          # Sprint 2 overview
│   ├── API.md                             # API reference (planned)
│   ├── DATABASE.md                        # Schema documentation (planned)
│   └── COMPLIANCE.md                      # HIPAA/GDPR guidelines (planned)
│
├── 📁 .github/                             # GitHub configuration
│   └── 📁 workflows/                      # GitHub Actions CI/CD
│       ├── ci-fast.yml                    # Lint on every push (~2 min)
│       ├── ci-full.yml                    # Tests on PR/main (~10 min)
│       └── coverage.yml                   # Coverage tracking (~2 min)
│
├── 📁 samples/                             # Sample data files
│   ├── hhs_2026_sample.json
│   ├── ehds_2026_sample.json
│   └── abdm_2026_sample.json
│
├── docker-compose.yml                     # Docker orchestration
├── pnpm-workspace.yaml                    # Monorepo configuration
├── package.json                           # Root package
├── .gitignore                             # Git exclusions
├── README.md                              # This file
├── PHASE3_QUICKREF.sh                     # Testing quick reference
├── CI_CD_QUICKSTART.sh                    # CI/CD quick reference
└── LICENSE                                # License file
```
