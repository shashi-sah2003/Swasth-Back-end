const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const routes = require('./routes');
const UploadFile = require('./UploadFile');
const FetchFile = require('./FetchFile')
const saveData = require('./saveData');
const user = require('./user');
const otpGenerator = require('./OTP-generator');

const app = express();
const port = 3000;

const ipaddress= "216.48.183.144";
//const ipaddress= "0.0.0.0";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Include routes
app.use('/', routes);
app.use('/', UploadFile);
app.use('/',FetchFile);
app.use('/', saveData);
app.use('/', user);
app.use('/', otpGenerator);



//starting express server
app.listen(port,ipaddress,()=> {
    console.log(`Server is running on http://${ipaddress}:${port}`);

});
