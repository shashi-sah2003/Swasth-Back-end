const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/files/:username', async (req, res, next) => {
    try {
        const username = req.params.username;
        const folderPath = path.join("/home/team_swasth/Swasth_FileUpload", username);

        // Read files from the folder
        const files = fs.readdirSync(folderPath);

        return res.json(files);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

app.get('/download/:username/:filename', (req, res, next) => {
    try {
        const username = req.params.username;
        const filename = req.params.filename;
        const filePath = path.join("/home/team_swasth/Swasth_FileUpload", username, filename);

        // Check if the file exists
        if (fs.existsSync(filePath)) {
            // Send the file as a response
            return res.sendFile(filePath);
        } else {
            // File not found
            return res.status(404).send('File not found');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = app;

