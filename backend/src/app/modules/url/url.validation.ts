import { z } from 'zod';

const createShortenUrlSchema = z.object({
  body: z.object({
    originalUrl: z.string({
        required_error: 'Original URL is required',
      }).url({ message: "Invalid URL format" }),
  }),
});

const redirectToUrlSchema = z.object({
    params: z.object({
        shortId: z.string({
            required_error: 'Short ID is required',
        }),
    }),
});


export const UrlValidation = {
    createShortenUrlSchema,
    redirectToUrlSchema,
}; 