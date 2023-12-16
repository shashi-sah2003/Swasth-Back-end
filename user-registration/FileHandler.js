const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db.js');
const fs = require('fs');

const app = express();

//Storage configuration for uploaded files
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        
        //extracting the username from the logged-in user
        const username = req.body.username; //The username should be  sent in the request body

        //creating a folder with the username (if doesn't exist)
        const folderPath = path.join("destination/path", username);
        fs.mkdirSync(folderPath, { recursive: true});

        cb(null, folderPath);
    },

    filename: function (req, file, cb){

        //extracting the username from logged-in user
        const username = req.body.username;

        //generating a filename using the username and a timestamp
        const timestamp = Date.now();
        const filename = `${username}_${timestamp}_${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage});

app.post('/upload', upload.single('file'), (req, res, next) => {

    const file = req.file;
    if(!file){
        const error = new Error("Please upload a File");
        error.httpStatusCode = 400;
        return next(error);
    }

    const username = req.body.username;

    const fileData = {
        Medical_record_id: req.body.Medical_record_id,
        File_name: file.originalname,
        File_location: file.path,
        Status: 'Active',
        Created_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
        Created_by: username
    };

    const query = 'INSERT INTO record_files SET ?';
    db.query(query, fileData, (error, results, fields) => {
        if (error) throw error;
        res.send("File has been uploaded and data has been stored in the record_files table.");
    });

    res.send("File uploaded successfully", file);
})

// //Storage configuration for uploaded files
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, "C:\\Users\\shash\\OneDrive\\Desktop\\uploads"); //set the destination folder for uploads
//     },
//     filename: function(req, file, cb){
//         cb(null, file.originalname); //use the original file name
//     }
// });

// const upload = multer ({storage: storage});

// //Handling post request for the file upload
// app.post('/upload', upload.single('file'), (req,res,next) => {
//     const file = req.file;
//     if(!file){
//         const error = new Error("Please upload a File");
//         error.httpStatusCode = 400;
//         return next(error);
//     }

//     const fileData = {
//         Medical_record_id: req.body.Medical_record_id,
//         File_name: file.originalname,
//         File_location: file.path,
//         Status: 'Active',
//         Created_on: new Date().toISOString.slice(0,19).replace('T',' '),
//         Created_by: 'Your created by value'
//     };

//     const query = 'INSERT INTO record_files SET ?';
//     db.query(query, fileData, (error, results, fields) => {
//         if (error) throw error;
//         res.send("File has been uploaded and data has been stored to record_file table.");
//     });

//     res.send(file);
// });

module.exports = app;