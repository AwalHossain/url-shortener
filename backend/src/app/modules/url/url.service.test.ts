import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import httpStatus from 'http-status';
import { AppError } from '../../../error/appError';
import generateShortId from '../../../utils/shortIdGenerator';
import { isValidUrl, normalizeUrl } from '../../../utils/validateUrl';
import Url from './url.model';
import { UrlService } from './url.service';

// --- Mock Dependencies ---

// Mock the Url model (Mongoose)
jest.mock('./url.model'); 
const MockedUrl = Url as jest.Mocked<typeof Url>; // Type assertion for mocked model

// Mock the utility functions
jest.mock('../../../utils/shortIdGenerator');
const mockedGenerateShortId = generateShortId as jest.MockedFunction<typeof generateShortId>;

jest.mock('../../../utils/validateUrl');
const mockedIsValidUrl = isValidUrl as jest.MockedFunction<typeof isValidUrl>;
const mockedNormalizeUrl = normalizeUrl as jest.MockedFunction<typeof normalizeUrl>;

// Mock the AppError class constructor if needed, but usually just checking the throw is enough.
// jest.mock('../../../error/appError');

// --- Test Suite ---

describe('UrlService', () => {
  // Reset mocks before each test to ensure isolation
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock implementations (can be overridden in specific tests)
    mockedNormalizeUrl.mockImplementation((url) => url); // Default: return url as is
    mockedIsValidUrl.mockReturnValue(true); // Default: assume valid URL
    mockedGenerateShortId.mockResolvedValue('test123'); // Default generated ID
    
    // Reset Mongoose static method mocks
    (MockedUrl.findOne as jest.Mock).mockResolvedValue(null as never); // Default: findOne returns null (not found)
    (MockedUrl.create as jest.Mock).mockResolvedValue({ 
      originalUrl: 'http://example.com',
      shortId: 'test123',
      clicks: 0,
      createdAt: new Date(),
    } as never);
  });

  describe('createShortenUrl', () => {
    const originalUrl = 'http://example.com';
    const normalizedUrl = 'http://example.com/'; // Example normalization

    test('should normalize the URL first', async () => {
      mockedNormalizeUrl.mockReturnValue(normalizedUrl);
      await UrlService.createShortenUrl(originalUrl);
      expect(mockedNormalizeUrl).toHaveBeenCalledWith(originalUrl);
    });

    test('should throw AppError if URL is invalid', async () => {
      mockedIsValidUrl.mockReturnValue(false);
      await expect(UrlService.createShortenUrl(originalUrl))
        .rejects.toThrow(AppError);
      await expect(UrlService.createShortenUrl(originalUrl))
        .rejects.toMatchObject({ statusCode: httpStatus.BAD_REQUEST, message: 'Invalid URL' });
    });

    test('should check if normalized URL already exists', async () => {
      mockedNormalizeUrl.mockReturnValue(normalizedUrl);
      await UrlService.createShortenUrl(originalUrl);
      expect(MockedUrl.findOne).toHaveBeenCalledWith({ originalUrl: normalizedUrl });
    });

    test('should return existing URL if found', async () => {
      const existingDoc = { originalUrl: normalizedUrl, shortId: 'existing1', clicks: 0, createdAt: new Date() };
      mockedNormalizeUrl.mockReturnValue(normalizedUrl);
      (MockedUrl.findOne as jest.Mock).mockResolvedValueOnce(existingDoc as never); // Mock findOne for this test

      const result = await UrlService.createShortenUrl(originalUrl);
      
      expect(result).toBe(existingDoc);
      expect(mockedGenerateShortId).not.toHaveBeenCalled();
      expect(MockedUrl.create).not.toHaveBeenCalled();
    });

    test('should generate a short ID if URL is new', async () => {
      mockedNormalizeUrl.mockReturnValue(normalizedUrl);
      (MockedUrl.findOne as jest.Mock).mockResolvedValue(null as never); // Ensure findOne returns null
      
      await UrlService.createShortenUrl(originalUrl);
      
      expect(mockedGenerateShortId).toHaveBeenCalledTimes(1);
    });

    test('should create and return a new URL document if URL is new', async () => {
      const generatedId = 'newId456';
      const newUrlDoc = { originalUrl: normalizedUrl, shortId: generatedId };
      mockedNormalizeUrl.mockReturnValue(normalizedUrl);
      (MockedUrl.findOne as jest.Mock).mockResolvedValue(null as never);
      mockedGenerateShortId.mockResolvedValue(generatedId);
      (MockedUrl.create as jest.Mock).mockResolvedValue(newUrlDoc as never); // Mock create for this test

      const result = await UrlService.createShortenUrl(originalUrl);

      expect(MockedUrl.create).toHaveBeenCalledWith({ originalUrl: normalizedUrl, shortId: generatedId });
      expect(result).toBe(newUrlDoc);
    });
  });

  describe('redirectToUrl', () => {
    const shortId = 'test123';
    const urlDoc = { originalUrl: 'http://redirect.com', shortId: shortId, clicks: 5, createdAt: new Date() };

    test('should find URL by shortId', async () => {
      // Arrange: Prevent the error by making findOne return *something* for this test
      (MockedUrl.findOne as jest.Mock).mockResolvedValue({} as never); // Return dummy object
      
      // Act
      await UrlService.redirectToUrl(shortId);
      
      // Assert
      expect(MockedUrl.findOne).toHaveBeenCalledWith({ shortId });
    });

    test('should return the URL document if found', async () => {
      (MockedUrl.findOne as jest.Mock).mockResolvedValue(urlDoc as never);
      const result = await UrlService.redirectToUrl(shortId);
      expect(result).toBe(urlDoc);
    });

    test('should throw AppError if URL not found', async () => {
      (MockedUrl.findOne as jest.Mock).mockResolvedValue(null as never); // Simulate not found
      await expect(UrlService.redirectToUrl(shortId))
        .rejects.toThrow(AppError);
      await expect(UrlService.redirectToUrl(shortId))
        .rejects.toMatchObject({ statusCode: httpStatus.NOT_FOUND, message: 'URL not found' });
    });

     // TODO: Add test for incrementing clicks if that feature is added later
  });
}); 