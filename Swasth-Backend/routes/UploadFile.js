const express = require('express');
const path = require('path');
const db = require('../config/db');
const bodyParser = require('body-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post('/upload', async (req, res, next) => {
  try {
    const data = req.body;

    // Ensure that the request has a file attached
    if (!data.file) {
      const error = new Error("Please upload a file");
      error.statusCode = 400;
      throw error;
    }

    
    const file = data.file;
    const userId = data.userId;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const filename = `${userId}_${timestamp}`;
    const generatedUuid = uuidv4();
    const desc = data.Description;
    let fileData = {
      Medical_record_id: generatedUuid,
      original_file_name: file.originalname,
      modified_file_name: filename,
      Status: 'ACTIVE',
      Created_on: data.DateTime,
      Created_by: userId,
      Description: desc
    };
    console.log(fileData);
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

    return res.send("File has been uploaded and data has been stored in the record_files table.");
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
