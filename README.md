# Stock Inventory Management System (SIMS)

A modern, full-stack Stock Inventory Management System built with React, Node.js, Express, and MySQL. This system helps businesses manage their inventory, track stock movements, and generate reports efficiently.

## 🌟 Features

- **User Authentication & Authorization**
  - Secure login and registration
  - Role-based access control (Admin/User)
  - JWT-based authentication

- **Inventory Management**
  - Add, edit, and delete spare parts
  - Track stock levels
  - Set minimum quantity alerts
  - Categorize items
  - Price management

- **Stock Movements**
  - Record stock in/out
  - Track movement history
  - Generate movement reports
  - Audit trail

- **Reporting & Analytics**
  - Stock value calculation
  - Low stock alerts
  - Movement history
  - User activity logs

- **User Management**
  - User roles and permissions
  - Activity tracking
  - Status management

## 🚀 Technology Stack

- **Frontend:**
  - React with TypeScript
  - Tailwind CSS for styling
  - React Router for navigation
  - Context API for state management
  - Axios for API calls

- **Backend:**
  - Node.js & Express
  - MySQL database
  - JWT for authentication
  - Express-validator for validation

- **Development Tools:**
  - Git for version control
  - npm for package management
  - ESLint for code linting
  - Prettier for code formatting

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BenBonheur/sims.git
   cd sims
   ```

2. **Install dependencies:**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # In root directory
   cp .env.example .env

   # Update .env with your configuration
   ```

4. **Initialize database:**
   ```bash
   # Create database tables
   npm run init-db
   ```

5. **Start the application:**
   ```bash
   # Start backend (from root directory)
   npm run dev

   # Start frontend (in another terminal)
   cd frontend
   npm run dev
   ```

## 🔧 Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=stock_management

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=24h
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Inventory Endpoints
- `GET /api/parts` - Get all spare parts
- `POST /api/parts` - Create new part
- `GET /api/parts/:id` - Get part details
- `PUT /api/parts/:id` - Update part
- `DELETE /api/parts/:id` - Delete part

### Stock Movement Endpoints
- `POST /api/stock/in` - Record stock in
- `POST /api/stock/out` - Record stock out
- `GET /api/stock/movements` - Get movement history
- `GET /api/stock/low` - Get low stock items

### User Management Endpoints
- `GET /api/users` - Get all users (Admin only)
- `PUT /api/users/:id/status` - Update user status
- `GET /api/users/:id/activity` - Get user activity

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email benbonheur2@gmail.com or create an issue in the repository.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MySQL (v8.0 or higher)
- Git

## Project Structure

```
sms/
├── frontend-project/     # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── ...
│   ├── package.json
│   └── ...
├── server.js            # Express backend
├── config/
│   └── database.js      # Database configuration
├── scripts/
│   └── init-db.js       # Database initialization script
├── package.json
└── .env                 # Environment variables
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sms
```

### 2. Set Up Backend

```bash
# Install backend dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stock_management
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### 3. Set Up Frontend

```bash
# Navigate to frontend directory
cd frontend-project

# Install frontend dependencies
npm install

# Create .env file for frontend
cp .env.example .env
```

Edit the frontend `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Set Up MySQL Database

1. Create the database:
```sql
CREATE DATABASE stock_management;
```

2. Initialize the database:
```bash
# Run the database initialization script
node scripts/init-db.js
```

This will:
- Create all necessary tables
- Set up required indexes
- Create an initial admin user

### 5. Run the Application

#### Start Backend Server:
```bash
# In the root directory
npm run dev
```

#### Start Frontend Development Server:
```bash
# In another terminal, navigate to frontend directory
cd frontend-project
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (Protected)
- PUT `/api/auth/profile` - Update user profile (Protected)

### Admin Routes
- GET `/api/users` - Get all users (Admin only)
- PUT `/api/users/:id/status` - Update user status (Admin only)

## Default User Credentials

After setting up the project, you can create an admin user using the registration endpoint:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

## Common Issues & Solutions

### MySQL Connection Issues
1. Ensure MySQL is running
2. Check MySQL connection string in `.env`
3. Verify MySQL port (default: 3306)

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Node.js/npm Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## Development Commands

### Backend
```bash
# Run in development mode
npm run dev

