const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password if required
    database: 'healthcaresystem'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API to insert doctor registration data with duplicate check
app.post('/register-doctor', (req, res) => {
    const {
        doctorAddress,
        name,
        specialization,
        email,
        username,
        doctorId,
        licenseNumber,
        yearsOfExperience,
        clinicName,
        contactNumber,
        addressDetails
    } = req.body;

    // Check if the doctor ID, username, or license number already exists
    const checkSql = `
        SELECT * FROM doctors 
        WHERE doctor_id = ? OR username = ? OR license_number = ?
    `;

    db.query(checkSql, [doctorId, username, licenseNumber], (err, results) => {
        if (err) {
            console.error('Error checking existing doctor:', err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.sqlMessage });
        }

        if (results.length > 0) {
            // Determine which field is duplicated
            let duplicateFields = [];
            results.forEach(doctor => {
                if (doctor.doctor_id === doctorId) duplicateFields.push("Doctor ID");
                if (doctor.username === username) duplicateFields.push("Username");
                if (doctor.license_number === licenseNumber) duplicateFields.push("License Number");
            });

            return res.status(400).json({ 
                success: false, 
                message: `${duplicateFields.join(", ")} already exists !!` 
            });
        }

        // Insert new doctor record if no duplicates
        const insertSql = `
            INSERT INTO doctors 
            (doctor_address, name, specialization, email, username, doctor_id, license_number, years_of_experience, clinic_name, contact_number, address_details) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            doctorAddress,
            name,
            specialization,
            email,
            username,
            doctorId,
            licenseNumber,
            yearsOfExperience,
            clinicName,
            contactNumber,
            addressDetails
        ];

        db.query(insertSql, values, (err, result) => {
            if (err) {
                console.error('Error inserting doctor:', err);
                return res.status(500).json({ success: false, message: 'Error inserting doctor', error: err.sqlMessage });
            }
            res.status(201).json({ success: true, message: 'Doctor registered successfully' });
        });
    });
});

// Start the server
app.listen(8081, () => {
    console.log(`Server running on port 8081`);
});
