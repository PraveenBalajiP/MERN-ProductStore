# MERN Product Store — Complete Project Guide

## Table of Contents
1. Introduction
2. Features
3. Technology Stack
4. Project Structure
5. Backend Overview
6. Frontend Overview
7. Environment Variables
8. Installation & Setup
9. Usage Guide
10. API Endpoints Overview
11. Deployment
12. Future Scope & Improvements
13. Contribution Guide
14. FAQ
15. Credits & License

---

## 1. Introduction
MERN Product Store is a full-stack e-commerce web application built using MongoDB, Express.js, React, and Node.js. It provides a modern, scalable platform for users to browse products, manage their profiles, interact with a wishlist, and submit feedback. The project is split into a RESTful backend and a responsive frontend.

---

## 2. Features
- User authentication (JWT, cookies)
- Profile management (edit, password change)
- Product catalog: browse, search, view details
- Wishlist management
- Feedback and contact forms
- Responsive UI (desktop/mobile)
- Toast notifications, tooltips, and dialogs
- Admin-ready backend structure
- Secure API endpoints

---

## 3. Technology Stack
- **Frontend:** React 19, Vite, Chakra UI, Tailwind CSS, Axios, React Router DOM, React Hot Toast, React Icons
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, dotenv, multer, validator, cookie-parser, cors
- **Dev Tools:** ESLint, Vercel, Git

---

## 4. Project Structure
```
MERN-ProductStore/
│   README.md
│   package.json
├── backend/
│   ├── server.js
│   ├── db/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── assets/
│   │   ├── components/
│   │   ├── common_components/
│   │   ├── sub-components/
│   │   ├── css/
│   │   ├── content/
│   │   └── ...
│   └── ...
```

#### Frontend Detailed Structure
```
product-store/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.js
└── package.json
```

---

## 5. Backend Overview
- Built with Express.js and MongoDB (Mongoose ODM)
- Handles authentication, user management, product CRUD, wishlist, feedback, and contact forms
- Organized into models, routes, middleware, and DB connection modules
- Uses JWT for authentication and cookies for session management
- Environment variables for sensitive data (see below)

### Main Backend Packages
- express, mongoose, dotenv, jsonwebtoken, bcrypt, cors, cookie-parser, multer, validator

---

## 6. Frontend Overview
- Built with React 19 and Vite for fast development
- Uses Chakra UI and Tailwind CSS for styling
- Organized into components, common_components, sub-components, and CSS modules
- Handles routing with React Router DOM
- Communicates with backend via Axios
- Provides a modern, responsive user experience

### Main Frontend Packages
- react, react-dom, react-router-dom, axios, @chakra-ui/react, @emotion/react, tailwindcss, react-hot-toast, react-icons, validator

---

## 7. Environment Variables
### Backend (`backend/.env`)
```
MONGO_URI=your_mongodb_uri
PORT=5000
ACCESS_TOKEN_SECRET=your_jwt_secret
FRONTEND_BASEURL=http://localhost:5173
```
### Frontend (`frontend/.env`)
```
VITE_REACT_APP_BACKEND_BASEURL=http://localhost:5000
```

---

## 8. Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/PraveenBalajiP/MERN-ProductStore.git
   cd MERN-ProductStore
   ```
2. Backend setup:
   ```bash
   cd backend
   npm install
   # Create .env as above
   npm start
   ```
3. Frontend setup:
   ```bash
   cd frontend
   npm install
   # Create .env as above
   npm run dev
   ```

---

## 9. Usage Guide
- Start backend and frontend as above
- Open your browser at [http://localhost:5173](http://localhost:5173)
- Register or log in, browse products, manage your profile, wishlist, and more

---

## 10. API Endpoints Overview
**Base URL:** `http://localhost:5000/api/`

**Auth:**
- `POST /auth/signup` — Register new user
- `POST /auth/login` — Login user
- `POST /auth/logout` — Logout user

**Products:**
- `GET /products` — List all products
- `GET /products/:id` — Get product details
- `POST /products` — Add product (admin)
- `PUT /products/:id` — Edit product (admin)
- `DELETE /products/:id` — Delete product (admin)

**Users:**
- `GET /users/profile` — Get user profile
- `PUT /users/profile` — Update profile
- `PUT /users/password` — Change password

**Wishlist:**
- `GET /wishlist` — Get wishlist
- `POST /wishlist` — Add to wishlist
- `DELETE /wishlist/:id` — Remove from wishlist

**Feedback/Contact:**
- `POST /feedback` — Submit feedback
- `POST /contact` — Contact form

> See `backend/routes/` for more endpoints and details.

---

## 11. Deployment
- Ready for deployment on Vercel or similar platforms
- See `backend/vercel.json` and `frontend/vercel.json` for configuration

---

## 12. Future Scope & Improvements
- Product reviews & ratings
- Admin dashboard
- Payment gateway integration
- Enhanced UI/UX & accessibility
- Unit/integration tests
- CI/CD deployment
- Internationalization (i18n)

---

## 13. Contribution Guide
1. Fork this repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 14. FAQ
**Q: Can I use a different database?**
A: Yes, but you must update the backend models and connection logic.

**Q: How do I add new features?**
A: Fork, branch, and submit a PR. See [Contribution Guide](#contribution-guide).

**Q: Is this production-ready?**
A: The structure is production-ready, but you should add more tests and security for production.

---

## 15. Credits & License
- [Praveen Balaji](https://github.com/PraveenBalajiP) — Creator & Maintainer
- [MERN Stack Community](https://www.mongodb.com/mern-stack)

**License:** MIT
