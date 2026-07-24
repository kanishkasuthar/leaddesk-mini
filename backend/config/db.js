const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
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

// Memory fallback store for when MySQL server is offline/unconfigured locally
const memoryStore = [
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

    const createTableQuery = `
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
    await pool.query(createTableQuery);
    console.log(`[Database] MySQL connected successfully to database "${dbConfig.database}"!`);
  } catch (err) {
    console.warn(`[Database] MySQL connection notice (${err.message}). Using fallback data engine for local dev.`);
    isUsingFallback = true;
  }
}

async function query(sql, params = []) {
  if (!isUsingFallback && pool) {
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  const lowerSql = sql.toLowerCase();

  // INSERT
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
    memoryStore.unshift(newLead);
    return { insertId: newLead.id };
  }

  // UPDATE STATUS
  if (lowerSql.startsWith('update leads set status')) {
    const status = params[0];
    const id = parseInt(params[1], 10);
    const lead = memoryStore.find(item => item.id === id);
    if (lead) {
      lead.status = status;
      lead.updated_at = new Date().toISOString();
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  // SEARCH / GET ALL
  if (lowerSql.includes('where name like') || lowerSql.includes('like')) {
    const q = params[0].replace(/%/g, '').toLowerCase();
    return memoryStore.filter(item =>
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)
    );
  }

  // SELECT STATS
  if (lowerSql.includes('count(')) {
    return [
      {
        total: memoryStore.length,
        new_count: memoryStore.filter(l => l.status === 'New').length,
        contacted_count: memoryStore.filter(l => l.status === 'Contacted').length,
        closed_count: memoryStore.filter(l => l.status === 'Closed').length,
      }
    ];
  }

  // DEFAULT SELECT ALL
  return [...memoryStore].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

module.exports = {
  initDB,
  query,
  getPool: () => pool
};
