const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the CORS package
const crypto = require("crypto");

const app = express();
const port = 5000;

// Use CORS middleware
app.use(cors());
app.use(cors({ origin: "http://localhost:5173" })); // Allow requests from frontend port

app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // your MySQL user
  password: "", // your MySQL password
  database: "backend_ojt",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check administrator
  db.query(
    "SELECT * FROM administrator WHERE admin_user = ? AND admin_password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (results.length > 0) {
        const admin = results[0];
        return res.status(200).json({
          message: "Administrator logged in",
          role: "admin",
          user: { admin_id: admin.admin_id, ...admin },
        });
      }

      // Check coordinator
      db.query(
        "SELECT * FROM coordinator WHERE coordinator_user = ? AND coordinator_pass = ?",
        [username, password],
        (err, results) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }
          if (results.length > 0) {
            const coordinator = results[0];
            return res.status(200).json({
              message: "Coordinator logged in",
              role: "coordinator",
              user: {
                coordinator_id: coordinator.coordinator_id,
                ...coordinator,
              },
            });
          }

          // Check student
          db.query(
            "SELECT * FROM student WHERE student_schoolid = ? AND student_password = ?",
            [username, password],
            (err, results) => {
              if (err) {
                return res
                  .status(500)
                  .json({ message: "Database error", error: err });
              }
              if (results.length > 0) {
                const student = results[0];
                return res.status(200).json({
                  message: "Student logged in",
                  role: "student",
                  user: { student_id: student.student_id, ...student },
                });
              }

              // If no user found
              return res
                .status(401)
                .json({ message: "Invalid username or password" });
            }
          );
        }
      );
    }
  );
});

//admin side
// Get programs (with program_id and program_name)
app.get("/api/programname", (req, res) => {
  const query = `SELECT program_id, program_name FROM program`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching programs:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});
