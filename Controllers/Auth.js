const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//signup route handler

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success:false,
                message: "User already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ message: "User created successfully" });

    }
    catch(err){
        console.error("Error in signup:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }

}

// login route handler
exports.login = async(req,res)=>{
    try{

        // data fetch from request body
        const { email, password } = req.body;
        // validate email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are Wrong",
            });
        }


        //check for registered user

        let user = await User.findOne({email});
        // if not registered user
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        
        // verify password and generate jwt token
        const isPasswordValid = await bcrypt.compare(password, user.password);

        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        // password is not valid
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }  
        

        // password is valid
        else{
            // Generate JWT token
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h' // Token expiration time
            });
            user= user.toObject(); 
            user.token = token; // Add token to user object
            user.password = undefined; // Remove password from user object

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Token expiration time
                httpOnly: true, // Prevents client-side JavaScript from accessing the token
            }

            res.cookie('token',token,options).status(200).json({
                success: true,
                token,
                message: "Login successful",
                user: user,
            });

        }
    }
    catch(err){

        console.error("Error in login:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}