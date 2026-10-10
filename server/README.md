# Gavran Poultry Management Server

This is the backend server for the Gavran Poultry Management System, built with Node.js, Express, and TypeScript.

## Features

- User authentication (register/login)
- Farm management (create/list/get farms)  
- Shed management
- Bird batch tracking
- Mortality recording
- Dashboard statistics

## Prisma Database Setup

### 1. Database Configuration

Before running the application, you need to set up your MySQL database:

1. Create a MySQL user and database:
   ```sql
   CREATE DATABASE gavran_poultry_dev;
   CREATE USER 'gavran_user'@'localhost' IDENTIFIED BY 'secure_password';
   GRANT ALL PRIVILEGES ON gavran_poultry_dev.* TO 'gavran_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

2. Update your `.env` file with the database URL:
   ```
   DATABASE_URL="mysql://gavran_user:secure_password@localhost:3306/gavran_poultry_dev"
   JWT_SECRET="your_secure_jwt_secret_here"
   ```

### 2. Prisma Setup

Install dependencies:
```bash
npm install
```

Generate Prisma client:
```bash
npx prisma init
```

Create and apply migrations:
```bash
npx prisma migrate dev --name init
```

### 3. Run the Application

Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user  
- `GET /api/me` - Get current user info

### Farms
- `POST /api/farms` - Create farm
- `GET /api/farms` - List farms
- `GET /api/farms/:id` - Get farm details
- `GET /api/dashboard/stats` - Get dashboard statistics

### Sheds
- `POST /api/sheds` - Create shed
- `GET /api/sheds` - List sheds for a farm

### Bird Batches
- `POST /api/batches` - Create batch
- `GET /api/batches` - List batches for a farm
- `POST /api/batches/mortality` - Record mortality
- `GET /api/batches/:id/summary` - Get batch summary

## Project Structure

```
src/
├── app.ts                 # Main application file
├── routes/                # API route handlers
├── services/              # Business logic services
├── middleware/            # Request middleware (auth, etc)
├── prisma/                # Prisma schema and migrations
└── tests/                 # Test files
```

## Security

- Passwords are hashed using bcrypt with salt rounds = 10
- JWT tokens used for authentication with 1-hour expiration
- Farm access is validated per-user to prevent unauthorized data access
- All API endpoints are protected by authentication middleware