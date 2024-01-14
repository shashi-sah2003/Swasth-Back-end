const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //for password hashing
const db = require('../config/db');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Registration Route
app.post('/register',async (req,res) =>{
    const {name, email, password, phoneNumber, dateOfBirth} = req.body;

    //Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password,10);

    const sql = 'INSERT INTO registration (name, email, password, phoneNumber, DateOfBirth) VALUES (?,?,?,?,?)';
    db.query(sql, [name, email, hashedPassword, phoneNumber, dateOfBirth],(err,result) =>{
        if(err){
            console.error('Error registering user: ', err);
            return res.status(500).json({error: 'An error occured'});
        }
        else{
            return res.status(200).json({messsage : "An user registered successfully"});
        }
    });
});

app.get('/register', (req, res) => {
    res.send('This endpoint is for user registration. Use a POST request to register a user.');
});

module.exports = app;
