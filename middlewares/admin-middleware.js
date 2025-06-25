const isAdminUser = (req, res, next) => {
    const userInfo = req.userInfo;

    if (userInfo && userInfo.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admins rights required.',
        });
    }
}

module.exports = isAdminUser;