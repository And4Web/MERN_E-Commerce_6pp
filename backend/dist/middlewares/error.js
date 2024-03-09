export const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "Undefined Error or Bad Request or Internal Server Error");
    err.statusCode || (err.statusCode = 500);
    return res
        .status(err.statusCode)
        .json({ success: false, message: `Error: ${err.message}` });
};
export const TryCatch = (controllerFunc) => (req, res, next) => {
    return Promise.resolve(controllerFunc(req, res, next)).catch(err => next(err));
};
