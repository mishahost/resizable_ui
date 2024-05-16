const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

// Create MySQL connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Routes
app.post("/api/student", (req, res) => {
  const newData = req.body.name;
  const query = "INSERT INTO student (name) VALUES (?)";
  const countQuery = "UPDATE counts SET counts = counts + 1 WHERE id = 1"; // Assuming count table has id as 1 for simplicity
  pool.query(query, [newData], (error, results) => {
    if (error) {
      console.error("Error adding student:", error);
      res.status(500).json({ success: false, message: "Error adding student", error: error.message });
    } else {
      // Execute countQuery to increment count
      pool.query(countQuery, (countError, countResults) => {
        if (countError) {
          console.error("Error incrementing count:", countError);
          // If count increment fails, you might want to handle it accordingly
        } else {
          res.status(201).json({ success: true, message: "Student added successfully", student: results.insertId });
        }
      });
    }
  });
});

app.put("/api/student/:id", (req, res) => {
  const id = req.params.id;
  const newData = req.body.name;
  const query = "UPDATE student SET name = ? WHERE id = ?";
  const countQuery = "UPDATE counts SET counts = counts + 1 WHERE id = 1"; // Assuming count table has id as 1 for simplicity
  pool.query(query, [newData, id], (error, results) => {
    if (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ success: false, message: "Error updating student", error: error.message });
    } else {
      // Execute countQuery to increment count
      pool.query(countQuery, (countError, countResults) => {
        if (countError) {
          console.error("Error incrementing count:", countError);
          // If count increment fails, you might want to handle it accordingly
        } else {
          res.status(200).json({ success: true, message: "Student updated successfully" });
        }
      });
    }
  });
});

app.get("/api/students", (req, res) => {
  const query = "SELECT * FROM student"; // Assuming your table name is 'student'
  pool.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ success: false, message: "Error fetching students", error: error.message });
    } else {
      res.status(200).json({ success: true, message: "Students fetched successfully", students: results });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
