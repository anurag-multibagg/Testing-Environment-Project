const mailer = require("nodemailer");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const sendMail = async () => {
    try {
        console.log("3");

        const metricsTestCoverageHTML = fs.readFileSync('./coverage/test-report.html', 'utf-8');
        const testCasesHTML = fs.readFileSync('./coverage/lcov-report/index.html', 'utf-8');

        const transporter = mailer.createTransport({
            host: "smtp.zoho.in",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const istDate = new Date(Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: `Tests Report/Coverage ${istDate}`,
            html: `${testCasesHTML}<br/><hr/><br/>${metricsTestCoverageHTML}`
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
    } catch (error) {
        console.log('❌ Error sending email:', error.message);
    }
};

module.exports = { sendMail };
































