const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

const sendMail = async({to, subject, html}) => {
    const mailOptions = {
        from: `"Eldab3 Store" <${process.env.EMAIL}>`,
        to,
        subject,
        html
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendMail;