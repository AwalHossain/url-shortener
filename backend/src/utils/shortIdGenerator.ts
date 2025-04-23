/**
 * generate unique short ID for url shotening
 * @param {number} length - length of the short ID
 * @returns {Promise<string>} - short ID
 */

// Import nanoid dynamically as it's an ESM module
// import { nanoid } from "nanoid"; // Original static import causes ERR_REQUIRE_ESM
import Url from "../app/modules/url/url.model";
import { AppError } from "../error/appError";

const generateShortId = async (length: number) => {
  // Dynamically import nanoid
  const { nanoid } = await import("nanoid");

  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    const shortId = nanoid(length);
    const existingUrl = await Url.findOne({ shortId });
    if (!existingUrl) {
      return shortId;
    }
    retries++;
  }

  throw new AppError("Failed to generate short ID", 500);
}

export default generateShortId; 

