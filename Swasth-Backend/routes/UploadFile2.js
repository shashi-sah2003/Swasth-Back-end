const express = require('express');
const path = require('path');
const db = require('../config/db');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

 //Mapping all the recordType with an Id which corresponds to medical_record_type table
 const recordTypeMap = {
    'Symptom': 1,
    'Test_report': 2,
    'Prescription': 3,
    'Medicine': 4
}

app.post('/upload', async (req, res, next) => {
  try {
    const data = req.body;

    // Ensure that the request has a file attached
    if (!data.file) {
      const error = new Error("Please upload a file");
      error.statusCode = 400;
      throw error;
    }

    //fetching all the relevant data for record_files table
    const file = data.file;
    const userId = data.userId;
    const datetimestamp = data.DateTime;
    const filename = `${userId}_${datetimestamp}`;
    const generatedUuid = uuidv4();

    let fileData = {
      Medical_record_id: generatedUuid,
      original_file_name: file.originalname,
      modified_file_name: filename,
      Status: 'ACTIVE',
      Created_on: datetimestamp,
      Created_by: userId,
    };

    // Extract the file extension from the original filename
    const originalFilename = file.originalname;
    const fileExtension = originalFilename.slice(((originalFilename.lastIndexOf(".") - 1) >>> 0) + 2);

    const destinationPath = `/home/team_swasth/Swasth_FileUpload/File/${filename}.${fileExtension}`;

    // Decode the base64 data and write the file to disk
    const fileBuffer = Buffer.from(file.data, 'base64');
    await fs.promises.writeFile(destinationPath, fileBuffer);

    fileData.File_location = destinationPath;

    const query = 'INSERT INTO record_files SET ?';
    await db.query(query, fileData);

    //Inserting details into medical_record table

    //const recordtype =  data.recordtype
    const record_type_id = 2
    const details = data.Description
    Created_on = data.DateTime
    Created_by = data.userId

    if(!record_type_id){
        console.error("Record_type not found in the dictionary")
        return;
    }

    
    const insertmedicalrecord = "INSERT INTO medical_record (User_id, Record_type_id, Details, Created_on, Created_by) VALUES (?,?,?,?,?)";
    db.query(insertmedicalrecord, [userId, record_type_id, details, Created_on, Created_by], (error, results, fields) => {
        if (error){
            console.error("Error inserting into Medical_Record" + error);
            return;
        }
        console.log("Record inserted successfully");
    })

    return res.send("File has been uploaded and data has been stored in the record_files and medical_record table.");

  } 
  catch (error) {
    console.error(error);
    next(error);
  }
});

  
//   // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', reason.stack || reason);
    // Handle the rejection here
    process.exit(1); // Terminate the Node.js process with a non-zero exit code
  });
  

module.exports = app;