const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const routes = require('./routes');
const fileHandler = require('./FileHandler');
const saveData = require('./saveData');
const user = require('./user');
const otpGenerator = require('./OTP-generator');

const app = express();
const port = 3000;

const ipaddress= "192.168.10.77";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Include routes
app.use('/', routes);
app.use('/', fileHandler);
app.use('/', saveData);
app.use('/', user);
app.use('/', otpGenerator);



//starting express server
app.listen(port,ipaddress,()=> {
    console.log(`Server is running on http://${ipaddress}:${port}`);

});
