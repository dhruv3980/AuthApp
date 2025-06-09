const express = require("express");
const app = express();
require("dotenv").config();
const PORT =  process.env.PORT||3080;

app.use(express.json());

// ✅ Global middleware to handle bad JSON errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON format in request body",
        });
    }
    next();
});

require("./config/database").connect();

// route import and mount
const user  = require('./routes/user');
app.use('/api/v1', user);





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});








