const ERRORHelper = require('../utils/error.helper');
const statusHelper = require('../utils/status.helper');

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = ERRORHelper.create('Access denied', 403,statusHelper.FAIL);
            return next(error);
        }
        next();
    }
}
