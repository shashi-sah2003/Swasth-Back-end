const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'swasth',
    password: 'Wq5&g!32@x',
    database: 'swasth'
});

db.connect((err) => {
    if (err) {
        console.error('Mysql connection error:', err);
    } else {
        console.log("Connected to MySQL");
    }
});

module.exports = db;
