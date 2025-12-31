import { StatusCode } from "./statuscode";

export const sendSuccess = (res: any, message: string, p0: { email: any }) => {
    return res.status(StatusCode.SUCCESS).json({
        success: true,
        message,
    });
};

export const sendError = (res: any, status: number, message: string) => {
    return res.status(status).json({
        success: false,
        message,
    });
};
