const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'shashi',
    password: 'saroj@2002',
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
