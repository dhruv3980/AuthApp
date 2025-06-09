const express = require('express');
const router = express.Router();

const{login,signup}= require("../Controllers/Auth");

const {auth, isstudent, isadmin} = require('../middleware/Auth');

router.get("/test",auth, (req, res) => {
    res.status(200).json({
        success: true,
        message: "welcome to the protected route",
    });
});


// student route example
router.get('/student', auth, isstudent, (req, res) => {
    res.status(200).json({
        success: true,
        message: "student route accessed successfully",
    });
});

// admin route example
router.get('/admin', auth, isadmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin route accessed successfully",
    });
});

router.post('/login', login);

router.post('/signup', signup); 

module.exports = router;
