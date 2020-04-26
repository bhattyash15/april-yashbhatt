/*
 * @author Gaurav Kumar
 */

const nodemailer = require("nodemailer");
const config = require('../config');
const mailTransporter = nodemailer.createTransport(config.emailTransporter)

const sendVerificationEmail = async (emailId, token)=>{


    // send mail with defined transport object
    let info = await mailTransporter.sendMail({
        from: '"Fred Foo 👻" <support@vieuth.com>', // sender address
        to: emailId, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>Hello world? This is the token - '${token}' </b>` // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

};

module.exports = {sendVerificationEmail};
