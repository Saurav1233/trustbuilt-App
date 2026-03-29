# Trust Built PR & Digital Solutions — Full Stack Web App

A premium PR & Digital Marketing agency website built with **React + Django REST Framework**.

---

## 🏗️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v3, Framer Motion, Axios |
| Backend | Django 5, Django REST Framework, SimpleJWT |
| Database | SQLite (dev) / PostgreSQL (production) |
| Auth | JWT (access + refresh tokens) |

---

## 📁 Folder Structure

```
trustbuilt/
├── trustbuilt_backend/          # Django backend
│   ├── api/
│   │   ├── models.py            # User, Service, Testimonial, Contact
│   │   ├── serializers.py       # DRF serializers
│   │   ├── views.py             # API views
│   │   ├── urls.py              # API routes
│   │   └── admin.py             # Admin panel config
│   ├── trustbuilt_backend/
│   │   ├── settings.py          # JWT, CORS, DB config
│   │   └── urls.py              # Root URL conf
│   ├── requirements.txt
│   └── db.sqlite3               # Dev database (auto-created)
│
└── trustbuilt_frontend/         # React frontend
    ├── src/
    │   ├── api/
    │   │   ├── axios.js         # Axios instance + interceptors
    │   │   └── auth.js          # API call functions
    │   ├── components/
    │   │   ├── Navbar.jsx       # Dynamic navbar (auth-aware)
    │   │   ├── Footer.jsx
    │   │   ├── WhatsAppButton.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state
    │   └── pages/
    │       ├── Home.jsx         # Landing page
    │       ├── Login.jsx        # JWT login
    │       ├── Register.jsx     # User registration
    │       ├── Dashboard.jsx    # Protected user dashboard
    │       ├── Services.jsx     # Services listing
    │       └── Contact.jsx      # Contact form
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Backend Setup

```bash
# 1. Navigate to backend
cd trustbuilt_backend

# 2. Create & activate virtual environment
python -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\activate           # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py makemigrations
python manage.py migrate

# 5. Seed initial data (services + testimonials)
python manage.py shell
>>> exec(open('seed.py').read())  # or run the shell commands from the README

# 6. Create superuser (admin)
python manage.py createsuperuser
# OR use the pre-created one:
#   Email: admin@trustbuilt.in
#   Password: Admin@123456

# 7. Run backend server
python manage.py runserver
# API available at: http://localhost:8000/api/
# Admin panel at:   http://localhost:8000/admin/
```

---

## ⚛️ Frontend Setup

```bash
# 1. Navigate to frontend
cd trustbuilt_frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# App available at: http://localhost:5173

# 4. Build for production
npm run build
```

---

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register/` | Public | User registration |
| POST | `/api/login/` | Public | JWT login |
| POST | `/api/token/refresh/` | Public | Refresh access token |
| GET | `/api/profile/` | 🔒 JWT | Get user profile |
| GET | `/api/dashboard/` | 🔒 JWT | Dashboard data |
| GET | `/api/services/` | Public | List all services |
| GET | `/api/testimonials/` | Public | List testimonials |
| POST | `/api/contact/` | Public | Submit contact form |

---

## 🔑 Default Credentials

- **Admin Panel**: `admin@trustbuilt.in` / `Admin@123456`
- **Admin URL**: http://localhost:8000/admin/

---

## 🌐 PostgreSQL Setup (Production)

```python
# In settings.py, replace DATABASES with:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'trustbuilt_db',
        'USER': 'trustbuilt_user',
        'PASSWORD': 'your_secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE trustbuilt_db;
CREATE USER trustbuilt_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE trustbuilt_db TO trustbuilt_user;
\q
```

---

## ✨ Features

- 🔐 **JWT Authentication** — secure login, register, auto token refresh
- 🛡️ **Protected Routes** — dashboard only accessible when logged in
- 📊 **Django Admin** — manage services, testimonials, contacts, users
- 🎨 **Premium Dark UI** — black + gold theme, Framer Motion animations
- 📱 **Fully Responsive** — mobile-first design
- 💬 **WhatsApp Button** — floating contact shortcut
- ✅ **Form Validation** — client + server side
- 🔄 **Auto Token Refresh** — seamless session management
