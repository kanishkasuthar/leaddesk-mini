# LeadDesk Mini — Sandstone & Espresso Executive Edition 🌾

> **Digital Heroes Internship Qualification Task Submission**  
> Mandatory Attribution: Built for [Digital Heroes](https://digitalheroesco.com)

**LeadDesk Mini** is an editorial lead management platform designed with the **Sandstone & Espresso** design language (`#F4EFE8` background, `#FFFFFF` cards, `#4A3728` espresso accents, and `#CDAA7D` sandstone highlights). Inspired by high-end design aesthetics from Apple, Notion, Aesop, and COS, LeadDesk Mini provides an asymmetric public intake journey alongside a secure executive command center.

---

## 🔐 Test Admin Credentials

Evaluators can access the protected Executive Workspace (`/admin`) using these credentials:

| Field | Production Value |
| :--- | :--- |
| **Login URL** | `/login` (unauthorized access to `/admin` automatically redirects here) |
| **Email** | `admin@leaddesk.com` |
| **Password** | `AdminPass123!` |
| **Quick Fill** | Features a 1-click **"Fill Credentials"** button on `/login` |
| **JWT Expiry** | 24 hours (extended to 7 days when *Remember Me* is checked) |
| **Password Hashing** | Bcrypt (10 salt rounds) |

---

## 🌟 Key Features

### 🏛️ Public Experience (Task A)
- **Glass Sticky Navbar**: Brand logo, navigation anchors, live Bangalore clock updating every second, and `Open Workspace` CTA.
- **Immersive Asymmetric Hero**: Headline *"Every Conversation Has Potential."*, action buttons, and integrated lead intake module inside the hero.
- **Editorial Story Chapters (`StorySection.jsx`)**: Asymmetrical chapters explaining lead capture privacy and executive visibility.
- **Horizontal Workflow Journey (`WorkflowJourney.jsx`)**: Interactive 6-step lead progression timeline.
- **Public Lead Intake Form**: Full Name, Email Address, Budget Range (`Below ₹10,000`, `₹10,000 – ₹25,000`, `₹25,000 – ₹50,000`, `Above ₹50,000`), Message, client & server-side validation, toast *"✓ Opportunity captured successfully."*, and auto-reset.
- **Strategic Rationale (`WhyLeadManagement.jsx`)**: Rationale for structured lead management.
- **Live Product Preview (`ProductPreview.jsx`)**: Interactive preview showcasing Card View vs Table View.
- **Footer**: Mandatory statement `"Built for Digital Heroes Training Task"` linking to [Digital Heroes](https://digitalheroesco.com).

### 💼 Executive Workspace & Authentication (Task B)
- **JWT & Bcrypt Authentication System**: Protected `/admin` route with JWT verification middleware and automatic 401 token expiry handling.
- **Editorial Login Screen (`/login`)**: Welcome Back heading, Show/Hide password toggle, Remember Me checkbox, Forgot Password link & modal, and quick credentials fill button.
- **Forgot & Reset Password Workflow**: Secure 64-character token generation via `crypto.randomBytes(32)`, SHA-256 token hashing, 1-hour expiry, strong password enforcement, and `/reset-password/:token` screen.
- **Persistent Sessions**: Refreshing the browser keeps users logged in; logged-in users visiting `/login` are automatically redirected to `/admin`.
- **Time-Aware Greeting**: Header greeting (*"Good Morning, LeadDesk Admin."*) with active session badge.
- **KPI Summary Cards**: 4 live metric cards (`Total Opportunities`, `New`, `Contacted`, `Closed`).
- **Instant Search & Keyboard Shortcuts**: Filter opportunities by Name or Email (`/` key focus shortcut).
- **Slide-Over Opportunity Drawer**: Detailed lead info, status selector, activity timeline, and local executive notes.
- **CSV Export**: Download complete dataset as `.csv`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 + Vite, Tailwind CSS v4, Framer Motion, Lucide Icons, Axios, React Router v6 |
| **Backend** | Node.js, Express.js (MVC Pattern) |
| **Database** | MySQL (`mysql2` pool with schema auto-initialization & in-memory fallback) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcryptjs`), Node Crypto (`crypto`) |

---

## 📁 Folder Structure

```
leaddesk-mini/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL database connection & fallback engine
│   ├── controllers/
│   │   ├── authController.js     # JWT Login, Register, Forgot & Reset Password
│   │   └── leadController.js     # Lead capture, retrieval, status updates, search
│   ├── middleware/
│   │   ├── asyncHandler.js       # Express async error handler
│   │   ├── authMiddleware.js     # JWT Bearer token verification middleware
│   │   └── validateLead.js       # Input validation & XSS sanitization
│   ├── models/
│   │   ├── adminModel.js         # Admin table queries
│   │   └── leadModel.js          # Lead table queries
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   └── leadRoutes.js         # /api/leads endpoints
│   ├── render.yaml               # Render blueprint configuration
│   ├── schema.sql                # Database schema script
│   └── server.js                 # Express server & CORS configuration
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, Drawers, Modals, Skeleton Loaders
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Public landing experience
│   │   │   ├── AdminPanel.jsx    # Executive workspace dashboard
│   │   │   ├── LoginPage.jsx     # Sandstone & Espresso login page
│   │   │   ├── ForgotPasswordPage.jsx # Password recovery request screen
│   │   │   └── ResetPasswordPage.jsx  # New password setup screen
│   │   ├── services/
│   │   │   └── api.js            # Axios instance, interceptors, and auth/lead services
│   │   ├── App.jsx               # Router & Protected routes configuration
│   │   └── main.jsx              # React DOM entry point
│   ├── vercel.json               # Vercel deployment rewrites
│   └── vite.config.js            # Vite build configuration
└── README.md
```

---

## 📥 Installation Guide

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
# Backend API will start at http://localhost:5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend application will start at http://localhost:3000
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=leaddesk_sandstone_espresso_jwt_secret_key_2026

# MySQL Database Config
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=leaddesk
DB_PORT=3306

FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🗄️ Database Setup

Run `backend/schema.sql` on your MySQL server:

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(255) DEFAULT NULL,
    reset_token_expiry VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 🔐 Authentication Flow

```
[ Visitor / Admin ]
        │
        ▼
   POST /api/auth/login ──▶ [ Verify Email & Bcrypt Password ]
        │
        ├─▶ [ Valid ]   ──▶ Returns Signed JWT Token (24h/7d) ──▶ Saved in LocalStorage/SessionStorage
        │
        └─▶ [ Invalid ] ──▶ Returns 401 Unauthorized Error
        │
        ▼
 [ Subsequent Admin Requests ]
        │
        ▼
 Header: Authorization: Bearer <token> ──▶ [ authMiddleware.js ] ──▶ Access Granted to Protected Endpoints
```

---

## 📡 REST API Reference

### Auth Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate admin & return JWT token |
| `POST` | `/api/auth/register` | Protected | Register a new admin user |
| `GET` | `/api/auth/me` | Protected | Fetch current authenticated admin user profile |
| `POST` | `/api/auth/forgot-password` | Public | Request secure password reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password using reset token |

### Lead Endpoints
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leads` | Public | Capture new lead enquiry |
| `GET` | `/api/leads` | Protected | Retrieve all leads (newest first) |
| `PUT` | `/api/leads/:id` | Protected | Update opportunity status (`New`, `Contacted`, `Closed`) |
| `GET` | `/api/leads/search` | Protected | Instant multi-field search (`?q=...`) |
| `GET` | `/api/leads/stats` | Protected | Aggregate KPI card metrics |

---

## 🌐 Production Deployment Guide

### Frontend Deployment (Vercel)
1. Import repository to Vercel. Set **Root Directory** to `frontend`.
2. Framework Preset: **Vite**. Build Command: `npm run build`. Output Directory: `dist`.
3. Set environment variable `VITE_API_URL=https://<your-render-backend>.onrender.com/api`.

### Backend Deployment (Render)
1. Create a Web Service on Render using `backend/render.yaml` or connected GitHub repo.
2. Build Command: `npm install`. Start Command: `node server.js`.
3. Set environment variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `FRONTEND_URL`.

---

## 🖼️ Interface Previews

- **Landing Hero**: Immersive Sandstone headline with live clock and lead intake card.
- **Login Experience**: Editorial form with show/hide password, remember me, and demo credentials filler.
- **Executive Workspace**: Clean dashboard with KPI metrics, search bar, card/table view toggles, and detail drawer.

---

## 🔮 Future Improvements

- [ ] Multi-tenant organization support.
- [ ] Email notification integration via Resend / SendGrid.
- [ ] Webhook triggers for Zapier and Make.com lead sync.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
