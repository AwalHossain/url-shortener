import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { NextFunction, Request, Response } from 'express'; // Import Express types
import httpStatus from 'http-status';
// import catchAsync from '../../../shared/catchAsyncError'; // No longer mocking catchAsync directly
import { sendResponse } from '../../../shared/sendResponse'; // Import the response utility
import { UrlController } from './url.controller';
import Url from './url.model';
import { UrlService } from './url.service';


// Mock UrlService
jest.mock('./url.service');
const MockedUrlService = UrlService as jest.Mocked<typeof UrlService>;

// Mock catchAsync to simply return the function passed to it
// This allows us to test the controller logic *before* catchAsync interferes
// jest.mock('../../../shared/catchAsyncError'); 
// (catchAsync as jest.Mock).mockImplementation((fn) => fn); 

// Mock sendResponse utility
jest.mock('../../../shared/sendResponse');
const mockedSendResponse = sendResponse as jest.MockedFunction<typeof sendResponse>;

// Mock Url model (for getAllUrls, if testing it)
jest.mock('./url.model');
const MockedUrl = Url as jest.Mocked<typeof Url>;


// Helper to create mock Request and Response objects
const createMockReqRes = () => {
  const req = {
    body: {},
    params: {},
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:3000'), 
  } as unknown as Request; 

  const res = {
    status: jest.fn().mockReturnThis(), // Chainable status
    json: jest.fn().mockReturnThis(),   // Chainable json
    redirect: jest.fn(),              // Mock redirect
  } as unknown as Response; // Use unknown type assertion for partial mock
  
   const next = jest.fn();


  return { req, res, next };
};


// --- Test Suite ---

describe('UrlController', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;
  beforeEach(() => {
    jest.clearAllMocks();
    const mockReqRes = createMockReqRes();
    req = mockReqRes.req;
    res = mockReqRes.res;
    next = mockReqRes.next;
    // Reset UrlService mocks if needed (though usually set per test)
     MockedUrlService.createShortenUrl.mockResolvedValue({
       originalUrl: 'http://default.com',
       shortId: 'def123',
       clicks: 0,
       createdAt: new Date(),
     } as any); // Use 'any' or refine type if IUrl isn't directly returned
     MockedUrlService.redirectToUrl.mockResolvedValue({
       originalUrl: 'http://default-redirect.com',
       shortId: 'def456',
       clicks: 1,
       createdAt: new Date(),
     } as any);
  });

  
  describe('createShortenUrl', () => {
    test('should call UrlService.createShortenUrl with originalUrl from body', async () => {
      req.body.originalUrl = 'http://test-url.com';
      
      // Call the exported controller function directly
      await UrlController.createShortenUrl(req, res, next);
      
      expect(MockedUrlService.createShortenUrl).toHaveBeenCalledWith('http://test-url.com');
      expect(next).not.toHaveBeenCalled(); // catchAsync shouldn't call next on success
    });

    test('should call sendResponse with correct data on success', async () => {
       const serviceResult = {
         originalUrl: 'http://specific-url.com',
         shortId: 'spec1',
         clicks: 0,
         createdAt: new Date(),
       };
       const expectedShortUrl = `http://localhost:3000/spec1`; 
       req.body.originalUrl = 'http://specific-url.com';
       Object.defineProperty(req, 'protocol', { value: 'http' });
       (req.get as jest.Mock).mockReturnValue('localhost:3000'); 
       MockedUrlService.createShortenUrl.mockResolvedValue(serviceResult as any);

       // Call the exported controller function directly
       await UrlController.createShortenUrl(req, res, next);

       expect(mockedSendResponse).toHaveBeenCalledWith(res, {
         statusCode: httpStatus.OK, 
         success: true,
         message: 'Shorten URL created successfully',
         data: {
           originalUrl: serviceResult.originalUrl,
           shortId: serviceResult.shortId,
           shortUrl: expectedShortUrl,
         },
       });
       expect(next).not.toHaveBeenCalled(); // catchAsync shouldn't call next on success
    });

     // Note: Testing validation errors (like missing originalUrl) should ideally
     // be done by testing the validateRequest middleware separately or via integration tests.
     // Unit testing the controller assumes validation has passed.
  });

  describe('redirectToUrl', () => {
     test('should call UrlService.redirectToUrl with shortId from params', async () => {
       req.params.shortId = 'testId1';
       await UrlController.redirectToUrl(req, res, next);
       expect(MockedUrlService.redirectToUrl).toHaveBeenCalledWith('testId1');
       expect(next).not.toHaveBeenCalled();
     });

     test('should call res.redirect with the originalUrl from service result', async () => {
       const serviceResult = {
         originalUrl: 'http://redirect-target.com',
         shortId: 'testId2',
         clicks: 1,
         createdAt: new Date(),
       };
       req.params.shortId = 'testId2';
       MockedUrlService.redirectToUrl.mockResolvedValue(serviceResult as any);
       
       await UrlController.redirectToUrl(req, res, next);

       expect(res.redirect).toHaveBeenCalledWith(serviceResult.originalUrl);
       expect(next).not.toHaveBeenCalled();
     });

   
      test('should call next with error if service throws error', async () => {
        req.params.shortId = 'notFoundId';
        const error = new Error('Simulated service error');
        MockedUrlService.redirectToUrl.mockRejectedValue(error as never);

        // Act: Call the controller function
        await UrlController.redirectToUrl(req, res, next);

        // Assert: Check that next was called with the error
        expect(next).toHaveBeenCalledWith(error);
        // Assert: Check that redirect was NOT called
        expect(res.redirect).not.toHaveBeenCalled();
      });
  });



}); 