const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('./db.js');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = "/home/team_swasth/Swasth_FileUpload/File";
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const username = req.body.username;
  
      const UserId = "SELECT user_id FROM registration WHERE email = ?";
      db.query(UserId, [username], async (err, result) => {
        if (err) {
          console.error(err);
          return cb(err);
        }
  
        if (result.length === 0) {
          const error = new Error("User not found");
          error.statusCode = 404;
          return cb(error);
        }
  
        const userid = result[0].user_id;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Extract the file extension from the original filename
        const originalFilename = file.originalname;
        const fileExtension = originalFilename.slice(((originalFilename.lastIndexOf(".") - 1) >>> 0) + 2);

        const filename = `${userid}_${timestamp}.${fileExtension}`;
        cb(null, filename);
      });
    },
  });
  
  const upload = multer({ storage: storage });
  
  app.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
      const file = req.file;
      if (!file) {
        const error = new Error("Please upload a file");
        error.statusCode = 400;
        throw error;
      }
  
      const username = req.body.username;
      const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const filename = `${username}_${timestamp}`; // Fixing the filename
  
      const generatedUuid = uuidv4();
  
      let fileData = {
        Medical_record_id: generatedUuid,
        original_file_name: file.originalname,
        modified_file_name: file.filename,
        Status: 'Active',
        Created_on: new Date().toISOString().slice(0, 19).replace('T', ' '),
        Created_by: username,
      };
  
      if (file.path) {
        fileData.File_location = file.path;
      } else {
        const buffer = file.buffer;
        const destinationPath = `/home/team_swasth/Swasth_FileUpload/File/${filename}`;
        fs.writeFileSync(destinationPath, buffer);
        fileData.File_location = destinationPath;
      }
  
      const query = 'INSERT INTO record_files SET ?';
      await db.query(query, fileData);
  
      return res.send("File has been uploaded and data has been stored in the record_files table.");
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', reason.stack || reason);
    // Handle the rejection here
    process.exit(1); // Terminate the Node.js process with a non-zero exit code
  });
  

module.exports = app;