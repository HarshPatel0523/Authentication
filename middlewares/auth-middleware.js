const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. Please Login first.',
        });
    }

    try {
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET);

        req.userInfo = decodedTokenInfo;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid token. Access denied.',
        });
    }
};

module.exports = authMiddleware;