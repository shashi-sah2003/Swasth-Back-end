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
    const {name, phoneNumber, email, yearOfBirth, location, password} = req.body;
    const Created_by = "webservice";
    const Updated_by = "webservice";

    // Check if location is provided
    if (!location) {
        return res.status(400).json({ error: "Location is required" });
    }
    
    // Split the location string into latitude and longitude
    const [latitude, longitude] = location.split(',').map(coord => coord.trim());
    console.log("data Received");

    //Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password,10);

    const register = 'INSERT INTO user (name, phoneNumber, email, yearofBirth, password, latitude, longitude, Created_by, Updated_by) VALUES (?,?,?,?,?,?,?,?,?)';
    db.query(register, [name, phoneNumber, email, yearOfBirth,hashedPassword, latitude, longitude, Created_by, Updated_by],(err,result) =>{
        if(err){
            console.error('Error registering user: ', err);
            return res.status(500).json({error: 'An error occured'});
        }
        else{

            const fetchuserId = 'Select * from user where email = ?';
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