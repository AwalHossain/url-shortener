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
      expect(encodeToBase62(62)).toBe('10');
      expect(encodeToBase62(63)).toBe('11');
      expect(encodeToBase62(1000)).toBe('g8');
      expect(encodeToBase62(3844)).toBe('100');
    });

    test('should handle large numbers', () => {
      const largeNumber = 1 * (62 ** 5) + 2 * (62 ** 4) + 3 * (62 ** 3) + 4 * (62 ** 2) + 5 * (62 ** 1) + 6 * (62 ** 0);
      expect(encodeToBase62(largeNumber)).toBe('123456');
    });

    // Optional test for negative numbers
    // test('should handle negative numbers appropriately ...', () => {
    //   ...
    // });
  });

  // Optional tests for decodeFromBase62
  // describe('decodeFromBase62', () => {
  //   ...
  // });
}); 