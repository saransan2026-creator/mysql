import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";

const app = express();
app.use(express.json());

// MySQL Connection //
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",       
  database: "userdb"
});

db.connect((err) => {
  if (err) {
    console.log("DB connection failed:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// REGISTER //
app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email & Password required" });

  const hashed = await bcrypt.hash(password, 10);

  const sql = "INSERT INTO users (email, password) VALUES (?, ?)";

  db.query(sql, [email, hashed], (err, _result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }
    res.json({ message: "User registered successfully" });
  });
});

// Login //
app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }
  
    const sql = "SELECT * FROM users WHERE email = ?";
  
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "DB Error" });
      }
      const rows = results as any[];
  
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      return res.json({
        message: "Login successful",
        userId: user.id,
        email: user.email
      });
    });
  });
  
app.get("/", (_req, res) => {
    res.send("API running...");
  });
  
  app.listen(5000, () => console.log("Server running on port 5000"));