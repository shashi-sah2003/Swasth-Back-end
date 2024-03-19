const express = require('express');
const db = require('../config/db');
const bcrypt = require('bcrypt'); 
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/changePassword', async (req,res) => {

    const { userId, newPassword } = req.body;
    console.log(userId);
    console.log(newPassword);

    // if( !userId || !newPassword ){
    //     return res.status(400).json({ success: false, message: "Please provide user ID and password"});
    // }

    try {

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatePassword = "UPDATE user SET password = ? where userId = ?";
        db.query(updatePassword, [hashedPassword, userId], (err, results) => {
            if(err){
                return res.status(500).json({ success: false, error: "Failed to update password"});
            }
            else{
                return res.status(200).json({ success: true, message: "Password updated successfully"});
            }
        });
    }
    catch(error){
        return res.status(500).json({ success: false, error: "Internal Server Error"});
    }
})

module.exports = app;