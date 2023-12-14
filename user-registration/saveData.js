const express = require('express');
const db = require('./db.js');

const app = express();

app.post('/saveData', (req, res) => {

    const data = req.body;
    const query = ' INSERT INTO Medical_record (User_id, Record_type_id, Details, Status, Created_on, Created_by) VALUES (?, ?, ?, ?, ?, ?)';

    const values = [
        data.userId,
        data.recordTypeId,
        data.feeling,
        'ACTIVE',
        new Date().toISOString().slice(0,19).replace('T',' '),
        'You created by value'
    ];

    db.query(query, values, (error, results, fields) => {
        if(error){
            console.error("Error saving data to the database: " + error);
            res.status(500).send("Error saving data to the database");
        }
        else{
            console.log("Data saved to the database");
            res.status(200).send("Data saved to the database");
        }
    });
});

module.exports = app;