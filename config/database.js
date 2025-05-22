const mysql = require('mysql2/promise');
require('dotenv').config();

// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'stock_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Additional recommended settings
  enableKeepAlive: true,
  keepAliveInitialDelay: 0, // Immediate keep-alive
  timezone: 'Z', // UTC timezone
  dateStrings: true // Return date/time as strings
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('🎯 MySQL Connected Successfully');
    return true;
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  let connection;
  try {
    connection = await pool.getConnection();

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        last_login DATETIME,
        login_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create spare_parts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS spare_parts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        quantity INT NOT NULL DEFAULT 0,
        minimum_quantity INT NOT NULL DEFAULT 0,
        unit_price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255),
        status ENUM('active', 'discontinued') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_quantity (quantity)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create stock_movements table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stock_movements (
        id INT PRIMARY KEY AUTO_INCREMENT,
        spare_part_id INT NOT NULL,
        type ENUM('in', 'out') NOT NULL,
        quantity INT NOT NULL,
        reason TEXT,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_created_at (created_at),
        FOREIGN KEY fk_spare_part (spare_part_id) REFERENCES spare_parts(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY fk_user (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Create user_status_logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_status_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        status ENUM('active', 'inactive', 'suspended') NOT NULL,
        updated_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at),
        FOREIGN KEY fk_user_status (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
        FOREIGN KEY fk_updated_by (updated_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error.message);
    return false;
  } finally {
    if (connection) connection.release();
  }
};

// Execute a query with error handling and connection management
const query = async (sql, params = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

// Transaction helper
const transaction = async (callback) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const result = await callback(connection);
    
    await connection.commit();
    return result;
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Transaction error:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  query,
  transaction
}; 