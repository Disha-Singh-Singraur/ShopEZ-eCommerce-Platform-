# MERN eCommerce Platform

A full-stack **eCommerce web application** built using the **MERN stack (MongoDB, Express.js, React, Node.js)**.

The platform allows users to browse products, add items to a shopping cart, and place orders, simulating a real-world online shopping experience.

This project demonstrates full-stack development, REST API design, authentication, and responsive frontend development.

---

## Features

- Product browsing and product listing
- Add to cart and update cart items
- Place and manage orders
- JWT-based authentication
- Responsive UI using modern frontend tools
- RESTful backend API
- Full MERN stack architecture
- Admin dashboard for product management

---

## Tech Stack

### Frontend
- React.js
- Bootstrap
- JavaScript
- Vite

### Backend
- Node.js
- Express.js
- JWT Authentication

### Database
- MongoDB
- Mongoose

---

## Project Structure

```
project-root
│
├── Client      # React frontend
│
├── Server        # Node.js + Express backend
│
└── README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/repository-name.git
cd repository-name
```

---

### 2. Setup Backend

```bash
cd Server
npm install
```

Create a `.env` file inside the **backend** folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run the backend server:

```bash
node server.js
```

---

### 3. Setup Frontend

Open another terminal:

```bash
cd Client
npm install
npm run dev
```

The application will run at:

```
http://localhost:5173
```

---

## Team Members

- Anishka Uikey
- Disha Singh Singraur
- Devendra Singh
- Ankit Tiwary

---

## License

This project was developed as part of an academic team project to demonstrate full-stack development using the MERN stack.