// to add a coordinator
app.post("/api/add-coordinator", (req, res) => {
  const {
    admin_id,
    coordinator_firstname,
    coordinator_lastname,
    coordinator_contact,
    program_id,
    coordinator_email,
    coordinator_user,
    coordinator_pass,
  } = req.body;

  // Validate input
  if (
    !admin_id ||
    !coordinator_firstname ||
    !coordinator_lastname ||
    !coordinator_contact ||
    !program_id ||
    !coordinator_email ||
    !coordinator_user ||
    !coordinator_pass
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Hash password (for security)
  const hashedPassword = coordinator_pass; // Replace this with bcrypt hashing in production

  const query = `INSERT INTO coordinator (admin_id, coordinator_firstname, coordinator_lastname, coordinator_contact, program_id, coordinator_email, coordinator_user, coordinator_pass) VALUES (?, ?, ?,?,?, ?, ?, ?)`;

  db.query(
    query,
    [
      admin_id,
      coordinator_firstname,
      coordinator_lastname,
      coordinator_contact,
      program_id,
      coordinator_email,
      coordinator_user,
      hashedPassword,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      return res.status(201).json({
        message: "Coordinator added successfully",
        coordinator_id: results.insertId,
      });
    }
  );
});
//fetching coordinator
app.get("/api/coordinators", (req, res) => {
  const searchQuery = req.query.search || "";
  const query = `
    SELECT 
      c.coordinator_id, 
      c.coordinator_firstname, 
      c.coordinator_lastname, 
      c.coordinator_contact, 
      c.coordinator_email,
      c.coordinator_user, 
      c.coordinator_pass, 
      p.program_name
    FROM 
      coordinator c
    JOIN 
      program p ON c.program_id = p.program_id
    WHERE 
      c.coordinator_firstname LIKE ? 
      OR c.coordinator_lastname LIKE ? 
      OR c.coordinator_email LIKE ?;
  `;

  db.query(
    query,
    [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      return res.status(200).json(results);
    }
  );
});
// Update a coordinator
app.put("/api/update-coordinator/:id", (req, res) => {
  const id = req.params.id;
  const {
    coordinator_firstname,
    coordinator_lastname,
    coordinator_contact,
    program_id,
    coordinator_email,
    coordinator_user,
    coordinator_pass,
  } = req.body;

  const query = `
    UPDATE coordinator 
    SET coordinator_firstname = ?, 
        coordinator_lastname = ?, 
        coordinator_contact = ?, 
        program_id = ?, 
        coordinator_email = ?, 
        coordinator_user = ?, 
        coordinator_pass = ? 
    WHERE coordinator_id = ?`;

  db.query(
    query,
    [
      coordinator_firstname,
      coordinator_lastname,
      coordinator_contact,
      program_id,
      coordinator_email,
      coordinator_user,
      coordinator_pass,
      id,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.status(200).json({ message: "Coordinator updated successfully" });
    }
  );
});

//fetching Student
app.get("/api/studentsall", (req, res) => {
  const query = `
    SELECT 
      s.student_schoolid,
      CONCAT(cor.coordinator_firstname, ' ', cor.coordinator_lastname) AS coordinator_name,
      p.program_name,
      com.company_name,
      p.program_hours
    FROM student s
    LEFT JOIN company com ON s.company_id = com.company_id
    LEFT JOIN coordinator cor ON s.coordinator_id = cor.coordinator_id
    LEFT JOIN program p ON cor.program_id = p.program_id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});

//add program
app.post("/api/add-program", (req, res) => {
  const { admin_id, program_name, program_description, program_hours } =
    req.body;

  // Debugging: log received data
  console.log("Received data:", req.body);

  if (!admin_id || !program_name || !program_description || !program_hours) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `
    INSERT INTO program (admin_id, program_name, program_description, program_hours)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [admin_id, program_name, program_description, program_hours],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Log result for debugging
      console.log("Program added successfully:", result);

      res.status(201).json({
        message: "Program added successfully",
        program_id: result.insertId,
      });
    }
  );
});
// GET route to fetch all programs
app.get("/api/programs", (req, res) => {
  const query = `SELECT program_id, program_name, program_description, program_hours FROM program`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching programs:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json(results);
  });
});
// POST route to add a school year
app.post("/api/add-schoolyear", (req, res) => {
  const { admin_id, school_yr } = req.body;

  // Validate input
  if (!admin_id || !school_yr) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const query = `INSERT INTO school_year (admin_id, school_yr) VALUES (?, ?)`;

  db.query(query, [admin_id, school_yr], (err, result) => {
    if (err) {
      console.error("Error inserting school year:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(201).json({
      message: "School year added successfully",
      year_id: result.insertId,
    });
  });
});

