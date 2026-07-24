# LeadDesk Mini — Monolith Edition 🏛️

> **Crafted for the Digital Heroes Training Task**  
> Official Website: [https://digitalheroesco.com](https://digitalheroesco.com)

**LeadDesk Mini (Monolith Edition)** is a luxury editorial workspace built with inspiration from Apple, Linear, Notion, Arc Browser, Porsche, and Stripe. Designed with an uncompromising commitment to craft, it features a warm architectural ivory aesthetic (`#F6F5F2`), Satoshi typography, and Deep Burgundy (`#6E2132`) accents.

---

## 🎨 Monolith Design System

| Element | Specification |
| :--- | :--- |
| **Theme Name** | **MONOLITH** |
| **Style** | Luxury Editorial Workspace |
| **Mood** | Calm • Premium • Minimal • Executive • Modern • Expensive |
| **Background** | `#F6F5F2` (Warm Ivory / Paper Texture) |
| **Cards** | `#FFFFFF` (Pure Crisp White) |
| **Primary Text** | `#161616` (Deep Charcoal Black) |
| **Secondary Text** | `#6B7280` (Muted Slate) |
| **Accent** | **Deep Burgundy `#6E2132`** (Single accent throughout) |
| **Typography** | **Satoshi / General Sans** (Headings) + **Inter** (Body) |

---

## 🌟 Key Features & Hidden Wow Features

### 🏛️ Landing Experience
- **Luxury Navbar**: Features brand logo, links (`Home`, `Workflow`, `Features`, `Contact`, `Admin`), CTA button, and a **hidden live Bangalore time clock** updating every second.
- **Hero Section**:
  - Headline: *"Every Opportunity Deserves Attention."*
  - Subheading: *"LeadDesk Mini transforms customer enquiries into organized business opportunities with clarity, precision and elegance."*
  - Action CTAs: `Start Managing` and `View Dashboard`.
  - Right Side: **Floating Live Lead Feed** showing live notifications.
- **Workflow Journey**: 6-step animated journey (Someone Visits → Submits Inquiry → Stored Securely → Team Reviews → Status Updated → Opportunity Closed).
- **Lead Capture Form**: Premium application form with fields for Full Name, Email Address, Budget Range (`Below ₹10,000`, `₹10,000–₹25,000`, `₹25,000–₹50,000`, `Above ₹50,000`), and Message. Triggers toast *"✨ Opportunity successfully captured."* and resets automatically.
- **Statistics Section**: Animated counters for Active Opportunities, Projects Delivered, Response Rate, and Client Satisfaction.
- **Footer**: Includes mandatory statement *"Crafted for the Digital Heroes Training Task."* with hyperlink to `https://digitalheroesco.com` and tech stack badges (`React`, `Express`, `MySQL`, `Tailwind`, `Vercel`, `Render`).

### 💼 Executive Workspace (`/admin`)
- **Executive Greeting**: Time-aware greeting (*"Good Morning, Admin."* / *"Good Afternoon, Admin."*).
- **Today's Lead Pulse**: 4 KPI Cards (`Active Opportunities`, `New Today`, `Contacted`, `Closed`).
- **Today's Quote Banner**: Randomly cycling executive quotes (*"Every conversation begins with a lead."*).
- **Large Search Bar**: Instant multi-field search (`/` keyboard shortcut to focus search).
- **Desktop View Switcher**: Toggle seamlessly between **Cards View** and **Table View**.
- **Slide-Over Lead Drawer**: Clicking any opportunity opens a drawer showing full details, status dropdown, GitHub-style activity timeline, and local executive notes.
- **Keyboard Shortcuts**:
  - `/` -> Focus Search
  - `Ctrl + K` / `Cmd + K` -> Command Palette Modal
  - `N` -> Jump to New Lead Form
- **Quick Actions Bar**: Floating controls to Add Lead, Refresh Telemetry, and **Export CSV**.
- **Quiet Empty State**: *"The workspace is quiet. New opportunities will appear here."*

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 + Vite |
| **Styling** | Tailwind CSS v4 + Monolith Luxury Editorial CSS |
| **Typography** | Satoshi + General Sans + Inter |
| **Animations & Icons** | Framer Motion + Lucide Icons |
| **Routing & HTTP** | React Router v6 + Axios |
| **Backend Framework** | Node.js + Express.js (MVC Pattern) |
| **Database** | MySQL (`mysql2` promise pool) |

---

## 🚀 Local Quickstart Guide

### 1. Backend Setup
```bash
cd backend
npm install
```
Configure `.env`:
```env
PORT=5001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=leaddesk
DB_PORT=3306
```
Start Server:
```bash
npm run dev
# Running at http://localhost:5001/api/leads
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Running at http://localhost:3000
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Sample Payload / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leads` | Create Lead Enquiry | `{"name":"John", "email":"john@test.com", "budget":"Above ₹50,000", "message":"Brief"}` |
| `GET` | `/api/leads` | Return all leads (newest first) | - |
| `PUT` | `/api/leads/:id` | Update lead status | `{"status": "Contacted"}` (`New`, `Contacted`, `Closed`) |
| `GET` | `/api/leads/search` | Search leads | `?q=Sharma` |
| `GET` | `/api/leads/stats` | Return summary metrics | - |

---

## 🌐 Production Deployment Guide

### 1. MySQL Database Setup
Run `backend/schema.sql` on Aiven, Railway, or PlanetScale:
```sql
CREATE DATABASE IF NOT EXISTS leaddesk;
USE leaddesk;
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    budget VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('New', 'Contacted', 'Closed') DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Backend Deployment on Render
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`
- Env Vars: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`.

### 3. Frontend Deployment on Vercel
- Root Directory: `frontend`
- Framework: `Vite`
- Env Var: `VITE_API_URL=https://<your-render-backend>.onrender.com/api/leads`

---

## 📌 Attribution Statement

Crafted for the [Digital Heroes](https://digitalheroesco.com) Training Task.
