const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const routes = require('./routes');
const fileHandler = require('./FileHandler');

const app = express();
const port = 3000;

const ipaddress= "10.43.4.68";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Include routes
app.use('/', routes);
app.use('/', fileHandler);

//starting express server
app.listen(port,ipaddress,()=> {
    console.log(`Server is running on http://${ipaddress}:${port}`);

});
