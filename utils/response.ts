import { StatusCode } from "./statuscode";

export const sendSuccess = (res: any, message: string,data:Record<string, any> ) => {
    return res.status(StatusCode.SUCCESS).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (res: any, status: number, message: string, err: unknown) => {
    return res.status(status).json({
        success: false,
        message,
    });
};
