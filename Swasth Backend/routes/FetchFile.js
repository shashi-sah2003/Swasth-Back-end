const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

const app = express();

app.get('/files/:userId', async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Query record_files to get a list of files for the given username
        const fetchfile = 'SELECT original_file_name, modified_file_name FROM record_files WHERE Created_by = ?';
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
            const files = result.map(file => file.original_file_name);
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

        // Query record_files to get the modified filename for the original filename
        const downloadfile = 'SELECT modified_file_name FROM record_files WHERE Created_by = ? AND original_file_name = ?';
        db.query(downloadfile, [userId, originalFilename], async (err, result) => {
            if (err) {
                console.error(err);
                return next(err);
            }

            if (result.length === 0) {
                return res.status(404).send('File not found in the database');
            }

            const modifiedFilename = result[0].modified_file_name;
            const filePath = path.join("/home/team_swasth/Swasth_FileUpload/File", `${modifiedFilename}`);

            // Check if the file exists
            if (fs.existsSync(filePath)) {
                // Send the file as a response with the original filename
                return res.download(filePath);
            } else {
                // File not found
                return res.status(404).send('File not found');
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = app;
