module.exports = {
    // database: "mongodb://localhost:27017/vieuth",
    database:"mongodb+srv://vieuth:Uj9xqjdQ2zsnunav@vieuth-yiwjq.mongodb.net/test?retryWrites=true&w=majority",
    sendOtpAuthKey: 'sendotp_autkey_here',
    emailTransporter: {
        service: 'gmail',
        auth: {
            user: "icon.gaurav806@gmail.com",
            pass: "zrnrhakfvqpeafwt"
        }
    },
    jwt:{
        secret:'vieuth_secret',
        expiresIn: 600
    }
};
