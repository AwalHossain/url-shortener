/**
 * generate unique short ID for url shotening
 * @param {number} length - length of the short ID
 * @returns {Promise<string>} - short ID
 */

// Import nanoid dynamically as it's an ESM module
// import { nanoid } from "nanoid"; // Static import causes ERR_REQUIRE_ESM in CJS context
import httpStatus from "http-status";
// import { nanoid } from 'nanoid'; // Remove this static import again
import Counter from "../app/models/counter.model"; // Import the Counter model
import { AppError } from "../error/appError";
import { encodeToBase62 } from "./base62"; // Import the base62 encoder

const COUNTER_ID = 'url_count'; // Define a constant for the counter ID

const generateShortId = async (): Promise<string> => {
  try {
    // Atomically find the counter document and increment its sequence value.
    // - {_id: COUNTER_ID}: Find the document with this ID.
    // - {$inc: {seq: 1}}: Increment the 'seq' field by 1.
    // - {new: true}: Return the document *after* the update.
    // - {upsert: true}: If the document doesn't exist, create it with seq: 1.
    const counter = await Counter.findOneAndUpdate(
      { _id: COUNTER_ID },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (!counter) {
      // This should theoretically not happen with upsert: true, but good to check.
      throw new AppError('Failed to retrieve counter sequence', httpStatus.INTERNAL_SERVER_ERROR);
    }

    // Encode the new sequence number to base-62
    const shortId = encodeToBase62(counter.seq);

    return shortId;
  } catch (error) {
    console.error("Error generating short ID:", error);

    // If it's already an AppError, just re-throw it
    if (error instanceof AppError) {
        throw error;
    }
    
    // Otherwise, wrap it in a generic internal error AppError
    throw new AppError('Failed to generate short ID due to internal error', httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default generateShortId; 

