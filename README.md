# 🏥 Hospital Management System

A **multi-tenant Hospital Management System** built with Spring Boot microservices and React, showcasing clean architecture, RBAC, and modern UI design.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌────────────────────┐
│ React + Vite │────▶│  auth-service    │     │    MySQL 8.0       │
│ (Port 5173)  │     │  (Port 8081)     │────▶│  (Port 3306)       │
│              │     ├──────────────────┤     │  Database: hms_db  │
│ TailwindCSS  │────▶│ hospital-service │────▶│                    │
│ Recharts     │     │  (Port 8082)     │     └────────────────────┘
│              │     ├──────────────────┤     ┌────────────────────┐
│              │────▶│appointment-svc   │────▶│  MinIO / AWS S3    │
│              │     │  (Port 8083)     │     │  (Port 9000)       │
└─────────────┘     └──────────────────┘     └────────────────────┘
```

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, TailwindCSS       |
| Backend    | Java 17, Spring Boot 3.2          |
| Database   | MySQL 8.0, JPA/Hibernate          |
| Auth       | JWT (jjwt), BCrypt, Spring Security |
| Storage    | MinIO (local) / AWS S3 (config)   |
| Charts     | Recharts                          |

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+ & npm
- Docker & Docker Compose (for MySQL + MinIO)

### 1. Start Infrastructure
```bash
docker-compose up -d
```
This starts MySQL (port 3306) and MinIO (port 9000).

### 2. Build & Run Backend
```bash
cd backend
mvn clean install
```

Start each service (in separate terminals):
```bash
cd auth-service && mvn spring-boot:run
cd hospital-service && mvn spring-boot:run
cd appointment-service && mvn spring-boot:run
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Demo Credentials
| Role   | Username | Password   |
|--------|----------|------------|
| Admin  | admin    | admin123   |
| Doctor | doctor   | doctor123  |
| Staff  | staff    | staff123   |

## Features

- **Multi-Tenancy**: All data scoped by `cid` (Client/Hospital ID)
- **RBAC**: Admin, Doctor, Staff roles with different access levels
- **Dashboard**: KPI cards + charts (patients, doctors, appointments, medicine stock)
- **CRUD**: Full management of Hospitals, Doctors, Patients, Staff, Medicine Stock
- **Appointments**: Booking, status tracking, doctor notes
- **Image Upload**: Up to 2 images per appointment (MinIO/S3)
- **Modern UI**: Dark theme, glassmorphism, smooth animations

## Project Structure

```
├── backend/
│   ├── common/           # Shared: JWT, security, exceptions
│   ├── auth-service/     # Login, register, JWT (port 8081)
│   ├── hospital-service/ # Hospital, Doctor, Patient, Staff, Medicine (port 8082)
│   └── appointment-service/ # Appointments, image upload (port 8083)
├── frontend/
│   └── src/
│       ├── api/          # Axios client
│       ├── components/   # Sidebar, Navbar, KpiCard, DataTable, Modal
│       ├── context/      # AuthContext
│       ├── pages/        # All page components
│       └── routes/       # ProtectedRoute
├── docker-compose.yml
└── README.md
```

## Environment Configuration

### Storage Switch (appointment-service)
```properties
# MinIO (default)
storage.type=minio
minio.endpoint=http://localhost:9000

# AWS S3
storage.type=s3
aws.s3.bucket=your-bucket
aws.s3.region=us-east-1
```

---

Built for portfolio demonstration purposes.
