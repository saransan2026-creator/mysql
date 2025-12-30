export const sendSuccess = (res: any, message: string, data: any = {}) => {
    return res.status(200).json({
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
