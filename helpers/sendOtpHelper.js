const nodemailer = require("nodemailer");

const otpSender = async (name, email, otp) => {
  try {
    console.log(process.env.EMAIL);
    console.log(process.env.PASSWORD);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const info = await transporter.sendMail({
      from: '"Aech Computers "<aech@gmail.com>',
      to: `${email}`,
      subject: "OTP for verification",
      html: `<h2>Hi ${name}</h2><br/><p>Your OTP for verification is</p><h4> ${otp}</h4>`,
    });

    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = otpSender;