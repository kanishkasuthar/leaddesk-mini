-- LeadDesk Mini - Database Schema
-- Database: leaddesk

CREATE DATABASE IF NOT EXISTS leaddesk;
USE leaddesk;

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

-- Seed initial data for testing
INSERT INTO leads (name, email, budget, message, status) VALUES 
('Aarav Sharma', 'aarav.sharma@example.com', '₹25,000 - ₹50,000', 'Looking for full-stack web development services for our upcoming e-commerce portal.', 'New'),
('Priya Patel', 'priya.p@techsolutions.in', 'Above ₹50,000', 'Interested in custom CRM software integration and lead automation tools.', 'Contacted'),
('Rohan Verma', 'rohan@verma-designs.com', '₹10,000 - ₹25,000', 'Need a high-converting landing page built for our digital marketing agency.', 'Closed');
