const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register endpoint

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const checkExistingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists either with this username or email',
            });
        }

        // hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user',
        });

        await newUser.save();

        if (newUser) {
            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
            });
        }
        return res.status(400).json({
            success: false,
            message: 'User registration failed',
        });

    } catch (error) {
        console.log('Error registering user:', error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred!!!',
        });
    }
}


//login endpoint

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password',
            });
        }

        // Generate JWT token
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m',
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
        });

    } catch (error) {
        console.log('Error logging in user:', error);
        res.status(500).json({
            success: false,
            message: 'Some error occurred!!!',
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
}