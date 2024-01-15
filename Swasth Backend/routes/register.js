const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto'); 
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt'); //for password hashing
const db = require('../config/db');


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Registration Route
app.post('/register',async (req,res) =>{
    const {name, email, password, phoneNumber, dateOfBirth} = req.body;
    console.log("data Received");

    //Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password,10);

    const register = 'INSERT INTO registration (name, email, password, phoneNumber, DateOfBirth) VALUES (?,?,?,?,?)';
    db.query(register, [name, email, hashedPassword, phoneNumber, dateOfBirth],(err,result) =>{
        if(err){
            console.error('Error registering user: ', err);
            return res.status(500).json({error: 'An error occured'});
        }
        else{

            const fetchuserId = 'Select * from registration where email = ?';
            db.query(fetchuserId,[email], (err, result) => {

                if(err){
                    console.error("Error fetching UserId: ");
                    return res.status(500).json({error: "An error occured"});
                }

                if(result.length === 0){
                    return res.status(401).json({error : 'Invalid credentials'});
                }
                
                const user = result[0];
                //Generate a JWT token for authentication
                const secretKey = crypto.randomBytes(32).toString('hex');
                const token = jwt.sign({userId: user.userId, phoneNumber: user.phoneNumber, email: user.email}, secretKey, {expiresIn: '1h'});
                return res.status(200).json({success: true, token: token});
                
            })

            //return res.status(200).json({messsage : "An user registered successfully"});

        }
    });
});

app.get('/register', (req, res) => {
    res.send('This endpoint is for user registration. Use a POST request to register a user.');
});

module.exports = app;