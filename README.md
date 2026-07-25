# LeadDesk Mini — Executive Edition 🌾

> **Digital Heroes Internship Qualification Task Submission**  
> Mandatory Attribution: Built for [Digital Heroes](https://digitalheroesco.com)

## 📖 Project Overview

**LeadDesk Mini** is a lightweight, responsive SaaS CRM designed specifically for managing inbound leads and pipeline opportunities with speed and elegance. Built upon the **Sandstone & Espresso** design language (`#F4EFE8` background, `#FFFFFF` cards, `#4A3728` espresso accents, and `#CDAA7D` sandstone highlights), it delivers a premium, asymmetric public intake journey alongside a highly secure, functional executive command center. 

This platform seamlessly bridges the gap between client acquisition and executive management, ensuring no opportunity falls through the cracks.

---

## 🌟 Features

### 🏛️ Public Experience
- **Immersive Asymmetric Hero**: Compelling headline, actionable CTA buttons, and a directly integrated lead intake module.
- **Glass Sticky Navbar**: Features a live clock and smooth navigation anchors.
- **Editorial Story Chapters & Workflow Journey**: Interactive timelines and sections explaining the value of lead management.
- **Public Lead Intake Form**: Captures Name, Email, Budget Range, and Message with full client-side and server-side validation.
- **Live Product Preview**: Interactive preview showcasing Card View vs. Table View.

### 💼 Executive Workspace & Administration
- **Secure Authentication System**: Complete JWT & Bcrypt based authentication with Login, Register, Forgot Password, and Reset Password workflows.
- **Admin Registration Module**: Robust registration interface with real-time password complexity indicators.
- **KPI Summary Cards**: Live metric cards displaying `Total Opportunities`, `Active Leads`, `Inactive Leads`, and `Leads Added Today`.
- **Advanced Leads Table**: View leads in Card or Table formats with avatar initials, Created/Updated timestamps, intuitive sorting (by Name or Date), and elevated status badges.
- **Lead Lifecycle Management**: Update pipeline statuses (`New`, `Contacted`, `Closed`) or permanently delete records via a secure confirmation modal.
- **Instant Search**: Filter opportunities globally by Name, Email, or Message.
- **Slide-Over Opportunity Drawer**: Detailed lead info and local executive notes.
- **CSV Data Export**: Download the complete dataset for offline reporting.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 + Vite, Tailwind CSS v4, Framer Motion, Lucide React, React Router v7 |
| **Backend** | Node.js, Express.js (MVC Pattern) |
| **Database** | MySQL 2 (with an auto-fallback In-Memory Engine for zero-config local testing) |
| **Security** | JSON Web Tokens (`jsonwebtoken`), Bcrypt (`bcryptjs`), Node Crypto |

---

## 📁 Folder Structure

```text
leaddesk-mini/
├── backend/
│   ├── config/             # DB connection (MySQL + in-memory fallback)
│   ├── controllers/        # Auth & Lead route handlers
│   ├── middleware/         # JWT Verification, Async Wrappers, Validation
│   ├── models/             # Data access models (Admins, Leads)
│   ├── routes/             # Express API route definitions
│   ├── schema.sql          # MySQL database schema script
│   └── server.js           # Server entry point
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── assets/         # Images and SVG icons
│   │   ├── components/     # Reusable UI components (Navbar, Modals, Forms)
│   │   ├── pages/          # Full page views (AdminPanel, LoginPage, RegisterPage, etc.)
│   │   ├── services/       # Axios API client and centralized endpoints
│   │   ├── App.jsx         # Router & Route protection logic
│   │   ├── index.css       # Global styles and Tailwind configuration
│   │   └── main.jsx        # React application root
│   ├── vite.config.js      # Vite build settings
│   └── package.json        # Frontend dependencies
└── README.md
```

---

## 📸 Screenshots

![Dashboard Preview](frontend/src/assets/hero.png)
*(Note: Visual overview of the public landing experience and executive workspace structure.)*

---

## 📥 Installation Steps

### 1. Backend Setup
```bash
cd backend
npm install
# Start the server (runs on port 5001 by default)
npm start
# For development with auto-reload:
npm run dev
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
# Start the Vite development server (runs on port 3000 or 5173 by default)
npm run dev
```

---

## 🔑 Environment Variables

To run the application properly in production, configure the following `.env` files.

### Backend (`backend/.env`)
```env
PORT=5001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here

# MySQL Database Config (Optional if using the in-memory fallback)
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

## 🔐 Demo Credentials

When the backend starts, it automatically provisions a secure demo account. Evaluators can access the protected Executive Workspace (`/admin`) using these credentials:

- **Email**: `admin@leaddesk.com`
- **Password**: `AdminPass123!`

*Note: You can also create a brand new executive account by visiting the `/register` endpoint on the frontend.*

---

## 📡 API Endpoints

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/login` | Public | Authenticate admin & return JWT token |
| `POST` | `/register` | Public | Register a new admin user |
| `GET`  | `/me` | Protected | Fetch current authenticated admin user profile |
| `POST` | `/forgot-password` | Public | Request secure password reset token |
| `POST` | `/reset-password` | Public | Reset password using the provided token |

### Lead Endpoints (`/api/leads`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Public | Capture a new lead enquiry |
| `GET`  | `/` | Protected | Retrieve all leads (newest first) |
| `PUT`  | `/:id` | Protected | Update lead status (`New`, `Contacted`, `Closed`) |
| `DELETE`| `/:id` | Protected | Permanently delete a lead |
| `GET`  | `/search` | Protected | Instant multi-field search (`?q=...`) |
| `GET`  | `/stats` | Protected | Fetch aggregate KPI card metrics |

---

## 🔄 Authentication Flow

```text
[ Visitor / Admin ]
        │
        ▼
   POST /api/auth/login ──▶ [ Verify Email & Bcrypt Password ]
        │
        ├─▶ [ Valid ]   ──▶ Returns Signed JWT Bearer Token ──▶ Saved in LocalStorage
        │
        └─▶ [ Invalid ] ──▶ Returns 401 Unauthorized Error
        │
        ▼
 [ Subsequent Admin Requests ]
        │
        ▼
 Header: Authorization: Bearer <token> ──▶ [ authMiddleware.js ] ──▶ Access Granted to Protected Routes
```

---

## 🌐 Deployment Instructions

### Frontend (Vercel)
1. Import your GitHub repository to Vercel and set the **Root Directory** to `frontend`.
2. Framework Preset: **Vite**. Build Command: `npm run build`. Output Directory: `dist`.
3. Set the environment variable `VITE_API_URL` to point to your live backend (e.g., `https://api.yourdomain.com/api`).

### Backend (Render / Heroku)
1. Create a Web Service using `backend/render.yaml` or connect your GitHub repository directly.
2. Build Command: `npm install`. Start Command: `npm start`.
3. Set all required environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `FRONTEND_URL`).
4. Ensure your hosting provider permits outbound connections to your managed MySQL database.

---

## 🔮 Future Improvements

- **Multi-tenant Organization Support**: Allow different companies to manage their own isolated leads on a single platform.
- **WebHooks / Zapier Integration**: Instantly trigger automated marketing workflows when a new lead is captured.
- **Email Notifications**: Integrate SendGrid or Resend to alert executives of high-budget lead captures.
- **Dark Mode Aesthetic**: Introduce a sleek "Midnight Espresso" UI toggle for the executive dashboard.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
