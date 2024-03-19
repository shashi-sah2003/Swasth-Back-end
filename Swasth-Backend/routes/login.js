const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //for password hashing
const jwt = require('jsonwebtoken'); //for JWT generation
const crypto = require('crypto');
const db = require('../config/db');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Login Route

app.get('/login', (req, res) => {
    res.send('This endpoint is for Login user. Use a POST request to login a user.');
  });

app.post('/login',async (req,res) =>{

    const {email, password} = req.body;

    const sql = ' SELECT * from user WHERE email = ?';
    db.query(sql,[email], async(err,results) =>{
        if(err){
            console.error('Error while checking credentials: ',err);
            return res.status(500).json({error: "An error occured"});
        }

        if(results.length === 0){
            return res.status(401).json({error : 'Not a registered user.'});
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(402).json({error : 'Incorrect Password'});
        }
        
        //Generate a JWT token for authentication
        const secretKey = crypto.randomBytes(32).toString('hex');
        const token = jwt.sign({userId: user.userId, phoneNumber: user.phoneNumber, email: user.email}, secretKey, {expiresIn: '1h'});

        return res.status(200).json({success: true, token: token});
    })
})


module.exports = app;
