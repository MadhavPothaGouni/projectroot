// backend/server.js

const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const db = require("./db"); // your SQLite DB setup
const authRoutes = require("./routes/auth");

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // change to true with HTTPS
}));

// Routes
app.use("/api/auth", authRoutes);

// Serve frontend build
app.use(express.static(path.join(__dirname, "build")));

// Support React Router
app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
