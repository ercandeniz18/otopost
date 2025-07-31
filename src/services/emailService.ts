import nodemailer from 'nodemailer';

// Create a test account for development
// In production, you would use your actual SMTP credentials
let transporter: nodemailer.Transporter;

export const initializeEmailService = async () => {
  // Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  // Create a transporter using the test account
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  if (!transporter) {
    await initializeEmailService();
  }

  try {
    const info = await transporter.sendMail({
      from: '"Your App" <noreply@yourapp.com>',
      to,
      subject,
      html,
    });

    // Log the preview URL (only available in development with Ethereal)
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
};

// Initialize the email service when the app starts
initializeEmailService().catch(console.error); 