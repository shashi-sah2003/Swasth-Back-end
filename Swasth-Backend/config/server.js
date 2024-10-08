const express = require('express');
const bodyParser = require('body-parser');
const register = require('../routes/register');
const login = require('../routes/login')
//const UploadFile = require('../routes/UploadFile');
const UploadFile = require('../routes/UploadFile');
const FetchFile = require('../routes/FetchFile');
const otpGenerator = require('../routes/OTP-generator');
const settings = require('../routes/settings');
const changePassword = require('../routes/forgotPassword');
const otpDeletionScheduler = require('./otpDeletor');


const app = express();
const port = 3000;

const ipaddress= "216.48.183.144";
//const ipaddress= "0.0.0.0";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up OTP cleanup job
otpDeletionScheduler();

// Include routes
app.use('/', register);
app.use('/', login);
app.use('/', UploadFile);
app.use('/',FetchFile);
app.use('/', otpGenerator);
app.use('/', settings);
app.use('/', changePassword);

//starting express server
app.listen(port,ipaddress,()=> {
    console.log(`Server is running on http://${ipaddress}:${port}`);

});
