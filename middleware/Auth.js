// auth, isstudent, isadmin
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try{

        // extract jwt token from request body
        const token = req.body.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access, token is missing",
            });
        }
        // verify the token
        try{
             const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // attach user information to request object        
            req.user = decoded;
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Unauthorized access, token is invalid",
            });
        }

       

        next(); // call next middleware or route handler
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "Unauthorized access, token is invalid",
        });
       
    }
}


exports.isstudent = (req, res, next) => {
    try{
        // check if user role is student
        if (req.user.role !== 'Student') {
            return res.status(403).json({
                success: false,
                message: "Forbidden access, not a student",
            });
        }
        next(); // call next middleware or route handler
    }
    catch(err){
        return res.status(403).json({
            success: false,
            message: "Forbidden access, not a student",
        });
    }
}

exports.isadmin = (req, res, next) => {
    try{
        // check if user role is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Forbidden access, not an admin",
            });
        }
        next(); // call next middleware or route handler
    }
    catch(err){
        return res.status(403).json({
            success: false,
            message: "Forbidden access, not an admin",
        });
    }
}