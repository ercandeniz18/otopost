import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api`;

interface EmailResponse {
  message: string;
  previewUrl?: string;
}

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const response = await axios.post<EmailResponse>(`${API_URL}/send-email`, {
      to,
      subject,
      html,
    });

    if (response.data.previewUrl) {
      console.log('Preview URL:', response.data.previewUrl);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}; 