import { sendEmail } from '../services/emailService';
import { sendSMS } from '../services/smsService';
import { generateRandomCode } from './utils';

interface VerificationCode {
  code: string;
  expiresAt: Date;
}

// In-memory storage for verification codes (in production, use a database)
const verificationCodes = new Map<string, VerificationCode>();

const generateVerificationEmailHtml = (code: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email</h2>
      <p style="color: #666; font-size: 16px;">
        Thank you for signing up! Please use the following verification code to complete your registration:
      </p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
      </div>
      <p style="color: #666; font-size: 14px;">
        This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
      </p>
    </div>
  `;
};

const generateVerificationSMS = (code: string): string => {
  return `Your verification code is: ${code}. This code will expire in 10 minutes. If you didn't request this, please ignore this message.`;
};

export const sendVerificationCode = async (type: 'email' | 'phone', value: string): Promise<void> => {
  // Generate a 6-digit verification code
  const code = generateRandomCode(6);
  
  // Set expiration time to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  
  // Store the code
  verificationCodes.set(value, { code, expiresAt });
  
  if (type === 'email') {
    // Send verification email
    await sendEmail(
      value,
      'Verify Your Email Address',
      generateVerificationEmailHtml(code)
    );
  } else {
    // Send verification SMS
    await sendSMS(value, generateVerificationSMS(code));
  }
};

export const verifyCode = async (value: string, code: string): Promise<boolean> => {
  const storedCode = verificationCodes.get(value);
  
  if (!storedCode) {
    return false;
  }
  
  // Check if code has expired
  if (new Date() > storedCode.expiresAt) {
    verificationCodes.delete(value);
    return false;
  }
  
  // Check if codes match
  const isValid = storedCode.code === code;
  
  // Remove the code after verification attempt
  verificationCodes.delete(value);
  
  return isValid;
}; 