//dashboard
// Count unique coordinators by coordinator_id
app.get("/api/count-coordinators", (req, res) => {
  const query =
    "SELECT COUNT(DISTINCT coordinator_id) AS count FROM coordinator";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    // Log result for debugging
    console.log("Unique Coordinators Count:", results[0].count);
    return res.status(200).json({ count: results[0].count }); // Send the count of unique coordinators
  });
});
// GET route to count the number of unique programs
app.get("/api/count-programs", (req, res) => {
  const query = `SELECT COUNT(DISTINCT program_id) AS count FROM program`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error counting programs:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ count: results[0].count });
  });
});
// Route to get total count of companies
app.get("/countall-companies", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM company";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching total companies:", err);
      return res.status(500).json({ error: "Failed to fetch total companies" });
    }
    res.json({ count: results[0].count });
  });
});
// Route to get total count of students
app.get("/countall-students", (req, res) => {
  const query = "SELECT COUNT(*) AS count FROM student";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching total students:", err);
      return res.status(500).json({ error: "Failed to fetch total students" });
    }
    res.json({ count: results[0].count });
  });
});
//recent
app.get("/api/recent-coordinators", (req, res) => {
  const query = `
    SELECT 
      c.coordinator_id AS id,
      CONCAT(c.coordinator_firstname, ' ', c.coordinator_lastname) AS name,
      p.program_name AS programName
    FROM 
      coordinator c
    JOIN 
      program p ON c.program_id = p.program_id
    ORDER BY 
      c.coordinator_id DESC
    LIMIT 5;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    return res.status(200).json({ recentCoordinators: results });
  });
});

//Coordinator Side****************************************************************
// Coordinator Side: Add Company
app.post("/api/add-company", (req, res) => {
  const {
    coordinator_id,
    company_name,
    company_address,
    company_mentor,
    company_contact,
    company_qr, // Expect QR code from the frontend
  } = req.body;

  // Validate input, including company_qr
  if (
    !coordinator_id ||
    !company_name ||
    !company_address ||
    !company_mentor ||
    !company_contact ||
    !company_qr
  ) {
    return res
      .status(400)
      .json({ message: "All fields, including QR code, are required." });
  }

  const query = `
    INSERT INTO company (coordinator_id, company_name, company_address, company_mentor, company_contact, company_qr)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      coordinator_id,
      company_name,
      company_address,
      company_mentor,
      company_contact,
      company_qr,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting company:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({
        message: "Company added successfully",
        company_id: result.insertId,
        company_qr,
      });
    }
  );
});
// Add a route to filter companies by coordinator_id
app.get("/api/companiesni", (req, res) => {
  const { coordinator_id } = req.query; // Get coordinator_id from the request query

  // Modified query to filter by coordinator_id if provided
  const query =
    "SELECT company_id, coordinator_id, company_name, company_address, company_mentor, company_contact, company_qr FROM company WHERE coordinator_id = ?";

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error fetching companies:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json(results);
  });
});
//attendance
app.get("/api/timesheet", (req, res) => {
  const { coordinator_id } = req.query;

  if (!coordinator_id) {
    return res.status(400).json({ message: "Coordinator ID is required" });
  }

  const query = `
    SELECT 
      t.time_id, 
      t.student_id, 
      s.student_name, 
      c.company_name, 
      t.date, 
      t.am_in, 
      t.am_out, 
      t.pm_in, 
      t.pm_out, 
      t.location
    FROM 
      timesheet t
    INNER JOIN 
      student s ON t.student_id = s.student_id
    INNER JOIN 
      company c ON t.company_id = c.company_id
    WHERE 
      c.coordinator_id = ?`;

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error fetching timesheet data:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json(results);
  });
});
// Get companies added by the specific coordinator
app.get("/api/companynameni", (req, res) => {
  const coordinator_id = req.query.coordinator_id;
  const query = `SELECT company_id, company_name FROM company WHERE coordinator_id = ?`;

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error fetching companies:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});
//add studenty
app.post("/api/add-student", (req, res) => {
  const {
    coordinator_id,
    student_name,
    student_address,
    student_contact,
    student_sex,
    company_id,
    student_status,
    student_email,
    student_schoolid,
    student_password,
  } = req.body;

  if (
    !coordinator_id ||
    !student_name ||
    !student_address ||
    !student_contact ||
    !student_sex ||
    !company_id ||
    !student_status ||
    !student_email ||
    !student_schoolid ||
    !student_password
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Query to get the most recent school year
  const yearQuery = `SELECT year_id FROM school_year ORDER BY year_id DESC LIMIT 1`;

  db.query(yearQuery, (err, yearResult) => {
    if (err) {
      console.error("Error fetching school year:", err);
      return res
        .status(500)
        .json({ message: "Database error fetching school year", error: err });
    }

    const year_id = yearResult.length > 0 ? yearResult[0].year_id : null;

    if (!year_id) {
      return res.status(400).json({ message: "No school year available." });
    }

    const query = `
      INSERT INTO student (coordinator_id, student_name, student_address, student_contact, student_sex, company_id, year_id, student_status, student_email, student_schoolid, student_password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [
        coordinator_id,
        student_name,
        student_address,
        student_contact,
        student_sex,
        company_id,
        year_id,
        student_status,
        student_email,
        student_schoolid,
        student_password,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting student:", err);
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }
        res.status(201).json({
          message: "Student added successfully",
          student_id: result.insertId,
        });
      }
    );
  });
});
// Fetch students managed by the specific coordinator
app.get("/api/studentsni", (req, res) => {
  const coordinator_id = req.query.coordinator_id;
  const query = `
    SELECT s.student_id, s.coordinator_id, s.student_name, s.student_address, s.student_contact,
           s.student_sex, s.student_status, s.student_email, s.student_schoolid,
           c.company_name, c.company_mentor 
    FROM student s
    LEFT JOIN company c ON s.company_id = c.company_id
    WHERE s.coordinator_id = ?
  `;

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(200).json(results);
  });
});
// POST: Create a new announcement
app.post("/api/announcements", (req, res) => {
  const { coordinator_id, announcement_type, announcement_content } = req.body;
  const query = `INSERT INTO announce (coordinator_id, announcement_type, announcement_content) VALUES (?, ?, ?)`;
  db.query(
    query,
    [coordinator_id, announcement_type, announcement_content],
    (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to create announcement." });
      res.status(201).json({
        message: "Announcement created successfully.",
        announce_id: results.insertId,
      });
    }
  );
});
// GET: Fetch all announcements
app.get("/api/announcementsni", (req, res) => {
  const coordinator_id = req.query.coordinator_id; // Get coordinator_id from query parameters
  const query = `
    SELECT announce_id, coordinator_id, announcement_type, announcement_content 
    FROM announce 
    WHERE coordinator_id = ?`;

  db.query(query, [coordinator_id], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Failed to fetch announcements." });
    res.status(200).json(results);
  });
});

//*******coordinator dashboard**** */
// API to count distinct companies for a given coordinator
app.get("/api/count-companies", (req, res) => {
  const { coordinator_id } = req.query;

  if (!coordinator_id) {
    return res.status(400).json({ message: "Coordinator ID is required" });
  }

  const query = `
    SELECT COUNT(DISTINCT company_id) AS companyCount
    FROM company
    WHERE coordinator_id = ?
  `;

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error counting companies:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ count: results[0].companyCount });
  });
});

// API to count distinct students for a given coordinator
app.get("/api/count-students", (req, res) => {
  const { coordinator_id } = req.query;

  if (!coordinator_id) {
    return res.status(400).json({ message: "Coordinator ID is required" });
  }

  const query = `
    SELECT COUNT(DISTINCT student_id) AS studentCount
    FROM student
    WHERE coordinator_id = ?
  `;

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error counting students:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ count: results[0].studentCount });
  });
});

// API to get coordinator's full name
app.get("/api/coordinatorwc", (req, res) => {
  const { coordinator_id } = req.query;

  if (!coordinator_id) {
    return res.status(400).json({ message: "Coordinator ID is required" });
  }

  const query = `
    SELECT coordinator_firstname, coordinator_lastname
    FROM coordinator
    WHERE coordinator_id = ?
  `;

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error fetching coordinator details:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    const { coordinator_firstname, coordinator_lastname } = results[0];
    res.status(200).json({
      fullName: `${coordinator_firstname} ${coordinator_lastname}`,
    });
  });
});
// recent student
app.get("/api/recent-students", (req, res) => {
  const coordinator_id = req.query.coordinator_id;

  if (!coordinator_id) {
    return res.status(400).json({ message: "Coordinator ID is required" });
  }

  const query = `
    SELECT s.student_id, s.student_schoolid, s.student_name, c.company_name
    FROM student s
    LEFT JOIN company c ON s.company_id = c.company_id
    WHERE s.coordinator_id = ?
    ORDER BY s.student_id DESC
    LIMIT 5
  `;

  db.query(query, [coordinator_id], (err, results) => {
    if (err) {
      console.error("Error fetching recently added students:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    res.status(200).json({ recentStudents: results });
  });
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Student login endpoint
app.post("/api/student/login", (req, res) => {
  const { student_schoolid, student_password } = req.body;

  if (!student_schoolid || !student_password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Query to check student credentials
  db.query(
    "SELECT * FROM student WHERE student_schoolid = ? AND student_password = ?",
    [student_schoolid, student_password],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length > 0) {
        const student = results[0];
        return res.status(200).json({
          message: "Student logged in successfully",
          student_id: student.student_id,
          student_name: student.student_name,
          // Add any other fields you want to return
        });
      } else {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
    }
  );
});

// Student Route - Handle QR scan and create or update timesheet entry
app.post("/student/scan", (req, res) => {
  const { studentId, companyQr, scanTime, address } = req.body;

  // Validate required fields
  if (!address) {
    return res.status(400).json({ error: "Address (location) is required" });
  }
  if (!studentId || !companyQr || !scanTime) {
    return res
      .status(400)
      .json({ error: "Student ID, QR code, and scan time are required" });
  }

  // Find company using the company QR code
  db.query(
    "SELECT company_id FROM company WHERE company_qr = ?",
    [companyQr],
    (err, result) => {
      if (err) {
        console.error("Error fetching company:", err);
        return res
          .status(500)
          .json({ error: "Database error while fetching company" });
      }

      if (result.length === 0) {
        console.error("Company not found for QR code:", companyQr);
        return res
          .status(404)
          .json({ error: "Invalid QR code: Company not found" });
      }

      const companyId = result[0].company_id;

      // Parse the scanTime to create separate date and time fields
      const scanDate = new Date(scanTime);
      const date = scanDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const time = scanDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // 12-hour format
      });

      // Check if a timesheet entry exists for this student and date
      db.query(
        "SELECT * FROM timesheet WHERE student_id = ? AND date = ?",
        [studentId, date],
        (err, rows) => {
          if (err) {
            console.error("Error fetching timesheet:", err);
            return res
              .status(500)
              .json({ error: "Database error while fetching timesheet" });
          }

          if (rows.length > 0) {
            // Update existing record (handle up to 4 scans)
            const timesheetEntry = rows[0];
            const updatedFields = {};

            // Determine the next available scan slot
            if (!timesheetEntry.am_in) {
              updatedFields.am_in = time;
            } else if (!timesheetEntry.am_out) {
              updatedFields.am_out = time;
            } else if (!timesheetEntry.pm_in) {
              updatedFields.pm_in = time;
            } else if (!timesheetEntry.pm_out) {
              updatedFields.pm_out = time;
            } else {
              return res.status(400).json({
                error: "All time slots for the day are already filled",
              });
            }

            // Update the timesheet with the available slot
            db.query(
              "UPDATE timesheet SET ? WHERE time_id = ?",
              [updatedFields, timesheetEntry.time_id],
              (err) => {
                if (err) {
                  console.error("Error updating timesheet:", err);
                  return res
                    .status(500)
                    .json({ error: "Database error while updating timesheet" });
                }
                res.json({ message: "Timesheet updated successfully" });
              }
            );
          } else {
            // Insert new record if no entry exists for that date
            db.query(
              "INSERT INTO timesheet (student_id, company_id, date, am_in, am_out, pm_in, pm_out, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [studentId, companyId, date, time, null, null, null, address],
              (err) => {
                if (err) {
                  console.error("Error inserting into timesheet:", err);
                  return res
                    .status(500)
                    .json({ error: "Database error while inserting scan" });
                }
                res.json({ message: "Time in recorded successfully" });
              }
            );
          }
        }
      );
    }
  );
});

app.get("/api/student-details", (req, res) => {
  const student_id = req.query.student_id;

  if (!student_id) {
    return res.status(400).json({ message: "Student ID is required" });
  }

  const query = `
    SELECT 
      s.student_name, 
      s.student_address, 
      s.student_contact,
      s.student_schoolid,
      s.student_sex,
      s.student_email, 
      c.company_name, 
      c.company_address, 
      c.company_mentor, 
      c.company_contact, 
      p.program_name, 
      sy.school_yr 
    FROM student s
    LEFT JOIN company c ON s.company_id = c.company_id
    LEFT JOIN coordinator co ON s.coordinator_id = co.coordinator_id
    LEFT JOIN program p ON co.program_id = p.program_id
    LEFT JOIN school_year sy ON s.year_id = sy.year_id
    WHERE s.student_id = ?;
  `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      console.error("Error fetching student details:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ studentDetails: results[0] });
  });
});
// API endpoint to fetch student details
app.get("/api/student-homedetails", async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ message: "Missing student_id parameter." });
  }

  try {
    // Fetch student details
    const [studentData] = await db
      .promise()
      .query(
        `SELECT student_name, coordinator_id, student_sex FROM student WHERE student_id = ?`,
        [student_id]
      );

    if (studentData.length === 0) {
      return res.status(404).json({ message: "Student not found." });
    }

    const { student_name, coordinator_id, student_sex } = studentData[0];
    const firstName = student_name.split(" ")[0]; // Extract first name

    // Fetch coordinator and program details
    const [coordinatorData] = await db
      .promise()
      .query(`SELECT program_id FROM coordinator WHERE coordinator_id = ?`, [
        coordinator_id,
      ]);

    if (coordinatorData.length === 0) {
      return res.status(404).json({ message: "Coordinator not found." });
    }

    const { program_id } = coordinatorData[0];
    const [programData] = await db
      .promise()
      .query(`SELECT program_hours FROM program WHERE program_id = ?`, [
        program_id,
      ]);

    if (programData.length === 0) {
      return res.status(404).json({ message: "Program not found." });
    }

    const { program_hours } = programData[0];

    // Fetch rendered time from timesheet
    const [timesheetEntries] = await db
      .promise()
      .query("SELECT * FROM timesheet WHERE student_id = ?", [student_id]);

    // Calculate total rendered hours
    const calculateRenderedHours = (inTime, outTime) => {
      const parseTime = (time) => {
        if (!time) return 0;
        const [hours, minutes] = time.split(":").map(Number);
        return hours + minutes / 60;
      };

      const inDecimal = parseTime(inTime);
      const outDecimal = parseTime(outTime);
      return inDecimal < outDecimal ? outDecimal - inDecimal : 0;
    };

    const totalRendered = timesheetEntries.reduce((sum, entry) => {
      const morningHours = calculateRenderedHours(entry.am_in, entry.am_out);
      const afternoonHours = calculateRenderedHours(entry.pm_in, entry.pm_out);
      return sum + morningHours + afternoonHours;
    }, 0);

    const remainingTime = Math.max(program_hours - totalRendered, 0);

    res.json({
      studentDetails: {
        firstName,
        renderedTime: totalRendered.toFixed(2),
        remainingTime: remainingTime.toFixed(2),
        requiredTime: program_hours,
        studentSex: student_sex,
      },
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
//dtr
app.get("/api/student-timesheet", async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: "Missing student_id parameter." });
  }

  try {
    // Fetch timesheet entries for the student
    const [timesheetEntries] = await db
      .promise()
      .query("SELECT * FROM timesheet WHERE student_id = ?", [student_id]);

    if (timesheetEntries.length === 0) {
      return res.status(404).json({ error: "No timesheet entries found." });
    }

    // Helper function to parse time strings into decimal hours
    const parseTimeToDecimal = (time) => {
      if (!time || typeof time !== "string") return null;

      time = time.trim().toLowerCase();
      const isPM = time.endsWith("pm");
      const isAM = time.endsWith("am");
      const timeWithoutSuffix = time.replace(/(am|pm)/, "").trim();
      const [hours, minutes] = timeWithoutSuffix.split(":").map(Number);

      if (isNaN(hours) || isNaN(minutes)) return null;

      let hoursIn24 = hours;
      if (isPM && hours < 12) {
        hoursIn24 += 12; // Convert PM hour to 24-hour format
      } else if (isAM && hours === 12) {
        hoursIn24 = 0; // Midnight case
      }

      return hoursIn24 + minutes / 60; // Return decimal hours
    };

    // Helper function to calculate hours rendered between two times
    const calculateRenderedHours = (inTime, outTime) => {
      const inDecimal = parseTimeToDecimal(inTime);
      const outDecimal = parseTimeToDecimal(outTime);

      if (
        inDecimal === null ||
        outDecimal === null ||
        inDecimal >= outDecimal
      ) {
        return 0; // Return 0 for invalid or mismatched times
      }

      return outDecimal - inDecimal;
    };

    // Process each timesheet entry
    const processedTimesheet = timesheetEntries.map((entry) => {
      const morningHours = calculateRenderedHours(entry.am_in, entry.am_out);
      const afternoonHours = calculateRenderedHours(entry.pm_in, entry.pm_out);
      const totalHours = morningHours + afternoonHours;

      return {
        date: entry.date,
        location: entry.location,
        morning: { in: entry.am_in || "-", out: entry.am_out || "-" },
        afternoon: { in: entry.pm_in || "-", out: entry.pm_out || "-" },
        totalHours: totalHours.toFixed(2), // Rounded to 2 decimal places
      };
    });

    res.json({ timesheet: processedTimesheet });
  } catch (error) {
    console.error("Error fetching timesheet:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint to fetch the current password of a student
app.get("/api/student-password", async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: "Missing student_id parameter." });
  }

  try {
    const [result] = await db
      .promise()
      .query("SELECT student_password FROM student WHERE student_id = ?", [
        student_id,
      ]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.json({ password: result[0].student_password });
  } catch (error) {
    console.error("Error fetching student password:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Endpoint to update the student's password
app.post("/api/update-student-password", async (req, res) => {
  const { student_id, current_password, new_password } = req.body;

  if (!student_id || !current_password || !new_password) {
    return res.status(400).json({
      error: "student_id, current_password, and new_password are required.",
    });
  }

  try {
    // Verify the current password
    const [result] = await db
      .promise()
      .query("SELECT student_password FROM student WHERE student_id = ?", [
        student_id,
      ]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    const storedPassword = result[0].student_password;
    if (storedPassword !== current_password) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    // Update the password in the database
    await db
      .promise()
      .query("UPDATE student SET student_password = ? WHERE student_id = ?", [
        new_password,
        student_id,
      ]);

    res.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating student password:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// API to fetch the latest announcement
app.get("/api/latest-announcement", async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: "Missing student_id parameter." });
  }

  try {
    // Fetch the coordinator_id of the student
    const [studentResult] = await db
      .promise()
      .query("SELECT coordinator_id FROM student WHERE student_id = ?", [
        student_id,
      ]);

    if (studentResult.length === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    const { coordinator_id } = studentResult[0];

    // Fetch the latest announcement for the coordinator
    const [announcementResult] = await db
      .promise()
      .query(
        "SELECT announce_id, announcement_type, announcement_content FROM announce WHERE coordinator_id = ? ORDER BY announce_id DESC LIMIT 1",
        [coordinator_id]
      );

    if (announcementResult.length === 0) {
      return res.status(404).json({ error: "No announcements found." });
    }

    const latestAnnouncement = announcementResult[0];

    res.json({
      announcement: latestAnnouncement,
    });
  } catch (error) {
    console.error("Error fetching latest announcement:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
