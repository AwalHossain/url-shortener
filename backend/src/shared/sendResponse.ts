import { Response } from "express";

/**
 * sendResponse is a utility function that sends a response to the client
 * @param {Response} res - The response object
 * @param {IApiRespoonse<T>} data - The data to send to the client
 */

type IApiRespoonse<T> = {
    statusCode: number,
    success: boolean,
    message?: string | null,
    data?: T | null,
    meta?: {
        page?: number,
        limit?: number,
        skip?: number,
    } | null


}


export const sendResponse = <T>(res: Response, data: IApiRespoonse<T>): void => {

    const responseData: IApiRespoonse<T> = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message || null,
        data: data.data || null,
        meta: data.meta || null,
    }

    res.status(data.statusCode).json(responseData);

}