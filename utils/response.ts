import { StatusCode } from './Statuscode';

export const sendSuccess =<T> (res: any, message: string, data?:T |  null, user?: any) => {
    return res.status(StatusCode.SUCCESS).json({
        success: true,
        message,
        data,
        user,
    });
};

export const sendError = (res: any, status: number, message: string, err: unknown) => {
    return res.status(status).json({
        success: false,
        message,

    });
};
