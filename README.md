# My Portfolio — John Kris Gellado

Full-stack portfolio website built with Django REST Framework 
and React/TypeScript.

## 🔗 Live
- Portfolio: https://jkris-dev.vercel.app
- API: https://my-portfolio-production-f5b6.up.railway.app/api/

## 🛠 Tech Stack
**Backend:** Django 6, DRF, PostgreSQL, JWT, Cloudinary, Railway
**Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, Vercel

## 📦 Features
- Dynamic content management via custom admin panel
- JWT authentication with token refresh
- Cloudinary image storage
- Projects, Certificates, Gallery, Blog management
- Contact form with email notifications

## 🚀 Running Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 👤 Author
John Kris Gellado — [jkris-dev.vercel.app](https://jkris-dev.vercel.app)