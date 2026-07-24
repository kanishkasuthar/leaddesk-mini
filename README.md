# LeadDesk Mini — Sandstone & Espresso Edition 🌾

> **Crafted for Digital Heroes Training Task**  
> Mandatory Attribution: [Digital Heroes](https://digitalheroesco.com)

**LeadDesk Mini** is an editorial lead management workspace built with the **Sandstone & Espresso** design system. Designed with inspiration from Apple, Notion, Aesop, COS, and high-end architecture publications, it features warm sandstone surfaces (`#F4EFE8`), Satoshi headings, Deep Espresso (`#4A3728`) accents, real MySQL persistence, and JWT admin authentication.

---

## 🔐 Test Admin Credentials (Task B)

Evaluators can access the protected Executive Workspace (`/admin`) using these credentials:

| Field | Value |
| :--- | :--- |
| **Login URL** | `/login` (redirects automatically if accessing `/admin`) |
| **Email** | `admin@leaddesk.com` |
| **Password** | `AdminPass123!` |
| **Authentication** | JWT Bearer Token (24-hour default / 7-day Remember Me) |
| **Password Hashing** | Bcrypt (10 rounds) |

---

## 🌟 Key Features

### 🏛️ Public Experience (Task A)
- **Glass Sticky Navbar**: Brand logo, navigation anchors, Bangalore live clock updating every second, and `Open Workspace` CTA.
- **Immersive Layered Hero**: Headline *"Every Conversation Has Potential."*, supporting text, action buttons, and an integrated lead intake module inside the hero layer.
- **Product Story (`StorySection.jsx`)**: Asymmetrical editorial chapters detailing secure intake and executive visibility.
- **Horizontal Workflow Journey (`WorkflowJourney.jsx`)**: Visitor → Lead Submitted → Stored Securely → Reviewed → Status Updated → Opportunity Closed.
- **Lead Capture Form**: Fields for Full Name, Email Address, Budget Range (`Below ₹10,000`, `₹10,000 – ₹25,000`, `₹25,000 – ₹50,000`, `Above ₹50,000`), Message, client & server-side validation, toast *"✓ Opportunity captured successfully."*, and auto-reset.
- **Why Businesses Need Better Lead Management**: Strategic rationale blocks.
- **Live Product Preview**: Interactive preview showing Card View vs Table View.
- **Footer**: Mandatory statement `"Built for Digital Heroes Training Task"` linking to [Digital Heroes](https://digitalheroesco.com).

### 💼 Executive Workspace (Task B)
- **JWT & Bcrypt Authentication**: Protected `/admin` route with token validation & auto-expiry redirect.
- **Login Experience (`/login`)**: Remember Me, Forgot Password modal, Show/Hide password toggle, quick credentials fill button.
- **Time-Aware Greeting**: *"Good Morning, LeadDesk Admin."* header with active admin session badge.
- **KPI Metrics**: 4 cards (`Active Opportunities`, `New`, `Contacted`, `Closed`).
- **Instant Search**: Filter opportunities by Name and Email instantly (`/` key shortcut).
- **Profile Cards & Table Views**: Seamless view mode toggle.
- **Slide-Over Detail Drawer**: Full lead details, status selector, GitHub-style activity timeline, and local executive notes.
- **Immediate MySQL Updates**: Dropdown status toggle (`New`, `Contacted`, `Closed`) with status change confirmation dialog.
- **Quick Actions & Export CSV**: Download complete leads dataset as `.csv`.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Axios, React Router v6 |
| **Backend** | Node.js, Express.js (MVC Pattern) |
| **Database** | MySQL (`mysql2` pool with schema auto-init & fallback) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcryptjs`) |

---

## 📡 REST API Reference

### Auth Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate admin & return JWT token |
| `GET` | `/api/auth/me` | Protected | Fetch current logged-in admin profile |
| `POST` | `/api/auth/forgot-password` | Public | Request password recovery email |

### Lead Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leads` | Public | Capture new opportunity brief |
| `GET` | `/api/leads` | Protected | Fetch all leads (newest first) |
| `PUT` | `/api/leads/:id` | Protected | Update lead pipeline status |
| `GET` | `/api/leads/search` | Protected | Search leads by name or email (`?q=...`) |
| `GET` | `/api/leads/stats` | Protected | Aggregated KPI card statistics |

---

## 🗄️ Database Schema

### `leads` Table
```sql
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    budget VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('New', 'Contacted', 'Closed') DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### `admins` Table
```sql
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎥 Loom Video Demonstration Suggested Flow

1. **Landing Page**: Walk through sticky navbar, live Bangalore clock, Satoshi hero headline, and story chapters.
2. **Submit Lead**: Fill out the intake form with Full Name, Email, Budget Range, and Message. Highlight client validation and the success toast *"✓ Opportunity captured successfully."*
3. **Login**: Click *Explore Workspace*, land on `/login`, use quick fill (`admin@leaddesk.com` / `AdminPass123!`), toggle show password, and sign in.
4. **Dashboard & Search**: Inspect Executive Workspace greeting, KPI cards, and use search bar to find the newly created lead.
5. **Update Status**: Click lead to open slide-over drawer, view timeline, and update status from `New` to `Contacted`.
6. **Logout**: Click *Log Out Session* to confirm redirect back to login and route protection.

---

## 🚀 Local Installation Guide

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
# Running at http://localhost:5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Running at http://localhost:3000
```

---

## 🌐 Production Deployment

- **Frontend (Vercel)**: `vercel.json` configured for SPA routing. Set `VITE_API_URL=https://<your-render-backend>.onrender.com/api`.
- **Backend (Render)**: `render.yaml` configured. Set environment variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`.
