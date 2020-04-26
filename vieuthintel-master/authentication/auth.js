/*
 * @author Gaurav Kumar
 */

exports.authorize = (req, res, next) => {
    req.user = {
        name: "username",
        _id: "123"
    };
    next();
};
