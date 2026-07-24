const { query } = require('../config/db');

class LeadModel {
  // Create a new lead with default status 'New'
  static async create({ name, email, budget, message }) {
    const sql = `
      INSERT INTO leads (name, email, budget, message, status)
      VALUES (?, ?, ?, ?, 'New')
    `;
    const result = await query(sql, [name, email, budget, message]);
    return result.insertId;
  }

  // Get all leads ordered by newest first
  static async getAll() {
    const sql = `SELECT * FROM leads ORDER BY created_at DESC`;
    return await query(sql);
  }

  // Find lead by ID
  static async getById(id) {
    const sql = `SELECT * FROM leads WHERE id = ?`;
    const rows = await query(sql, [id]);
    return rows[0] || null;
  }

  // Update lead status ('New', 'Contacted', 'Closed')
  static async updateStatus(id, status) {
    const sql = `UPDATE leads SET status = ? WHERE id = ?`;
    const result = await query(sql, [status, id]);
    return result.affectedRows > 0;
  }

  // Search leads by name, email, or message
  static async search(term) {
    const pattern = `%${term}%`;
    const sql = `
      SELECT * FROM leads 
      WHERE name LIKE ? OR email LIKE ? OR message LIKE ?
      ORDER BY created_at DESC
    `;
    return await query(sql, [pattern, pattern, pattern]);
  }

  // Get aggregated stats for top dashboard cards
  static async getStats() {
    const sql = `
      SELECT 
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) AS new_count,
        SUM(CASE WHEN status = 'Contacted' THEN 1 ELSE 0 END) AS contacted_count,
        SUM(CASE WHEN status = 'Closed' THEN 1 ELSE 0 END) AS closed_count
      FROM leads
    `;
    const rows = await query(sql);
    const stat = rows[0] || {};
    return {
      total: parseInt(stat.total || 0, 10),
      newCount: parseInt(stat.new_count || 0, 10),
      contactedCount: parseInt(stat.contacted_count || 0, 10),
      closedCount: parseInt(stat.closed_count || 0, 10)
    };
  }
}

module.exports = LeadModel;
