const userModel = require('../models/userSchema');  // Adjust path as needed

const isActive = async (req, res, next) => {
    try {
        const userId = req.user?._id; // Ensure user ID exists

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized access. Please log in.',
                errorType: 'UNAUTHORIZED'
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found',
                errorType: 'USER_NOT_FOUND' 
            });
        }

        if (!user.isActive) {
            return res.status(403).json({ 
                success: false, 
                message: 'Your account is inactive. Contact support for help.' ,
                errorType: 'USER_BLOCKED'
            });
        }

        next(); // Proceed to the next middleware/route if user is active
    } catch (error) {
        console.error(`Error in isActive middleware: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            errorType: 'SERVER_ERROR' 
        });
    }
};

module.exports = isActive;