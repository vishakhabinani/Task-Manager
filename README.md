# TaskManager - Capstone Project by Vishakha Binani

TaskManager is a full-stack task management application built with React, Spring Boot, MySQL, and Docker.

## Tech Stack

- **Frontend**: React (Vite, TypeScript), Tailwind CSS, Axios, Lucide React
- **Backend**: Spring Boot 3.2.4, Java 17, Spring Security + JWT, JPA/Hibernate
- **Database**: MySQL 8.x
- **Infrastructure**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## Features

- **User Authentication**: Secure login and registration with JWT.
- **Role-Based Access Control**:
  - **Admin**: Can manage all tasks and view all users.
  - **User**: Can create, update, and track their own tasks.
- **Task Management**:
  - CRUD operations on tasks.
  - Assign tasks to users (Admin only).
  - Status tracking (To Do, In Progress, Done).
- **Dashboard**: Filterable task list with modern UI.

## Getting Started

### Prerequisites

- Docker and Docker Compose installed.
- Node.js 20+ (for local development).
- JDK 17+ (for local development).

### Running with Docker

1. Clone the repository.
2. From the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Access the application:
   - **Frontend**: [http://localhost:4173](http://localhost:4173)
   - **Backend API**: [http://localhost:8080/api](http://localhost:8080/api)
   - **MySQL**: `localhost:3306` (User: `root`, Pass: `root`)

### Default Users (Example)

- **Admin**: `admin@example.com` / `password123` (Create via Register page with Role ADMIN)
- **User**: `user@example.com` / `password123` (Create via Register page)

## Project Structure

- `/backend`: Spring Boot source code, Dockerfile, and pom.xml.
- `/frontend`: React source code, Dockerfile, and package.json.
- `/docker-compose.yml`: Orchestration for db, backend, and frontend.
- `/.github/workflows/ci.yml`: GitHub Actions CI pipeline.

## API Documentation

The following endpoints are available:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate and receive a JWT.
- `GET /api/tasks`: Get all tasks (supports `status` and `assignedToId` filters).
- `POST /api/tasks`: Create a new task.
- `GET /api/tasks/{id}`: Get task details.
- `PUT /api/tasks/{id}`: Update a task.
- `DELETE /api/tasks/{id}`: Delete a task.
- `GET /api/users`: List all users (Admin only).
