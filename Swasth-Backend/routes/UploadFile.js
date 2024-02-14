const express = require('express');
const path = require('path');
const db = require('../config/db'); // Ensure this is a promise-based MySQL connection
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Use promise-based fs module
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Mapping all the recordType with an Id which corresponds to medical_record_type table
// This appears to be unused in your provided code, consider how you want to use it
const recordTypeMap = {
    'Symptom': 1,
    'Test_report': 2,
    'Prescription': 3,
    'Medicine': 4
};

app.post('/upload', async (req, res, next) => {
    try {
        const { file, userId, DateTime, Description } = req.body;

        // Ensure that the request has a file and necessary data
        if (!file || !userId || !DateTime || !Description) {
            return res.status(400).send({ error: "Missing required fields or file" });
        }

        // Assuming recordTypeMap translates recordType to a valid recordTypeId
        const recordTypeId = 2;
        if (!recordTypeId) {
            return res.status(400).send({ error: "Invalid record type" });
        }

        // Generating filename and file path
        const datetimestamp = DateTime;
        const filename = `${userId}_${datetimestamp}`;

        // Extract the file extension from the original filename
        const originalFilename = file.originalname;
        const fileExtension = originalFilename.slice(((originalFilename.lastIndexOf(".") - 1) >>> 0) + 2);
        const destinationPath = path.join('/home/team_swasth/Swasth_FileUpload/File', `${filename}.${fileExtension}`);

        // Decode the base64 data and write the file to disk
        await fs.writeFile(destinationPath, Buffer.from(file.data, 'base64'));

        // Inserting details into medical_record table first to get medicalRecordId
        const insertMedicalRecordQuery = `
      INSERT INTO medical_record (userId, recordTypeId, details, Created_on, Created_by) 
      VALUES (?, ?, ?, ?, ?)
    `;

        const medicalRecordInsertResult = await db.query(insertMedicalRecordQuery, [userId, recordTypeId, Description, DateTime, userId]);

        //fetching medicalrecordid from medical_record table

        const medicalrecordid = 'Select medicalrecordid from medical_record where userid = ? and created_on =?';
        db.query(medicalrecordid, [userId, DateTime, userId], async (err, results) => {
            if (err) {
                console.error("Unable to fetch medical record Id")
            }

            medicalRecordId = results[0].medicalrecordid;

            // Now insert into record_files with the obtained medicalRecordId
            const fileData = {
                medicalrecordid: medicalRecordId, // Use medicalRecordId obtained from the previous insert
                originalFileName: originalFilename,
                modifiedFileName: `${filename}.${fileExtension}`,
                fileLocation: destinationPath,
                Created_on: DateTime,
                Created_by: userId
            };

            const insertFileQuery = 'INSERT INTO record_files SET ?';
            await db.query(insertFileQuery, fileData);

            return res.send({ message: "File has been uploaded and data has been stored in the database." });
        })

    }
    catch (error) {
        console.error(error);
        return next(error);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1); // Or handle the rejection and keep the process alive as necessary
});

module.exports = app;
