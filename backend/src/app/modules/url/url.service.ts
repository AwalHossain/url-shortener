import { AppError } from "../../../error/appError";
import generateShortId from "../../../utils/shortIdGenerator";
import { isValidUrl, normalizeUrl } from "../../../utils/validateUrl";
import Url from "./url.model";



const createShortenUrl = async (originalUrl: string) => {
    
    originalUrl = normalizeUrl(originalUrl);

    // check if the url is valid
    if(!isValidUrl(originalUrl)) {
        throw new AppError('Invalid URL', 400);
    }

    // check if the url is already shortened
    const existingUrl = await Url.findOne({ originalUrl });
    if(existingUrl) {
        return existingUrl;
    }

    // create a new short ID using the atomic counter method
    const shortId = await generateShortId();

    // create a new url
    const newUrl = await Url.create({ originalUrl, shortId });

    return newUrl;
};


const redirectToUrl = async (shortId: string) => {
    const url = await Url.findOne({ shortId });
    if(!url) {
        throw new AppError('URL not found', 404);
    }
    return url;
}





export const UrlService = {
    createShortenUrl,
    redirectToUrl,
}