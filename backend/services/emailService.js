import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  const transporter = createTransporter();

  const frontendBaseUrl =
    process.env.CLIENT_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const base = frontendBaseUrl.replace(/\/+$/, "");
  const resetURL = `${base}/reset-password/${resetToken}`;

  const message = `
    <h2>Password Reset Request</h2>
    <p>You have requested a password reset for your Digital Talk account.</p>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetURL}" style="
      background-color: #FF9130;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      display: inline-block;
      margin: 20px 0;
    ">Reset Password</a>
    <p>This link will expire in 10 minutes.</p>
    <p>If you did not request this reset, please ignore this email.</p>
    <br>
    <p>Best regards,<br>Digital Talk Team</p>
  `;

  const mailOptions = {
    from: `"Digital Talk" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset Request - Digital Talk",
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, message: "Email sending failed" };
  }
};

