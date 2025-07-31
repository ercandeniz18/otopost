import twilio from 'twilio';

// In a real application, these would be environment variables
const TWILIO_ACCOUNT_SID = 'your_account_sid';
const TWILIO_AUTH_TOKEN = 'your_auth_token';
const TWILIO_PHONE_NUMBER = 'your_twilio_phone_number';

// Create a test mode flag
const IS_TEST_MODE = process.env.NODE_ENV !== 'production';

// Initialize Twilio client
let twilioClient: twilio.Twilio | null = null;

const initializeSMSService = () => {
  if (!IS_TEST_MODE) {
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  }
};

export const sendSMS = async (to: string, message: string): Promise<void> => {
  if (IS_TEST_MODE) {
    // In test mode, just log the message
    console.log('SMS Preview:');
    console.log('To:', to);
    console.log('Message:', message);
    console.log('---');
    return;
  }

  if (!twilioClient) {
    initializeSMSService();
  }

  try {
    if (!twilioClient) {
      throw new Error('SMS service not initialized');
    }

    await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: formatPhoneNumber(to),
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('Failed to send SMS');
  }
};

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