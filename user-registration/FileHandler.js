const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

//Storage configuration for uploaded files
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "C:\\Users\\shash\\OneDrive\\Desktop\\uploads"); //set the destination folder for uploads
    },
    filename: function(req, file, cb){
        cb(null, file.originalname); //use the original file name
    }
});

const upload = multer ({storage: storage});

//Handling post request for the file upload
app.post('/upload', upload.single('file'), (req,res,next) => {
    const file = req.file;
    if(!file){
        const error = new Error("Please upload a File");
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
});

module.exports = app;