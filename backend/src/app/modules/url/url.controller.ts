import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsyncError';
import { sendResponse } from '../../../shared/sendResponse';
import Url from './url.model';
import { UrlService } from './url.service';



/**
 * Creates a shortened URL from a longer one
 * @route POST /api/shorten
 */
/**
 * Redirects from short URL to original URL
 * @route GET /:shortId
 */



// Create a shortened URL
 const createShortenUrl = catchAsync(async (req: Request, res: Response) => {
  const { originalUrl } = req.body;

  const url = await UrlService.createShortenUrl(originalUrl);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Shorten URL created successfully',
    data: {
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortId}`,
    }
  });
})

// redirect
/**
 * Redirects from short URL to original URL
 * @route GET /:shortId
 */

const  redirectToUrl = catchAsync(async (req: Request, res: Response) => {
  const { shortId } = req.params;

  const url = await UrlService.redirectToUrl(shortId);
  res.redirect(url.originalUrl);
});

// Get all URLs
 const getAllUrls = catchAsync(async (_req: Request, res: Response) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});


export const UrlController = {
  createShortenUrl,
  getAllUrls,
  redirectToUrl,
};