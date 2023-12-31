const express = require('express');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');//for password hashing
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const db = require('./db');
const app = express();
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

//Fetching information of users
/*app.get('/requestsettings', (req,res) =>{
   const username = req.params.username;
    db.query('SELECT username, email, password , phone_number FROM registration where username = ?', [username] , (error, results, fields)=>{
        if(error) throw error;
        res.json(results[0]);
    });
});*/


//Updating the details of users
app.post('/updatesettings', async (req,res)=>{
   // const userId = req.params.username;
    const {username,email,password,phoneNumber} = req.body;
    const hashedPassword = await bcrypt.hash(password,10)
    db.query('UPDATE registration SET phone_number= ? , email = ? , password = ? WHERE username = ?', [phoneNumber, email, hashedPassword, username], (error, results, fields) => {
    //db.query('UPDATE registration SET phone_number= 9873 WHERE user_id = 16 or username = ?', [username], (error, results, fields) => {
        if(error) throw error;
        res.json({message: "User data updated successfully"});
    });
});

module.exports = app;
