const nodemailer = require('nodemailer');

const sendEmail = async (toEmail, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',  // You can use any email service
    auth: {
      user: 'annanitababu.19@gmail.com',  // Replace with your email
      pass: 'Godslove!234',  // Replace with your email password (or use an app-specific password)
    },
  });

  let info = await transporter.sendMail({
    from: '"Healthcare System" annanitababu.19@gmail.com',
    to: toEmail,
    subject: subject,
    text: text,
  });

  return info;
};

module.exports = sendEmail;
