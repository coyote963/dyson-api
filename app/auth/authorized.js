const jwt = require('jsonwebtoken')

export default (req, res, next) => {
    if (!ctx.query.token) {
        return ctx.body = {
            message: "JWT not provided",
            success: false
        }
    };
  

    if (jwt.verify(ctx.query.token, secret)) {
        return next();
    }

    ctx.body = {
        message: "User not authenticated",
        success: false
    }
};
