const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse the incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MySQL database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Your MySQL username
    password: 'new_password',   // Your MySQL password
    database: 'crime_db'  // Your database name
});

db.connect(err => {
    if (err) {
        console.log('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Handle form submission
app.post('/submit', (req, res) => {
    const {
        polog_pid,
        polog_pname,
        polog_crimetype,
        polog_vname,
        polog_cadhaarnum,
        polog_cid,
        polog_cname,
        polog_loc,
        polog_pincode,
        polog_date,
        polog_time
    } = req.body;

    // Handle empty fields for aadhaar and other numeric fields
    const aadhaar = polog_cadhaarnum === '' ? null : polog_cadhaarnum;
    const cid = polog_cid === '' ? null : polog_cid;
    const cname = polog_cname ==='' ? null : polog_cname;

    const sql = 'INSERT INTO crimes (police_id, police_name, crime_type, victim_name, criminal_aadhaar, criminal_id, criminal_name, location, pincode, date, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [polog_pid, polog_pname, polog_crimetype, polog_vname, aadhaar, cid, cname, polog_loc, polog_pincode, polog_date, polog_time], (err, result) => {
        if (err) {
            console.log('Error inserting data:', err);
            res.send('Failed to register crime');
        } else {
            res.send('Crime registered successfully!');
        }
    });
});


// Serve the form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/policeForm.html');
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
