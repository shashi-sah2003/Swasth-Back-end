const cron = require('node-cron');
const db = require('./db');

//Scheduling a task to run every hour to delete the expired otps
const otpDeletionScheduler = () => {
    cron.schedule('0 * * * *', function(){
        console.log('Running a task every hour to clean up expired OTPs');
        const deleteExpiredOtps =  'DELETE from otps  where Timestamp < NOW() - INTERVAL 1 MINUTE';
        db.query(deleteExpiredOtps, (err,results) => {
            if(err){
                console.error('Error deleting expired OTPs:',err);
            }
            else{
                console.log('Expired OTPs deleted successfully');
            }
        });
    });
};

module.exports = otpDeletionScheduler;