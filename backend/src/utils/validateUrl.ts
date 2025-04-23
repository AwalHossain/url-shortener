import validUrl from 'valid-url';


const isValidUrl = (url: string) => {
    if (!url) return false;

    if(!url.startsWith('http://') && !url.startsWith('https://')) {
        return !!validUrl.isWebUri(`http://${url}`);
    }

    return !!validUrl.isWebUri(url);
}


const normalizeUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
    }

    return url;
}   



export { isValidUrl, normalizeUrl };
