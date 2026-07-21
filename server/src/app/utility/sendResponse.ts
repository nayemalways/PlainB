

export const sendResponse = (res, {success, statusCode, message, data}) => {
    res.status(statusCode).json({
        success,
        statusCode,
        message,
        data
    })
}