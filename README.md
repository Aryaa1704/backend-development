# bakend-development
This project is a secure and scalable REST API with JWT authentication, role-based access control (user/admin), and full CRUD operations on tasks. Built with Node.js, Express, MongoDB, and secured by password hashing. It includes API docs and a React frontend for user login, task management, and error handling.
# JWT Task Manager: Express Backend + React Frontend

This project is a small but real full-stack app. Think of it like a secure notebook:

- **Backend / API** = the kitchen that receives requests, checks permission, and talks to the database.
- **Frontend / UI** = the menu screen people click on.
- **JWT token** = a temporary digital wristband proving the user has logged in.
- **Role** = a permission badge. A `user` sees their own tasks; an `admin` can see all tasks.
- **CRUD** = Create, Read, Update, Delete.

## Features

### Backend

- Node.js + Express REST API
- API versioning under `/api/v1`
- MongoDB database schema with Mongoose
- Register and login endpoints
- Password hashing with bcrypt
- JWT authentication
- Role-based access control foundation for `user` and `admin`
- Task CRUD API
- Joi input validation
- MongoDB query sanitization, Helmet security headers, CORS, rate limiting
- Central error handling
- Swagger API docs at `/api-docs`

### Frontend

- React + Vite
- Register and login forms
- Protected dashboard after login
- Create, list, update, and delete tasks
- Displays API success/error messages

## Project structure

```text
backend/
  src/
    config/        Database and environment setup
    controllers/   Request logic for auth and tasks
    docs/          Swagger/OpenAPI setup
    middleware/    Auth, validation, and error helpers
    models/        MongoDB schemas
    routes/        API route files
    utils/         Small reusable helpers
frontend/
  src/
    api/           API client helper
    main.jsx       React app
```

## Setup

### 1. Install dependencies

```bash
npm install
npm run install:all
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set a long random `JWT_SECRET`.

### 3. Start MongoDB

Use a local MongoDB server, Docker, or MongoDB Atlas. The default local URL is:

```text
mongodb://127.0.0.1:27017/task_auth_api
```

### 4. Run the app

```bash
npm run dev
```

- API: <http://localhost:5000>
- Swagger docs: <http://localhost:5000/api-docs>
- Frontend: <http://localhost:5173>

## Main API endpoints

| Method | URL | Meaning |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Create a new account |
| POST | `/api/v1/auth/login` | Log in and receive JWT |
| GET | `/api/v1/auth/me` | Get current logged-in user |
| GET | `/api/v1/tasks` | List tasks |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/tasks/:id` | Read one task |
| PATCH | `/api/v1/tasks/:id` | Update task |
| DELETE | `/api/v1/tasks/:id` | Delete task |

## How JWT protection works, simply

1. User logs in with email and password.
2. Backend checks the password.
3. Backend returns a JWT token.
4. Frontend sends that token on protected requests using this header:

```text
Authorization: Bearer YOUR_TOKEN_HERE
```

5. Backend verifies the token before allowing access.

## Scalability note

This app is split into modules, so new features can become new folders with their own model, controller, routes, and validation. For bigger traffic, you can run multiple API servers behind a load balancer, use Redis for caching and rate-limit storage, move secrets to a managed secret vault, add request logging/monitoring, and deploy MongoDB as a managed replica set.

## Production reminders

- Use HTTPS only.
- Use a long strong `JWT_SECRET`.
- Prefer secure HTTP-only cookies for JWT storage in production.
- Add automated tests and CI before a real launch.
- Restrict admin registration in production; usually only existing admins should create other admins.
