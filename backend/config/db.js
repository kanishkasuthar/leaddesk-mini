const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

// MySQL Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'leaddesk',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isUsingFallback = false;

// Memory fallback store for local dev without MySQL
const memoryAdmins = [];
const memoryLeads = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    budget: "₹25,000 - ₹50,000",
    message: "Looking for full-stack web development services for our upcoming e-commerce portal.",
    status: "New",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya.p@techsolutions.in",
    budget: "Above ₹50,000",
    message: "Interested in custom CRM software integration and lead automation tools.",
    status: "Contacted",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 3,
    name: "Rohan Verma",
    email: "rohan@verma-designs.com",
    budget: "₹10,000 - ₹25,000",
    message: "Need a high-converting landing page built for our digital marketing agency.",
    status: "Closed",
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];
let memoryIdCounter = 4;

async function seedDefaultAdmin(dbPool) {
  const defaultPassword = 'AdminPass123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  if (dbPool) {
    const [rows] = await dbPool.query(`SELECT * FROM admins WHERE email = ?`, ['admin@leaddesk.com']);
    if (rows.length === 0) {
      await dbPool.query(
        `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`,
        ['LeadDesk Admin', 'admin@leaddesk.com', hashedPassword]
      );
      console.log(`[Database] Seeded default admin: admin@leaddesk.com`);
    }
  } else {
    if (memoryAdmins.length === 0) {
      const now = new Date().toISOString();
      memoryAdmins.push({
        id: 1,
        name: "LeadDesk Admin",
        email: "admin@leaddesk.com",
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        created_at: now,
        updated_at: now
      });
      console.log(`[Database Fallback] Seeded default admin: admin@leaddesk.com`);
    }
  }
}

async function initDB() {
  try {
    const rootConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    await rootConnection.end();

    pool = mysql.createPool(dbConfig);

    // Create leads table
    const createLeadsTable = `
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        budget VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('New', 'Contacted', 'Closed') DEFAULT 'New',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.query(createLeadsTable);

    // Create admins table
    const createAdminsTable = `
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255) DEFAULT NULL,
        reset_token_expiry VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.query(createAdminsTable);

    await seedDefaultAdmin(pool);
    console.log(`[Database] MySQL initialized successfully for database "${dbConfig.database}"!`);
  } catch (err) {
    console.warn(`[Database Notice] MySQL connection offline (${err.message}). Using in-memory fallback engine.`);
    isUsingFallback = true;
    await seedDefaultAdmin(null);
  }
}

async function query(sql, params = []) {
  if (!isUsingFallback && pool) {
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  const lowerSql = sql.toLowerCase().trim();

  // ADMIN QUERIES
  if (lowerSql.startsWith('select * from admins where email =')) {
    const email = params[0];
    return memoryAdmins.filter(a => a.email.toLowerCase() === email.toLowerCase());
  }

  if (lowerSql.startsWith('select * from admins where reset_token =')) {
    const token = params[0];
    return memoryAdmins.filter(a => a.reset_token === token);
  }

  if (lowerSql.startsWith('select * from admins where id =') || lowerSql.startsWith('select id, name, email, created_at from admins')) {
    const id = parseInt(params[0], 10);
    return memoryAdmins.filter(a => a.id === id);
  }

  if (lowerSql.startsWith('update admins set reset_token =')) {
    const [hashedToken, expiryTime, email] = params;
    const admin = memoryAdmins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (admin) {
      admin.reset_token = hashedToken;
      admin.reset_token_expiry = expiryTime;
      admin.updated_at = new Date().toISOString();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (lowerSql.startsWith('update admins set password =')) {
    const [hashedPassword, id] = params;
    const adminId = parseInt(id, 10);
    const admin = memoryAdmins.find(a => a.id === adminId);
    if (admin) {
      admin.password = hashedPassword;
      admin.reset_token = null;
      admin.reset_token_expiry = null;
      admin.updated_at = new Date().toISOString();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (lowerSql.startsWith('insert into admins')) {
    const now = new Date().toISOString();
    const newAdmin = {
      id: memoryAdmins.length + 1,
      name: params[0],
      email: params[1],
      password: params[2],
      reset_token: null,
      reset_token_expiry: null,
      created_at: now,
      updated_at: now
    };
    memoryAdmins.push(newAdmin);
    return { insertId: newAdmin.id };
  }

  // LEADS QUERIES
  if (lowerSql.startsWith('insert into leads')) {
    const now = new Date().toISOString();
    const newLead = {
      id: memoryIdCounter++,
      name: params[0],
      email: params[1],
      budget: params[2],
      message: params[3],
      status: params[4] || 'New',
      created_at: now,
      updated_at: now
    };
    memoryLeads.unshift(newLead);
    return { insertId: newLead.id };
  }

  if (lowerSql.startsWith('update leads set status')) {
    const status = params[0];
    const id = parseInt(params[1], 10);
    const lead = memoryLeads.find(item => item.id === id);
    if (lead) {
      lead.status = status;
      lead.updated_at = new Date().toISOString();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (lowerSql.includes('where name like') || lowerSql.includes('like')) {
    const q = params[0].replace(/%/g, '').toLowerCase();
    return memoryLeads.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)
    );
  }

  if (lowerSql.includes('count(')) {
    return [
      {
        total: memoryLeads.length,
        new_count: memoryLeads.filter(l => l.status === 'New').length,
        contacted_count: memoryLeads.filter(l => l.status === 'Contacted').length,
        closed_count: memoryLeads.filter(l => l.status === 'Closed').length,
      }
    ];
  }

  return [...memoryLeads].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

module.exports = {
  initDB,
  query,
  getPool: () => pool
};
