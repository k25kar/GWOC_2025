import nodemailer from "nodemailer";

// Configure the email transport using your email provider (Gmail, SendGrid, etc.)
export const sendResetEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: "your-email-service",  // e.g., 'gmail', 'sendgrid', etc.
    auth: {
      user: process.env.EMAIL_USER,  // Your email address
      pass: process.env.GMAIL_APP_PASSWORD,  // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,    // Your email address
    to: email,                       // Recipient email address
    subject: "Password Reset",       // Email subject
    text: `Click the following link to reset your password: ${resetLink}`, // Reset link in the email body
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Email sending failed");
  }
};
