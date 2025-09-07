const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./users.db", (err) => {
  if (err) console.error("❌ DB Error:", err);
  else {
    console.log("✅ Connected to SQLite DB");

    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
      )`,
      () => {
        // Default user
        const hashedPassword = bcrypt.hashSync("YOUR_PASSWORD_HERE", 10);
        db.run(
          `INSERT OR IGNORE INTO users (email, password) VALUES (?, ?)`,
          ["YOUR_EMAIL_HERE", hashedPassword],
          () => console.log("✅ Default user ensured")
        );
      }
    );
  }
});

module.exports = db;
