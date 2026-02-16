import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Notera Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your Notera password",
    html: `
      <h2>Password Reset</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  });
};
