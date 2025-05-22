const bcrypt = require('bcryptjs');
const { initializeDatabase, query } = require('../config/database');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Check if admin exists
    const [existingAdmin] = await query(
      'SELECT * FROM users WHERE email = ?',
      ['admin@example.com']
    );

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@example.com', hashedPassword, 'admin']
    );

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

const init = async () => {
  try {
    // Initialize database tables
    await initializeDatabase();

    // Create admin user
    await createAdminUser();

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  }
};

// Run initialization
init(); 