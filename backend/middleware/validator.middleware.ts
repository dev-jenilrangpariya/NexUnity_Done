import { CommonResponse } from "../models/common.model";

export const validateMiddleware = (schema) => (req, res, next) => {
    let commonResponse = new CommonResponse();
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        commonResponse.message = error.message;
        commonResponse.status = 400;
        return res.status(commonResponse.status).json(commonResponse);
    }
    next();
};

export const validateMiddlewareQuery = (schema) => (req, res, next) => {
    let commonResponse = new CommonResponse();
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
        commonResponse.message = error.message;
        commonResponse.status = 400;
        return res.status(commonResponse.status).json(commonResponse);
    }
    next();
};
