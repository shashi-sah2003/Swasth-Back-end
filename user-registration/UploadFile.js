const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db.js');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Storage configuration for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const username = req.body.username;
        const folderPath = path.join("/home/team_swasth/Swasth_FileUpload", username);

        // Create the folder if it doesn't exist
        fs.mkdirSync(folderPath, { recursive: true });

        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const filename = `${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            const error = new Error("Please upload a File");
            error.httpStatusCode = 400;
            return next(error);
        }

        const username = req.body.username;

        // Generate a UUID
        const generatedUuid = uuidv4();

        let fileData = {
            Medical_record_id: generatedUuid,
            File_name: file.originalname,
            Status: 'Active',
            Created_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
            Created_by: username
        };

        // If file.path is available, use it; otherwise, read from buffer
        if (file.path) {
            fileData.File_location = file.path;
        } else {
            // Read file from buffer and save it in a specific location
            const buffer = file.buffer;
            const destinationPath = `/home/team_swasth/Swasth_FileUpload/${username}/${file.originalname}`;
            fs.writeFileSync(destinationPath, buffer);
            fileData.File_location = destinationPath;
        }

        const query = 'INSERT INTO record_files SET ?';
        await db.query(query, fileData);

        res.send("File has been uploaded and data has been stored in the record_files table.");
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = app;
