const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.json());

//Fetching information of users
app.get('/user/:userId', (req,res) =>{
    const userId = req.params.userId;
    db.query('SELECT username, email FROM registration where id = ?', [userId], (error, results, fields)=>{
        if(error) throw error;
        res.json(results[0]);
    });
});

//Updating the details of users
app.post('/user/:userId', (req,res)=>{
    const userId = req.params.userId;
    const {newUsername, newEmail} = req.body;

    db.query('UPDATE registration SET username = ? , email = ? WHERE id = ?', [newUsername, newEmail, userId], (error, results, fields) => {
        if(error) throw error;
        res.json({message: "User data updated successfully"});
    });
});

module.exports = app;