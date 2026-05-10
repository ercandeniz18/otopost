import { describe, it, expect, beforeEach, vi } from 'vitest';
import { sendVerificationCode, verifyCode } from '../utils/emailVerification';
import * as emailService from '../services/emailService';
import * as smsService from '../services/smsService';

vi.mock('../services/emailService', () => ({
  sendEmail: vi.fn(),
}));

vi.mock('../services/smsService', () => ({
  sendSMS: vi.fn(),
}));

describe('emailVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendVerificationCode', () => {
    it('should send verification email when type is email', async () => {
      const mockSendEmail = vi.mocked(emailService.sendEmail);
      const email = 'test@example.com';
      
      await sendVerificationCode('email', email);
      
      expect(mockSendEmail).toHaveBeenCalledWith(
        email,
        'Verify Your Email Address',
        expect.stringContaining('Verify Your Email')
      );
    });

    it('should send verification SMS when type is phone', async () => {
      const mockSendSMS = vi.mocked(smsService.sendSMS);
      const phone = '+1234567890';
      
      await sendVerificationCode('phone', phone);
      
      expect(mockSendSMS).toHaveBeenCalledWith(
        phone,
        expect.stringContaining('verification code')
      );
    });

    it('should generate a 6-digit code', async () => {
      const email = 'test@example.com';
      
      await sendVerificationCode('email', email);
      
      const sentHtml = (emailService.sendEmail as any).mock.calls[0][2];
      const codeMatch = sentHtml.match(/>(\d{6})</);
      expect(codeMatch).toBeTruthy();
      expect(codeMatch![1]).toHaveLength(6);
    });
  });

  describe('verifyCode', () => {
    it('should return true for valid code', async () => {
      const email = 'test@example.com';
      
      await sendVerificationCode('email', email);
      
      const sentHtml = (emailService.sendEmail as any).mock.calls[0][2];
      const codeMatch = sentHtml.match(/>(\d{6})</);
      const code = codeMatch![1];
      
      const result = await verifyCode(email, code);
      expect(result).toBe(true);
    });

    it('should return false for invalid code', async () => {
      const email = 'test@example.com';
      
      await sendVerificationCode('email', email);
      
      const result = await verifyCode(email, '000000');
      expect(result).toBe(false);
    });

    it('should return false for non-existent code', async () => {
      const result = await verifyCode('nonexistent@example.com', '123456');
      expect(result).toBe(false);
    });

    it('should invalidate code after successful verification', async () => {
      const email = 'test@example.com';
      
      await sendVerificationCode('email', email);
      
      const sentHtml = (emailService.sendEmail as any).mock.calls[0][2];
      const codeMatch = sentHtml.match(/>(\d{6})</);
      const code = codeMatch![1];
      
      const firstResult = await verifyCode(email, code);
      expect(firstResult).toBe(true);
      
      const secondResult = await verifyCode(email, code);
      expect(secondResult).toBe(false);
    });

    it('should return false for expired code', async () => {
      const email = 'test@example.com';
      
      await sendVerificationCode('email', email);
      
      const sentHtml = (emailService.sendEmail as any).mock.calls[0][2];
      const codeMatch = sentHtml.match(/>(\d{6})</);
      const code = codeMatch![1];
      
      vi.useFakeTimers();
      vi.advanceTimersByTime(11 * 60 * 1000);
      
      const result = await verifyCode(email, code);
      expect(result).toBe(false);
      
      vi.useRealTimers();
    });
  });
});