# Run in production mode
npm start

# Check for linting errors
npm run lint
```

### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Security Notes

1. Never commit `.env` files
2. Change default JWT secret
3. Use strong passwords
4. Keep dependencies updated

## Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use secure MySQL connection
3. Set strong JWT secret
4. Enable CORS for frontend domain

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Set correct API URL in environment
3. Deploy static files to hosting service

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Database Management

### 1. MySQL Commands

```sql
-- Connect to MySQL
mysql -u root -p

-- Show databases
SHOW DATABASES;

-- Use stock management database
USE stock_management;

-- Show tables
SHOW TABLES;

-- View table structure
DESCRIBE users;
DESCRIBE spare_parts;
DESCRIBE stock_movements;

-- View all users
SELECT * FROM users;

-- View user by email
SELECT * FROM users WHERE email = 'admin@example.com';

-- Update user role
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';

-- Delete user
DELETE FROM users WHERE email = 'user@example.com';
```

### 2. Database Backup & Restore

#### Creating Backups

1. **Full Database Backup:**
```bash
# Windows
mysqldump -u root -p stock_management > C:\backup\stock_management.sql

# Linux/macOS
mysqldump -u root -p stock_management > /backup/stock_management.sql
```

2. **Single Table Backup:**
```bash
# Backup users table
mysqldump -u root -p stock_management users > ./backup/users.sql
```

3. **Compressed Backup:**
```bash
# Windows
mysqldump -u root -p stock_management | gzip > C:\backup\stock_management.sql.gz

# Linux/macOS
mysqldump -u root -p stock_management | gzip > /backup/stock_management.sql.gz
```

#### Restoring Backups

1. **Full Database Restore:**
```bash
# Windows
mysql -u root -p stock_management < C:\backup\stock_management.sql

# Linux/macOS
mysql -u root -p stock_management < /backup/stock_management.sql
```

2. **Single Table Restore:**
```bash
mysql -u root -p stock_management < ./backup/users.sql
```

3. **Compressed Restore:**
```bash
# Windows
gunzip < C:\backup\stock_management.sql.gz | mysql -u root -p stock_management

# Linux/macOS
gunzip < /backup/stock_management.sql.gz | mysql -u root -p stock_management
```

### 3. Database Maintenance

#### Regular Maintenance Tasks

1. **Optimize Tables:**
```sql
OPTIMIZE TABLE users, spare_parts, stock_movements;
```

2. **Analyze Tables:**
```sql
ANALYZE TABLE users, spare_parts, stock_movements;
```

3. **Check Tables:**
```sql
CHECK TABLE users, spare_parts, stock_movements;
```

#### Performance Optimization

1. **Show Table Indexes:**
```sql
SHOW INDEX FROM users;
SHOW INDEX FROM spare_parts;
SHOW INDEX FROM stock_movements;
```

2. **Add Index:**
```sql
-- Add index on category field
ALTER TABLE spare_parts ADD INDEX idx_category (category);
```

3. **Remove Index:**
```sql
ALTER TABLE spare_parts DROP INDEX idx_category;
```

### 4. Troubleshooting

1. **Check MySQL Status:**
```bash
# Windows
net start MySQL80

# Linux
systemctl status mysql

# macOS
brew services list
```

2. **View MySQL Error Log:**
```bash
# Windows
type "C:\ProgramData\MySQL\MySQL Server 8.0\data\error.log"

# Linux
sudo tail -f /var/log/mysql/error.log

# macOS
tail -f /usr/local/var/mysql/error.log
```

3. **Check MySQL Variables:**
```sql
SHOW VARIABLES LIKE '%max_connections%';
SHOW VARIABLES LIKE '%timeout%';
```

4. **Monitor Current Connections:**
```sql
SHOW PROCESSLIST;
```