const nodemailer = require('nodemailer');

// Use 'service: gmail' for better reliability with Gmail App Passwords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : undefined,
  },
  family: 4, // Force IPv4 to avoid ENETUNREACH errors on some networks
});

// Verify connection on startup
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email Server Error:', error);
  } else {
    console.log('✅ Email Server Response: Ready to send emails');
  }
});

const sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  console.log('Sending reset email to:', email);
  console.log('Reset URL:', resetUrl);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'SYSTEM ALERT: Password Reset Protocol',
    html: `
      <div style="background-color: #020205; font-family: 'Courier New', Courier, monospace; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0a0a0f; border: 1px solid #1a1a1f; box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);">
          
          <!-- Hader Border -->
          <div style="height: 4px; background: linear-gradient(90deg, #00F0FF, #FF3366); width: 100%;"></div>

          <div style="padding: 40px;">
            <!-- Logo / Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="color: #00F0FF; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);">
                SYSTEM // RECOVERY
              </span>
            </div>

            <!-- Content -->
            <div style="border: 1px solid #333; padding: 30px; background-color: #050508; text-align: center;">
              <h2 style="color: #fff; margin-top: 0; font-size: 18px; letter-spacing: 2px; text-transform: uppercase;">Identity Verification Required</h2>
              
              <p style="color: #888; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                A sequence to reset your secure access credentials has been initiated for <span style="color: #fff;">${email}</span>.
                <br><br>
                Execute the protocol below to establish new credentials.
              </p>

              <!-- Button -->
              <a href="${resetUrl}" style="display: inline-block; background-color: #00F0FF; color: #000; padding: 15px 35px; text-decoration: none; font-weight: bold; font-family: monospace; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border: 1px solid #00F0FF;">
                > INITIALIZE_RESET
              </a>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #555; font-size: 12px;">
                Token Expiration: 60 Minutes<br>
                Status: PENDING
              </p>
              <p style="color: #333; font-size: 10px; margin-top: 20px; text-transform: uppercase; letter-spacing: 1px;">
                Secure Transmission v4.0.1 // encrypted
              </p>
            </div>

          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error; // Re-throw to be handled by the controller
  }
};

module.exports = { sendResetEmail };