import { describe, expect, test } from '@jest/globals';
import { isValidUrl, normalizeUrl } from './validateUrl';

describe('URL Validation Utilities', () => {

  describe('normalizeUrl', () => {
    test('should add https:// if no protocol is present', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
      expect(normalizeUrl('www.example.com/path?query=1')).toBe('https://www.example.com/path?query=1');
    });

    test('should keep https:// if present', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    });

    test('should keep https:// if present', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    });

    test('should handle URLs with paths, queries, and fragments', () => {
      expect(normalizeUrl('example.com/some/path?q=test#fragment')).toBe('https://example.com/some/path?q=test#fragment');
      expect(normalizeUrl('https://example.com/some/path?q=test#fragment')).toBe('https://example.com/some/path?q=test#fragment');
    });

    test('should handle already normalized URLs', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
      expect(normalizeUrl('https://sub.example.com/path')).toBe('https://sub.example.com/path');
    });

    // Optional: Add tests for specific normalization rules if implemented
    // e.g., removing trailing slashes, www prefix handling, case normalization
    // test('should remove trailing slash', () => {
    //   expect(normalizeUrl('http://example.com/')).toBe('http://example.com');
    // });
  });

  describe('isValidUrl', () => {
    // These tests depend on the underlying implementation (validator.isURL or valid-url)
    // Adjust based on the library used and its options.

    test('should return true for valid http/https URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path?query=value#hash')).toBe(true);
      expect(isValidUrl('https://subdomain.example.co.uk:8080')).toBe(true);
    });

    test('should return false for URLs without protocol (unless normalization happens first)', () => {
       // Assuming isValidUrl is called *after* normalizeUrl, this might pass if normalizeUrl adds http://
       // If isValidUrl is meant to be strict on its own, it should fail these:
       expect(isValidUrl('example.com')).toBe(false); 
       expect(isValidUrl('www.google.com')).toBe(false);
    });

    test('should return false for invalid protocols', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('file:///path/to/file')).toBe(false);
      expect(isValidUrl('mailto:test@example.com')).toBe(false);
    });

    test('should return false for invalid strings', () => {
      expect(isValidUrl('just some text')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('http:// example.com')).toBe(false); // Space
      expect(isValidUrl('')).toBe(false);
      // expect(isValidUrl(null)).toBe(false); // Depends on implementation
      // expect(isValidUrl(undefined)).toBe(false); // Depends on implementation
    });
  });

}); 