const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

// Register
router.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hashedPassword],
    function (err) {
      if (err) return res.status(400).json({ message: "User already exists" });
      res.json({ message: "User registered successfully" });
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    req.session.user = { id: user.id, email: user.email };
    res.json({ message: "Login successful" });
  });
});

// Logout
router.post("/logout", (req, res) => {
  if (!req.session.user) {
    // If session doesn't exist, just return success
    return res.status(200).json({ message: "Already logged out" });
  }

  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});


// Session check
router.get("/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ user: req.session.user });
});

module.exports = router;
