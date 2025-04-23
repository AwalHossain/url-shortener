import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import httpStatus from 'http-status';
import Counter from '../app/models/counter.model';
import { AppError } from '../error/appError';
import { encodeToBase62 } from './base62';
import generateShortId from './shortIdGenerator';

jest.mock('../app/models/counter.model');
const MockedCounter = Counter as jest.Mocked<typeof Counter> & { 
  findOneAndUpdate: jest.Mock 
};

jest.mock('./base62');
const mockedEncodeToBase62 = encodeToBase62 as jest.MockedFunction<typeof encodeToBase62>;

describe('generateShortId Utility', () => {
  const COUNTER_ID = 'url_count';

  beforeEach(() => {
    jest.clearAllMocks();
    MockedCounter.findOneAndUpdate.mockResolvedValue({ _id: COUNTER_ID, seq: 1 } as never);
    mockedEncodeToBase62.mockReturnValue('1');
  });

  test('should call Counter.findOneAndUpdate with correct parameters', async () => {
    await generateShortId();

    expect(MockedCounter.findOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(MockedCounter.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: COUNTER_ID }, 
      { $inc: { seq: 1 } }, 
      { new: true, upsert: true, setDefaultsOnInsert: true } 
    );
  });

  test('should call encodeToBase62 with the sequence number returned by findOneAndUpdate', async () => {
    const mockSequence = 123;
    MockedCounter.findOneAndUpdate.mockResolvedValue({ _id: COUNTER_ID, seq: mockSequence } as never);
    
    await generateShortId();

    expect(mockedEncodeToBase62).toHaveBeenCalledTimes(1);
    expect(mockedEncodeToBase62).toHaveBeenCalledWith(mockSequence);
  });

  test('should return the result from encodeToBase62', async () => {
    const expectedShortId = 'g8';
    MockedCounter.findOneAndUpdate.mockResolvedValue({ _id: COUNTER_ID, seq: 1000 } as never);
    mockedEncodeToBase62.mockReturnValue(expectedShortId);

    const result = await generateShortId();

    expect(result).toBe(expectedShortId);
  });

  test('should throw AppError if Counter.findOneAndUpdate fails', async () => {
    const dbError = new Error('Database connection lost');
    MockedCounter.findOneAndUpdate.mockRejectedValue(dbError as never);

    await expect(generateShortId())
      .rejects.toThrow(AppError);
    await expect(generateShortId())
      .rejects.toMatchObject({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate short ID due to internal error'
      });
    
    // Optionally check if the error was logged (requires spying on console.error)
    // const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // await expect(generateShortId()).rejects.toThrow();
    // expect(consoleSpy).toHaveBeenCalledWith("Error generating short ID:", dbError);
    // consoleSpy.mockRestore();
  });

  test('should throw AppError if Counter.findOneAndUpdate resolves to null/undefined (unexpected)', async () => {
    MockedCounter.findOneAndUpdate.mockResolvedValue(null as never);

    try {
      await generateShortId();
      // If it doesn't throw, fail the test explicitly (optional but good practice)
      throw new Error('Failed to retrieve counter sequence');
    } catch (error) {
      // console.log('>>> Actual error caught:', error);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toHaveProperty('statusCode', httpStatus.INTERNAL_SERVER_ERROR);
      // Compare against the actual message you see in the log
      expect(error).toHaveProperty('message', 'Failed to retrieve counter sequence'); // Or whatever the actual message is
    }
  });
}); 