const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const app = express();

app.get('/files/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Query record_files to get a list of files for the given username
        const fetchfile = 'SELECT t1.originalFileName, t1. modifiedFileName, t1.Created_on, t2.details FROM record_files t1 join medical_record t2 on t1.Created_by = t2.Created_by and t1.created_on = t2.created_on where t2.created_by = ?';
        db.query(fetchfile, [userId], async (err, result) => {
            if (err) {
                console.error(err);
                return next(err);
            }


            if (!Array.isArray(result)) {
                // Handle the case where the result is not an array
                console.error('Invalid result format from the database');
                return res.status(500).send('Internal Server Error');
            }

            // Return the list of files with only original filenames
            const files = result.map(file => ({
		    "filename" : file.originalFileName, 
		    "Created_on" : file.Created_on, 
		    "Description" : file.details}));
	    console.log(files);
            return res.json(files);
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});



app.get('/download/:userId/:originalFilename', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const originalFilename = req.params.originalFilename;
        console.log(userId);
        console.log(originalFilename);


        // Query record_files to get the modified filename for the original filename
        const downloadfile = 'SELECT modifiedFileName FROM record_files WHERE Created_by = ? AND originalFileName = ?';
        db.query(downloadfile, [userId, originalFilename], async (err, result) => {
            if (err) {
                console.error(err);
                return next(err);
            }

            // if (result.length === 0) {
            //     return res.status(404).send('File not found in the database');
            // }

            const modifiedFilename = result[0].modifiedFileName;
            console.log(modifiedFilename);
            
            const filePath = path.join("/home/team_swasth/Swasth_FileUpload/File", `${modifiedFilename}`);
            console.log(filePath);

            // Check if the file exists
            if (fs.existsSync(filePath)) {
                // Send the file as a response with the original filename
                return res.status(200).download(filePath);
            } else {
                // File not found
                return res.status(404).send('File not found');
            }
        });
    } 
    catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = app;
