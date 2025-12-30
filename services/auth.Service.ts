export const Queries = {
    CHECK_EMAIL: "SELECT email FROM users WHERE email = ?",
  
    INSERT_USER: "INSERT INTO users (email, password) VALUES (?, ?)",
  
    FIND_USER: "SELECT * FROM users WHERE email = ?",
  };
  