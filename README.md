
<div align="center">
  <h1>MERN Product Store</h1>
  <p><b>A modern, full-stack e-commerce app built with MongoDB, Express, React, and Node.js</b></p>
  <p>
	 <img src="https://img.shields.io/badge/stack-MERN-green" alt="MERN Stack" />
	 <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
  </p>
</div>


## ✨ Features
- User authentication & profile management
- Browse, view, and manage products
- Wishlist, feedback, and contact forms
- Responsive, modern UI (React + Tailwind + Chakra UI)
- RESTful API (Express + MongoDB)

---

## 🗂️ Project Structure
```
MERN-ProductStore/
│   README.md
│   package.json
├── backend/
│   ├── server.js
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   ├── db/               # DB connection
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/   # Main React components
│   │   ├── common_components/
│   │   ├── sub-components/
│   │   ├── css/          # Stylesheets
│   │   └── ...
│   └── ...
```

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/PraveenBalajiP/MERN-ProductStore.git
cd MERN-ProductStore
```

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env (see below)

```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create .env (see below)
📂 Folder Structure
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
MONGO_URI=your_mongodb_uri
PORT=5000
ACCESS_TOKEN_SECRET=your_jwt_secret
FRONTEND_BASEURL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_REACT_APP_BACKEND_BASEURL=http://localhost:5000
```

---

## 📦 Main Packages

### Backend
- express, mongoose, dotenv, jsonwebtoken, bcrypt, cors, cookie-parser, multer, validator

### Frontend
- react, react-dom, react-router-dom, axios, @chakra-ui/react, @emotion/react, tailwindcss, react-hot-toast, react-icons, validator

---

## 📝 Future Scope
- Product reviews & ratings
- Admin dashboard
- Payment gateway integration
- Enhanced UI/UX & accessibility
- Unit/integration tests
- CI/CD deployment
- Internationalization (i18n)

---

## 🤝 Contributing
1. Fork this repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push to your fork: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License
MIT
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
