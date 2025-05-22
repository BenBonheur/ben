const { query, transaction } = require('../config/database');

/**
 * Generic CRUD operations
 */
const dbUtils = {
  // Create a new record
  async create(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(',');
    
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    const result = await query(sql, values);
    return { id: result.insertId, ...data };
  },

  // Read records with optional conditions
  async find(table, conditions = {}, options = {}) {
    const {
      select = '*',
      limit,
      offset,
      orderBy,
      groupBy
    } = options;

    let sql = `SELECT ${select} FROM ${table}`;
    const values = [];

    // Handle WHERE conditions
    const whereConditions = Object.entries(conditions).filter(([_, value]) => value !== undefined);
    if (whereConditions.length > 0) {
      sql += ' WHERE ' + whereConditions.map(([key, _]) => `${key} = ?`).join(' AND ');
      values.push(...whereConditions.map(([_, value]) => value));
    }

    // Add GROUP BY if specified
    if (groupBy) {
      sql += ` GROUP BY ${groupBy}`;
    }

    // Add ORDER BY if specified
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    // Add LIMIT and OFFSET if specified
    if (limit) {
      sql += ' LIMIT ?';
      values.push(limit);
      
      if (offset) {
        sql += ' OFFSET ?';
        values.push(offset);
      }
    }

    return await query(sql, values);
  },

  // Find a single record
  async findOne(table, conditions) {
    const results = await this.find(table, conditions, { limit: 1 });
    return results[0] || null;
  },

  // Update records
  async update(table, conditions, data) {
    const updates = Object.entries(data)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`);
    
    const whereConditions = Object.entries(conditions)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`);

    if (updates.length === 0) return { affectedRows: 0 };

    const sql = `
      UPDATE ${table}
      SET ${updates.join(', ')}
      WHERE ${whereConditions.join(' AND ')}
    `;

    const values = [
      ...Object.values(data).filter(value => value !== undefined),
      ...Object.values(conditions).filter(value => value !== undefined)
    ];

    return await query(sql, values);
  },

  // Delete records
  async delete(table, conditions) {
    const whereConditions = Object.entries(conditions)
      .filter(([_, value]) => value !== undefined)
      .map(([key, _]) => `${key} = ?`);

    const sql = `DELETE FROM ${table} WHERE ${whereConditions.join(' AND ')}`;
    const values = Object.values(conditions).filter(value => value !== undefined);

    return await query(sql, values);
  },

  /**
   * Inventory specific operations
   */
  
  // Update stock quantity with movement tracking
  async updateStock(partId, quantity, type, userId, reason) {
    return await transaction(async (connection) => {
      // Update spare part quantity
      const updateSql = type === 'in'
        ? 'UPDATE spare_parts SET quantity = quantity + ? WHERE id = ?'
        : 'UPDATE spare_parts SET quantity = quantity - ? WHERE id = ? AND quantity >= ?';
      
      const updateParams = type === 'in'
        ? [quantity, partId]
        : [quantity, partId, quantity];

      const updateResult = await connection.execute(updateSql, updateParams);
      
      if (updateResult[0].affectedRows === 0) {
        throw new Error('Insufficient stock or part not found');
      }

      // Record movement
      await connection.execute(
        'INSERT INTO stock_movements (spare_part_id, type, quantity, user_id, reason) VALUES (?, ?, ?, ?, ?)',
        [partId, type, quantity, userId, reason]
      );

      // Get updated part details
      const [part] = await connection.execute(
        'SELECT * FROM spare_parts WHERE id = ?',
        [partId]
      );

      return part[0];
    });
  },

  // Check low stock items
  async getLowStockItems() {
    return await query(`
      SELECT *
      FROM spare_parts
      WHERE quantity <= minimum_quantity
        AND status = 'active'
      ORDER BY quantity ASC
    `);
  },

  // Get stock movement history
  async getStockMovements(options = {}) {
    const {
      partId,
      userId,
      type,
      startDate,
      endDate,
      limit = 100,
      offset = 0
    } = options;

    let sql = `
      SELECT 
        sm.*,
        sp.name as part_name,
        u.name as user_name
      FROM stock_movements sm
      JOIN spare_parts sp ON sm.spare_part_id = sp.id
      JOIN users u ON sm.user_id = u.id
      WHERE 1=1
    `;
    const values = [];

    if (partId) {
      sql += ' AND sm.spare_part_id = ?';
      values.push(partId);
    }

    if (userId) {
      sql += ' AND sm.user_id = ?';
      values.push(userId);
    }

    if (type) {
      sql += ' AND sm.type = ?';
      values.push(type);
    }

    if (startDate) {
      sql += ' AND sm.created_at >= ?';
      values.push(startDate);
    }

    if (endDate) {
      sql += ' AND sm.created_at <= ?';
      values.push(endDate);
    }

    sql += ' ORDER BY sm.created_at DESC LIMIT ? OFFSET ?';
    values.push(limit, offset);

    return await query(sql, values);
  },

  // Get stock value summary
  async getStockValueSummary() {
    return await query(`
      SELECT
        COUNT(*) as total_items,
        SUM(quantity) as total_quantity,
        SUM(quantity * unit_price) as total_value,
        AVG(unit_price) as average_price
      FROM spare_parts
      WHERE status = 'active'
    `);
  },

  /**
   * User management operations
   */

  // Get user activity
  async getUserActivity(userId, limit = 10) {
    return await query(`
      SELECT 
        sm.*,
        sp.name as part_name
      FROM stock_movements sm
      JOIN spare_parts sp ON sm.spare_part_id = sp.id
      WHERE sm.user_id = ?
      ORDER BY sm.created_at DESC
      LIMIT ?
    `, [userId, limit]);
  },

  // Update user status
  async updateUserStatus(userId, status, updatedBy) {
    return await transaction(async (connection) => {
      await connection.execute(
        'UPDATE users SET status = ? WHERE id = ?',
        [status, userId]
      );

      // Log status change
      await connection.execute(`
        INSERT INTO user_status_logs (user_id, status, updated_by)
        VALUES (?, ?, ?)
      `, [userId, status, updatedBy]);

      const [user] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      );

      return user[0];
    });
  }
};

module.exports = dbUtils; 