const ERRORHelper = require('../utils/error.helper');
const statusHelper = require('../utils/status.helper');
const authMiddleware = require('./authMiddleware');

module.exports = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.role)) {
            const error = ERRORHelper.create('Access denied', 403,statusHelper.FAIL);
            return next(error);
        }
        next();
    }
}
