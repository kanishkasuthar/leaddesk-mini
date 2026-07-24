-- LeadDesk Mini - Database Schema (Task B)
-- Database: leaddesk

CREATE DATABASE IF NOT EXISTS leaddesk;
USE leaddesk;

-- Leads Table
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

-- Admins Table (Task B Authentication)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial lead data
INSERT INTO leads (name, email, budget, message, status) VALUES 
('Aarav Sharma', 'aarav.sharma@example.com', '₹25,000 - ₹50,000', 'Looking for full-stack web development services for our upcoming e-commerce portal.', 'New'),
('Priya Patel', 'priya.p@techsolutions.in', 'Above ₹50,000', 'Interested in custom CRM software integration and lead automation tools.', 'Contacted'),
('Rohan Verma', 'rohan@verma-designs.com', '₹10,000 - ₹25,000', 'Need a high-converting landing page built for our digital marketing agency.', 'Closed');

-- Seed default admin user (email: admin@leaddesk.com, password: AdminPass123!)
-- Password hash generated with bcryptjs (rounds: 10)
INSERT INTO admins (name, email, password) VALUES 
('LeadDesk Admin', 'admin@leaddesk.com', '$2a$10$Q7yN.zF0BvW0Q2m7Z9J7yO/W/wKxJzY7P7Z8yW0Q2m7Z9J7yO/W/w')
ON DUPLICATE KEY UPDATE email=email;
