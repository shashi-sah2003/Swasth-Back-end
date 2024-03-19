const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
//const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const crypto = require('crypto');
const db = require('../config/db');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const accountSid = 'AC46f55908e64c252e164b8c753cee1301';
// const authToken = 'aef843278076383f07c93add59de8f75';
// const client = new twilio(accountSid, authToken);
// const twilioPhoneNumber = '+14695958945';


app.post('/generateOTP', async (req, res) => {
  const { phonenumber } = req.body;
  const phoneNumber = `+${phonenumber}`;
  console.log(phoneNumber);

  const otp = crypto.randomInt(1000, 10000);

  try {
    //Removing the '+' at the beginning if it's already present
    //const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber.replace(/\D/g, '')}`;

    //Checking if phoneNumber has a corresponding userId in user table
    const checkUser = "SELECT userId FROM user WHERE phoneNumber = ?";
    db.query(checkUser, [phoneNumber], (err, userResult) => {
      if (err) {
        console.error("Error fetching User data: ", err);
        return res.status(500).json({ success: false, error: "Error fetching user data" });
      }
      else if (userResult && userResult.length > 0) {
        //User Found

        const userId = userResult[0].userId;

        //Now checking if there is an existing OTP for the corresponding user
        const checkExistingOTP = "SELECT * from otps WHERE userId = ?";
        db.query(checkExistingOTP, [userId], (err, otpResults) => {
          if (err) {
            console.error("Error fetching data from otps table: ", err);
            return res.status(500).json({ success: false, error: "Error fetching data from otps" });
          }
          else {
            if (otpResults && otpResults.length > 0) {
              //Existing OTP found, then update it

              const UpdateOTP = "UPDATE otps SET otp = ? WHERE userId = ?";
              db.query(UpdateOTP, [otp, userId], (err) => {
                if (err) {
                  console.error("Error updating the otps table: ", err);
                  return res.status(500).json({ success: false, error: "Failed to update OTP" });
                }
                else {
                  console.log("OTP updated successfully");
                  return res.status(200).json({ success: true, message: "OTP updated successfully" });
                }
              });
            }
            else {
              //No previously stored OTP then insert a new one for that userId corresponding to that phoneNumber
              const insertOTP = "INSERT into otps (userId, otp) VALUES (?,?)";
              db.query(insertOTP, [userId, otp], (err) => {
                if (err) {
                  console.error("Error saving OTP to MySQL:", err);
                  return res.status(500).json({ success: false, error: 'Failed to save OTP' });
                }
                else {
                  return res.status(200).json({ success: true, message: 'OTP saved successfully' });
                }

              });
            }
          }
        });
      }
      else {
        // No user found with the given phoneNumber
        return res.status(404).json({ success: false, error: "No user found with the given phone number" });
      }
    });
  }
  catch (error) {
    console.error("Server error: ", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


//Verifying and authenticating the OTP

app.post('/verifyOTP', (req, res) => {
  const { phonenumber, otp } = req.body;
  const phoneNumber = `+${phonenumber}`;

  // First, find the userId associated with the phoneNumber
  const getUser = 'SELECT userId, phoneNumber, email FROM user WHERE phoneNumber = ?';
  db.query(getUser, [phoneNumber], (err, userResults) => {
    if (err) {
      console.error("Error fetching user data: ", err);
      return res.status(500).json({ success: false, error: "Error fetching user data" });
    } else if (userResults.length > 0) {
      const userId = userResults[0].userId;
      const phoneNumber = userResults[0].phoneNumber;
      const email = userResults[0].email;

      console.log(userId, phoneNumber, email);
      // Now, retrieve the stored OTP using the userId
      const getOTP = 'SELECT * FROM otps WHERE userId = ?';
      db.query(getOTP, [userId], (err, results) => {
        if (err) {
          console.error("Error retrieving OTP from MySQL Server: ", err);
          return res.status(500).json({ success: false, error: 'Failed to verify OTP' });
        }

        const storedOTP = results[0]?.otp;
        // const otpTimestamp = results[0]?.timestamp;
        // const currentTime = new Date();
        // const otpTime = new Date(otpTimestamp);
        // const timeDifference = (currentTime - otpTime) / 1000;

        if (storedOTP && storedOTP === otp ) {
          
          // OTP verification successful, generate a token
          const secretKey = crypto.randomBytes(32).toString('hex');
          const token = jwt.sign({ userId: userId, phoneNumber: phoneNumber, email: email }, secretKey, { expiresIn: '1h' });

          console.log(token);
          return res.status(200).json({ success: true, message: 'OTP verification successful', token: token });
        } 
        //else if (timeDifference > 60) {
        //   return res.status(400).json({ success: false, error: 'OTP is expired' });
         //} 
        else {
          return res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
      });
    } else {
      // No user found with the given phoneNumber
      return res.status(404).json({ success: false, error: "No user found with the given phone number" });
    }
  });
});

module.exports = app;
