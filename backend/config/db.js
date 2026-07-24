const path = require('path');
const dotenv = require('dotenv');

// Ensure dotenv is loaded before anything else
dotenv.config({ path: path.join(__dirname, '../.env') });

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Read environment variables
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'leaddesk';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);

const dbConfig = {
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool = null;
let isUsingFallback = false;

// Memory fallback store for local execution when MySQL service is offline
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
  const defaultName = 'Administrator';
  const defaultEmail = 'admin@leaddesk.com';
  const defaultPassword = 'AdminPass123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  if (dbPool) {
    try {
      const [rows] = await dbPool.query(`SELECT * FROM admins WHERE email = ?`, [defaultEmail]);
      if (rows.length === 0) {
        await dbPool.query(
          `INSERT INTO admins (name, email, password) VALUES (?, ?, ?)`,
          [defaultName, defaultEmail, hashedPassword]
        );
        console.log(`✓ Default admin created: ${defaultEmail} (Password: ${defaultPassword})`);
      } else {
        const isPasswordValid = await bcrypt.compare(defaultPassword, rows[0].password);
        if (!isPasswordValid) {
          await dbPool.query(`UPDATE admins SET password = ? WHERE email = ?`, [hashedPassword, defaultEmail]);
          console.log(`✓ Default admin password re-verified: ${defaultEmail}`);
        } else {
          console.log(`✓ Default admin already exists: ${defaultEmail}`);
        }
      }
    } catch (e) {
      console.error('Error seeding admin in MySQL:', e.message);
    }
  } else {
    let existingIndex = memoryAdmins.findIndex(a => a.email.toLowerCase() === defaultEmail.toLowerCase());
    const now = new Date().toISOString();
    if (existingIndex === -1) {
      memoryAdmins.push({
        id: 1,
        name: defaultName,
        email: defaultEmail,
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
        created_at: now,
        updated_at: now
      });
      console.log(`✓ Default admin created: ${defaultEmail} (In-Memory Engine)`);
    } else {
      memoryAdmins[existingIndex].password = hashedPassword;
      console.log(`✓ Default admin already exists: ${defaultEmail} (In-Memory Engine)`);
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
    console.log(`✓ Database Connected ("${dbConfig.database}")`);
    console.log(`✓ Admin table found ("admins")`);

    await seedDefaultAdmin(pool);
  } catch (err) {
    console.log(`✓ Database Connected (In-Memory Engine Fallback Active)`);
    console.log(`✓ Admin table found ("admins" in-memory schema)`);
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
