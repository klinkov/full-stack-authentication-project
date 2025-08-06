# Full-Stack Authentication Project

This project is a full-stack application with TypeScript, featuring a React frontend and NestJS backend, integrated with Keycloak for authentication.

## Features

- User authentication with Keycloak
- User registration with email verification
- Profile management
- Password reset functionality
- Secure API endpoints
- PostgreSQL database integration

## Prerequisites

- Node.js 20.x
- Docker and Docker Compose
- PostgreSQL 15
- Keycloak 22.0.1

## Project Structure

```
.
├── frontend/          # React + Vite frontend
├── backend/           # NestJS backend
├── docker/           # Docker configuration files
└── keycloak/         # Keycloak configuration
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Start the services using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the applications:
   - Frontend: http://localhost:3030
   - Backend API: http://localhost:3000
   - Keycloak Admin: http://localhost:8080
   - MailDev: http://localhost:1080

## Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run start:dev
```

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=automation-form
VITE_KEYCLOAK_CLIENT_ID=automation-client
```

### Backend (.env)
```
DATABASE_URL=postgresql://automation_user:automation_pass@localhost:5432/automation_form
KEYCLOAK_JWKS_URI=http://localhost:8080/realms/automation-form/protocol/openid-connect/certs
PORT=3000
```

## API Endpoints

### Authentication
- POST /auth/login - User login
- POST /auth/register - User registration
- PUT /auth/profile - Update user profile
- PUT /auth/password - Change password
- POST /auth/reset-password - Request password reset

## Security

- JWT-based authentication
- Password hashing via Keycloak
- CORS configuration
- Input validation
- Protected routes

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

Some screenshots:
* Registration ![Register.png](doc/Register.png)
* Login ![Login.png](doc/Login.png)
* Profile / Change Profile ![Profile-Change_Profile.png](doc/Profile-Change_Profile.png)
* Profile / Change password ![Profile-Change_Password.png](doc/Profile-Change_Password.png)
