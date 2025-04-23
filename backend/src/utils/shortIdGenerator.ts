/**
 * generate unique short ID for url shotening
 * @param {number} length - length of the short ID
 * @returns {Promise<string>} - short ID
 */

import { nanoid } from "nanoid";
import Url from "../app/modules/url/url.model";

const generateShortId = async (length: number) => {
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

throw new Error("Failed to generate short ID");
}

export default generateShortId; 

