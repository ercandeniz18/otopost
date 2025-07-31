import express from 'express';
import cors from 'cors';
import { config } from '../config.js';
import { rateLimit } from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize email transporter
let transporter: nodemailer.Transporter;

const initializeEmailService = async () => {
  const testAccount = await nodemailer.createTestAccount();
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

// Initialize email service
initializeEmailService().catch(console.error);

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Log environment variables (without sensitive data)
console.log('Environment variables loaded:');
console.log('PORT:', config.PORT);
console.log('RATE_LIMIT_WINDOW_MS:', config.RATE_LIMIT_WINDOW_MS);
console.log('RATE_LIMIT_MAX_REQUESTS:', config.RATE_LIMIT_MAX_REQUESTS);

const app = express();
const router = express.Router();
const PORT = config.PORT;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// Add email sending endpoint
router.post('/send-email', async (req: express.Request, res: express.Response) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (!transporter) {
      await initializeEmailService();
    }

    const info = await transporter.sendMail({
      from: '"Your App" <noreply@yourapp.com>',
      to,
      subject,
      html,
    });

    res.json({
      message: 'Email sent successfully',
      previewUrl: nodemailer.getTestMessageUrl(info)
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

// Add SMS sending endpoint
router.post('/send-sms', async (req: express.Request, res: express.Response) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formatPhoneNumber(to),
    });

    res.json({
      message: 'SMS sent successfully',
      sid: result.sid
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

// Helper function to format phone numbers
const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (!cleaned.startsWith('1')) {
    return `+1${cleaned}`;
  }
  
  return `+${cleaned}`;
};

// Apply routes
app.use('/api', router);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${corsOptions.origin}`);
}); 