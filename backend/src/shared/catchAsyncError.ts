import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * catchAsync is a utility function that catches errors in async functions and passes them to the next middleware
 * @param {RequestHandler} fn - The function to catch errors from
 * @returns {Promise<void>} - A promise that resolves to void
 */

const catchAsync =
    (fn: RequestHandler) =>
        async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                await fn(req, res, next);
            } catch (error) {
                next(error);
            }
        };

export default catchAsync;