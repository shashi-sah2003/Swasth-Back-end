const express = require('express');
const bodyParser = require('body-parser');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const db = require('./db')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const accountSid = 'AC46f55908e64c252e164b8c753cee1301';
const authToken = 'aef843278076383f07c93add59de8f75';
const client = new twilio(accountSid, authToken);
const twilioPhoneNumber = '+14695958945';


//const userOTPStorage = {};


app.post('/generateOTP', async (req, res) => {
    const { phoneNumber } = req.body;
    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  
    try {
      // Remove the '+' at the beginning if it's already present
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber.replace(/\D/g, '')}`;
  
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: twilioPhoneNumber,
        to: formattedPhoneNumber,
      });
  

      //Save OTP to the MySQL database
      const insertOTP = "INSERT INTO otps (phonenumber, otp) VALUES (?,?)";
      db.query(insertOTP, [formattedPhoneNumber, otp], (err) =>{

        if(err){
          console.error("Error saving OTP to MySQL:", err);
        }
      });

      
      res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
  });
  

app.post('/verifyOTP', (req,res) =>{

    const { phoneNumber, otp} = req.body;
    const formattedPhoneNumber = `+${phoneNumber.replace(/\D/g, '')}`;

    //Retrieving the stored OTP from the MySQL database based on latest timestamp
    const getOTP  = 'SELECT * FROM otps WHERE phoneNumber = ? ORDER BY timestamp DESC LIMIT 1';
    db.query(getOTP, [formattedPhoneNumber], (err, results) => {

      if(err){
        console.error("Error retrieving OTP from MySQL Server: ", err);
        return res.err(500).json({ success: false, error: 'Failed to verify OTP' });
      }

      const storedOTP = results[0]?.otp; //(optional chaining)-->this allows user for error prevention as it returns value even it doesn't exist

      if(storedOTP && storedOTP === otp){
        res.json({success: true, message: 'OTP verification successful'});
      }
      else{
        res.status(400).json({success: false, error: 'Invalid OTP'});
      }
    });

});

module.exports = app;

