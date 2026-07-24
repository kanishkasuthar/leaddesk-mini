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

  // Save password reset token and expiry timestamp
  static async setResetToken(email, hashedToken, expiryTime) {
    const sql = `UPDATE admins SET reset_token = ?, reset_token_expiry = ? WHERE email = ?`;
    await query(sql, [hashedToken, expiryTime, email]);
  }

  // Find admin by reset token
  static async findByResetToken(hashedToken) {
    const sql = `SELECT * FROM admins WHERE reset_token = ?`;
    const rows = await query(sql, [hashedToken]);
    return rows[0] || null;
  }

  // Update password and clear reset token
  static async updatePassword(id, hashedPassword) {
    const sql = `UPDATE admins SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?`;
    await query(sql, [hashedPassword, id]);
  }
}

module.exports = AdminModel;
