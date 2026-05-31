# Mech-ONE 2026 | International Engineering Hub

Mech-ONE 2026 (**Mechanical Engineering Competition - Open National and International Event**) is a web platform designed to facilitate registration, proposal submission, and administration for the annual international engineering competition hosted by **Himpunan Mahasiswa Mesin (HMM) Universitas Diponegoro**.

The platform is designed with a premium, futuristic dark-themed aesthetic, utilizing modern responsive layouts to optimize user experience across all devices.

---

## 🌌 Grand Theme
> **"Advancing Renewable Energy Technologies for a Sustainable and Resilient Future"**

---

## 🛠️ Technology Stack

The project is structured as a decoupled architecture containing independent Frontend and Backend systems:

### Frontend
- **Structure & Layout:** HTML5 (Semantic elements)
- **Styling:** [Tailwind CSS (via CDN)](https://tailwindcss.com) & Custom Vanilla CSS (for glassmorphic designs, custom scrolls, and glowing animations)
- **Icons:** [Font Awesome 6.0](https://fontawesome.com)
- **Logic:** Vanilla JavaScript (Fetch API integration, State persistence via LocalStorage, dynamic DOM manipulation)

### Backend
- **Runtime:** Node.js (ES Modules syntax)
- **Framework:** Express.js (v5.x)
- **Database & Storage:** [Supabase](https://supabase.com) (PostgreSQL Database, Auth integration, Bucket Storage for files)
- **Authentication:** JSON Web Tokens (JWT) & BcryptJS for password encryption
- **File Upload:** Multer (multipart form-data handling)
- **WebSockets:** WS library (for real-time server-client updates)

---

## ✨ Features

- 👤 **User Authentication:** Robust registration and login workflow secured with JWT and password hashing.
- 🏆 **Competition Hub:** Easy registration for three distinct events:
  - **MDC** (Mechanical Design Competition)
  - **BPC** (Business Plan Competition)
  - **SEM** (Seminar Nasional)
- 📄 **Proposal Submission:** Direct file upload integration to Supabase bucket storage for team proposals, allowing updates up to the deadline.
- ⚙️ **Profile Management:** Dashboard for participants to edit profiles and view real-time registration status (Approved, Rejected, or Processing).
- 🧭 **Guidebook Redirection:** Direct access to rules and documentation stored securely in Google Drive.

---

## 📁 Repository Structure

```tree
Mech-One_2026/
├── Frontend/                 # Client-side files
│   ├── assets/               # Images and branding logos
│   ├── css/                  # Styling files (index.css, profile.css, etc.)
│   ├── js/                   # JS Logic (api.js, popup.js, etc.)
│   ├── index.html            # Main Landing page
│   ├── login.html            # Login page
│   ├── register.html         # User Registration page
│   ├── profile.html          # Participant Dashboard page
│   ├── register-competition.html # Competition selection & details
│   └── submit-proposal.html  # File submission page
│
├── Backend/                  # Server-side API
│   ├── src/
│   │   ├── config/           # Database & cloud storage configurations
│   │   ├── controllers/      # Route logic handlers
│   │   ├── middleware/       # Authentication guards
│   │   ├── routes/           # API endpoints routing
│   │   └── index.js          # API main entrypoint
│   ├── .env.example          # Environment variables template
│   ├── vercel.json           # Server configuration for Vercel deployment
│   └── package.json          # Node dependencies and execution scripts
└── README.md                 # Project documentation
```

---

## 🚀 Local Setup & Installation

Follow these steps to run the application locally on your system.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18+ recommended) and Git installed.

### 1. Clone the Repository
```bash
git clone https://github.com/lanjarset1awan/Mech-One_2026.git
cd Mech-One_2026
```

### 2. Configure Backend
Navigate to the `Backend` directory, install packages, and set up your environment configuration.
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory based on the variables template below:
```env
PORT=5005
SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
JWT_SECRET=YOUR_JWT_SIGNING_SECRET
```

### 3. Initialize Supabase Database
In your Supabase project, make sure to:
1. Create a `profiles` table to store participant profiles.
2. Create a `competitions` table to store MDC, BPC, and SEM registrations.
3. Configure Storage Buckets for avatar uploads and proposal uploads, ensuring read/write access policies (RLS) are set up.

### 4. Run the Backend API Server
Start the development server with live reload enabled (using nodemon):
```bash
npm run dev
```
The server will boot up and listen on `http://localhost:5005`.

### 5. Launch the Frontend
The frontend connects automatically to `http://localhost:5005` when running locally (from `localhost` or `127.0.0.1`).
Simply open `Frontend/index.html` in your web browser, or use a local static server like Live Server in VS Code.

---

## ☁️ Deployment

### Backend (Vercel)
The backend is ready to be deployed to **Vercel** out-of-the-box. The routing is preconfigured in `Backend/vercel.json`.
1. Install Vercel CLI or link your repository to the Vercel dashboard.
2. Ensure you add the `.env` variables to Vercel's Environment Variables settings.
3. Deploy the `Backend` folder.

### Frontend
Since the frontend is built with pure static files (HTML, CSS, JS), it can be deployed on any static hosting provider such as:
- GitHub Pages
- Netlify
- Vercel (as a static project)
- Vercel/Github Integration

*Note: In `Frontend/js/api.js`, the code automatically switches `BASE_URL` to `https://mech-one-2026.vercel.app` when deployed in production. Update this URL to match your deployed backend endpoint.*

---

## 📜 Credits & License
Developed for **Mech-ONE 2026 Committee** by **Mechanical Engineering Department, Universitas Diponegoro**.

All rights reserved © 2026.
