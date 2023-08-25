const jwt = require('jsonwebtoken');
const Users = require('../models/users');


// ========== This Middleware will check, If the user is logged or not ========== 
exports.isLoggedin = async (request, response, next) => {
    try {
        const token = request.cookies._net;
        if (!token) return response.json({message: "Unauthorized (Logged in)", status: "error"});
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        response.json({message: "Unauthorized (Logged in)", status: "error"});
    }
}





// ========== This Middleware will check, If the user is Admin or not ========== 
exports.isAdmin = async (request, response, next) => {
    const { email } = response.locals.user;
    const user = await Users.findOne({ email });
    if (user.role !== '¥admin¥') return response.json({message: "Unauthorized (Not Admin)", status: "error"});
    next();
}





// ========== This Middleware will get loggedin user data and sned it to entire app ========== 
exports.userData = async (request, response, next) => {
    try {
        const token = request.cookies._net;
        if (!token) {
            response.locals.user = null;
            next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findById(decoded.id);

        if (!user) {
            response.clearCookie('_net', {httpOnly: true, secure: true});
            return response.locals.user = null;
        }

        response.locals.user = user
        next();
    } catch (error) {
        response.locals.user = null;
        next();
    }
}