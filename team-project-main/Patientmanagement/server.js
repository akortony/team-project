const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username', // replace with your MySQL username
    password: 'your_password', // replace with your MySQL password
    database: 'healthcare'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Endpoint to register a patient
app.post('/register', (req, res) => {
    const { firstName, lastName, email, address, postalCode, insuranceID, primaryContact, alternateContact } = req.body;

    const query = 'INSERT INTO patients (first_name, last_name, email, address, postal_code, insurance_id, primary_contact, alternate_contact) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [firstName, lastName, email, address, postalCode, insuranceID, primaryContact, alternateContact], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Patient registered successfully', patientId: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});