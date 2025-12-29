import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb",
});

db.connect((err) => {
  if (err) {
    console.log(" DB Connection Failed:", err.message);
    return;
  }
  console.log(" MySQL Connected Successfully");
});
