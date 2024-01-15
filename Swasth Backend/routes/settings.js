const express = require('express');
const bodyParser = require('body-parser');
const bcrypt=require('bcrypt');//for password hashing
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const db = require('../config/db');
const app = express();
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

//Fetching information of users
app.get('/requestsettings', (req,res) =>{
   const userId = req.query.userId;
//const username = 'Rachit';
   console.log('Received request for username:', userId);
   db.query("SELECT name,email, phoneNumber FROM registration where userId = ? ", [userId] , (error, results, fields)=>{
       	if(error){
	       console.error('Error executing SELECT query : ', error);
	       res.status(500).send('Error fetching user data');
	} else {
        res.status(200).json(results);
	}
    });		
});


//Updating the details of users
app.post('/updatesettings', async (req,res)=>{
    const {userId,name,email,password,phoneNumber} = req.body;
    const hashedPassword = await bcrypt.hash(password,10)
    db.query('UPDATE registration SET name=? , email = ?, phoneNumber= ? ,  password = ? WHERE userId = ?', [name, email,phoneNumber, hashedPassword, userId], (error, results, fields) => {
    //db.query('UPDATE registration SET phone_number= 9873 WHERE user_id = 16 or username = ?', [username], (error, results, fields) => {
        if(error) throw error;
        res.json({message: "User data updated successfully"});
    });
});

module.exports = app;