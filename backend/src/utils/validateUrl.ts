import validator from 'validator';


const isValidUrl = (url: string): boolean => {
    if (!url) return false;

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return false;
    }

    // Use the provided regex for validation
    const isValid = validator.isURL(url);
    return isValid;
}


const normalizeUrl = (url: string): string => {
    if (!url) return ''; // Handle empty string case

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`; // Default to https
    }

    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }

    return url;
}   



export { isValidUrl, normalizeUrl };
