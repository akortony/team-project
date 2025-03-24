const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto'); // For password generation

const app = express();
app.use(express.json());
app.use(cors());

// Set SendGrid API Key
//sgMail.setApiKey('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'); // Replace with your actual API key
require('dotenv').config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

// Function to generate a random password
function generatePassword() {
    return crypto.randomBytes(6).toString('hex'); // Generates a 12-character password
}

// API to insert doctor registration data and send email
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

    // Generate a random password
    const generatedPassword = generatePassword();

    // Check if doctor already exists
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

        // Insert new doctor record
        const insertSql = `
            INSERT INTO doctors 
            (doctor_address, name, password, specialization, email, username, doctor_id, license_number, years_of_experience, clinic_name, contact_number, address_details) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            doctorAddress,
            name,
            generatedPassword,
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

            // **Send Email on Successful Registration**
            const msg = {
                to: email,
                from: 'annanitababu.19@gmail.com', // Make sure this email is verified in SendGrid
                subject: 'Doctor Registration Successful - Your Credentials',
                text: `Dear Dr. ${name},\n\nYour registration was successful!\n\nYour login credentials:\nUsername: ${username}\nPassword: ${generatedPassword}\n\nPlease change your password after logging in.\n\nThank you!`,
                html: `<p>Dear Dr. <strong>${name}</strong>,</p>
                       <p>Your registration was successful!</p>
                       <p><strong>Your login credentials:</strong></p>
                       <p>Username: <strong>${username}</strong></p>
                       <p>Password: <strong>${generatedPassword}</strong></p>
                       <p>Please change your password after logging in.</p>
                       <p>Thank you!</p>`
            };

            sgMail.send(msg)
                .then(() => {
                    console.log('Email sent successfully to:', email);
                })
                .catch(error => {
                    console.error('Error sending email:', error);
                });

            res.status(201).json({ success: true, message: 'Doctor registered successfully and email sent' });
        });
    });
});

// Start the server
app.listen(8081, () => {
    console.log(`Server running on port 8081`);
});
