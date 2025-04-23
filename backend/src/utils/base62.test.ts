import { describe, expect, test } from '@jest/globals';
import { encodeToBase62 } from './base62';

describe('Base62 Encoding', () => {
  describe('encodeToBase62', () => {
    test('should encode 0 correctly', () => {
      expect(encodeToBase62(0)).toBe('0');
    });

    test('should encode single-digit numbers correctly', () => {
      expect(encodeToBase62(1)).toBe('1');
      expect(encodeToBase62(9)).toBe('9');
      expect(encodeToBase62(10)).toBe('a');
      expect(encodeToBase62(35)).toBe('z');
      expect(encodeToBase62(36)).toBe('A');
      expect(encodeToBase62(61)).toBe('Z');
    });

    test('should encode numbers resulting in multi-character strings', () => {
      expect(encodeToBase62(62)).toBe('10'); // 1*62^1 + 0*62^0
      expect(encodeToBase62(63)).toBe('11'); // 1*62^1 + 1*62^0
      expect(encodeToBase62(1000)).toBe('g8'); // 16*62^1 + 8*62^0 = 992 + 8 = 1000
      expect(encodeToBase62(3844)).toBe('100'); // 1*62^2 + 0*62^1 + 0*62^0 = 3844
    });

    test('should handle large numbers', () => {
      // Example: A large number corresponding to a 6-character shortId
      const largeNumber = 1 * (62 ** 5) + 2 * (62 ** 4) + 3 * (62 ** 3) + 4 * (62 ** 2) + 5 * (62 ** 1) + 6 * (62 ** 0);
      // Corresponds to base-62 string "123456"
      expect(encodeToBase62(largeNumber)).toBe('123456');
    });

    // Optional: Add test for negative numbers if your use case might involve them,
    // although the current implementation assumes positive integers based on the counter.
    // test('should handle negative numbers appropriately (e.g., throw error or return specific value)', () => {
    //   // expect(() => encodeToBase62(-1)).toThrow(); // Depending on desired behavior
    // });
  });

  // Optional: Add tests for decodeFromBase62 if you uncomment and use it
  // describe('decodeFromBase62', () => {
  //   // ... tests for decoder ...
  // });
}); 