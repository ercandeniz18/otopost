import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateRandomCode } from '../utils/utils';

describe('generateRandomCode', () => {
  it('should generate a code with the specified length', () => {
    const length = 6;
    const code = generateRandomCode(length);
    expect(code).toHaveLength(length);
  });

  it('should generate only numeric characters', () => {
    const length = 10;
    const code = generateRandomCode(length);
    expect(code).toMatch(/^\d+$/);
  });

  it('should generate different codes on each call', () => {
    const code1 = generateRandomCode(6);
    const code2 = generateRandomCode(6);
    expect(code1).not.toBe(code2);
  });

  it('should handle length of 0', () => {
    const code = generateRandomCode(0);
    expect(code).toBe('');
  });

  it('should handle large lengths', () => {
    const length = 100;
    const code = generateRandomCode(length);
    expect(code).toHaveLength(length);
    expect(code).toMatch(/^\d+$/);
  });
});
