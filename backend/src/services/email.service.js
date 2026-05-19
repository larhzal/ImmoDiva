const nodemailer = require("nodemailer");

console.log("Brevo config:", {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER ? "OK" : "MISSING",
  pass: process.env.MAIL_PASS ? "OK" : "MISSING"
});

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, 
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: "ImmoDiva <sgrnassira@gmail.com>",
      to,
      subject,
      text,
      html,
    });

    console.log("Email envoyé via Brevo");
  } catch (err) {
    console.error("Erreur envoi email:", err);
    throw err;
  }
};
