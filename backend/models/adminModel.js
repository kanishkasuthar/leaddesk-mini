const { query } = require('../config/db');

class AdminModel {
  // Find admin by email
  static async findByEmail(email) {
    const sql = `SELECT * FROM admins WHERE email = ?`;
    const rows = await query(sql, [email]);
    return rows[0] || null;
  }

  // Find admin by ID
  static async findById(id) {
    const sql = `SELECT id, name, email, created_at FROM admins WHERE id = ?`;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  // Create new admin
  static async create({ name, email, password }) {
    const sql = `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`;
    const result = await query(sql, [name, email, password]);
    return result.insertId;
  }
}

module.exports = AdminModel;
