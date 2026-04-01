# MERN Product Store

## Overview
A full-stack MERN (MongoDB, Express.js, React, Node.js) application for a modern product store. Features include user authentication, product management, feedback, wishlist, and more. The project is split into `backend` (API server) and `frontend` (React client).

---

## Table of Contents
- [Project Structure](#project-structure)
- [Backend](#backend)
  - [Packages](#backend-packages)
  - [Setup](#backend-setup)
- [Frontend](#frontend)
  - [Packages](#frontend-packages)
  - [Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [How to Run](#how-to-run)
- [Future Scope & Improvements](#future-scope--improvements)
- [Contributing](#contributing)

---

## Project Structure
```
MERN-ProductStore/
│   README.md
│   package.json
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── vercel.json
│   ├── db/
│   │   └── connectDB.js
│   ├── middleware/
│   │   └── authUser.js
│   ├── models/
│   │   ├── contact.models.js
│   │   ├── feedback.models.js
│   │   ├── products.models.js
│   │   └── users.models.js
│   ├── routes/
│   │   └── auth.routes.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   ├── common_components/
│   │   ├── sub-components/
│   │   ├── css/
│   │   └── ...
```

---

## Backend
Node.js/Express REST API for authentication, product management, feedback, and more.

### Backend Packages
Main dependencies (see backend/package.json):
- express
- mongoose
- dotenv
- jsonwebtoken
- bcrypt
- cors
- cookie-parser
- multer
- validator
- nodemon (dev)

### Backend Setup
1. `cd backend`
2. Install dependencies:
	```bash
	npm install
	```
3. Create a `.env` file with:
	```env
	MONGO_URI=your_mongodb_uri
	PORT=5000
	ACCESS_TOKEN_SECRET=your_jwt_secret
	FRONTEND_BASEURL=http://localhost:5173
	```
4. Start the server:
	```bash
	npm start
	```

---

## Frontend
React app built with Vite. Handles UI, API calls, and user interactions.

### Frontend Packages
Main dependencies (see frontend/package.json):
- react, react-dom, react-router-dom
- axios
- @chakra-ui/react, @emotion/react
- tailwindcss, @tailwindcss/vite
- react-hot-toast
- react-icons
- validator

### Frontend Setup
1. `cd frontend`
2. Install dependencies:
	```bash
	npm install
	```
3. Create a `.env` file for API base URL:
	```env
	VITE_REACT_APP_BACKEND_BASEURL=http://localhost:5000
	```
4. Start the app:
	```bash
	npm run dev
	```

---

## Environment Variables
- **Backend**: `.env` with `MONGO_URI`, `PORT`, `ACCESS_TOKEN_SECRET`, `FRONTEND_BASEURL`
- **Frontend**: `.env` with `VITE_REACT_APP_BACKEND_BASEURL`

---

## How to Run
1. Clone the repository.
2. Set up backend and frontend as described above.
3. Make sure MongoDB is running and accessible.
4. Access the frontend at `http://localhost:5173` (default Vite port).

---

## Future Scope & Improvements
- Product reviews and ratings
- Admin dashboard
- Payment gateway integration
- UI/UX and accessibility improvements
- Unit and integration tests
- CI/CD deployment pipelines
- Internationalization (i18n)

---

## Contributing
1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License
MIT
npm start

📂 Folder Structure
product-store/
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   └── App.js
└── package.json

🌐 Usage
Start the app using npm start
Open browser at http://localhost:3000
Browse products and manage your cart

📌 Future Improvements
User authentication
Payment gateway integration
Admin dashboard for product management
👨‍💻 Author

Praveen Balaji
