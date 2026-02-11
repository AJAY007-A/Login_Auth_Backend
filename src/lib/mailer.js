const { Resend } = require("resend");


const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (email, resetUrl) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Using default for testing to ensure delivery (unless verified domain)
      to: email, // Resend free tier only sends to the account owner's email unless domain verified
      subject: "Reset your password",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset</h2>
            <p>You requested to reset your password.</p>
            <p>Click the link below to reset it:</p>
            <a href="${resetUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>This link expires in 60 minutes.</p>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw new Error(error.message);
    }

    console.log("✅ Reset email sent via Resend:", data);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw new Error("Email failed");
  }
};

module.exports = { sendResetEmail };