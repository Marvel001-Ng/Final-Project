require("dotenv").config()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");

// signUp
const signUp = async (req, res) =>{
    try {
        const {username, email, password} = req.body;

        if (!username || !email || !password){
            return res.status(400).json({
                msg:"please enter required field"
            })
        }
        // validate user
        const validUser = await User.findOne({email});
        if(validUser){
            return res.status(404).json({
                msg:"User Already exist"
            })
        }
        // hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const registedUser = await User.create({
            username,
            email,
            password: hashedPassword
        })
        res.status(200).json({
            msg:"User registed successfull",
            registedUser:{
                id: registedUser._id,
                username: registedUser.username,
                email: registedUser.email,
            }
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "server error" });
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        // validate input
        if(!email || !password){
            return res.status(400).json({
                msg:"provide email and password"
            });
        }
        // check if user exists
        const userExist = await User.findOne({email});
        if (!userExist){
            return res.status(404).json({
                msg:"user not found",
            });
        }
        // compare password
        const isMatch = await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({
                msg:"invalid password",
            });
        }
        // Generate jwt token
        const token = jwt.sign(
        {
            id: userExist._id,
            username: userExist.username,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
    res.status(200).json({
        msg:"Login successful",
        token,
    })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "server error" });
    }
};
// forgot password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
 
        if (!email) {
            return res.status(400).json({
                msg: "please provide email"
            });
        }
 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                msg: "if that email exists, a reset link has been sent"
            });
        }
 
        const resetToken = jwt.sign(
            {
                id: user._id,
                purpose: "password_reset",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );
 
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
 

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
 
        await transporter.sendMail({
            from: process.env.SMTP_FROM || "no-reply@example.com",
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <p>Hello ${user.username},</p>
                <p>You requested a password reset. This link expires in 15 minutes:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>If you didn't request this, you can ignore this email.</p>
            `,
        });
 
        res.status(200).json({
            msg: "if that email exists, a reset link has been sent"
        });
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "server error" });
    }
};
 
// resetPassword

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params; 
        const { newPassword } = req.body;
 
        if (!token || !newPassword) {
            return res.status(400).json({
                msg: "token and new password are required"
            });
        }
 
        let decoded;
        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_RESET_SECRET || process.env.JWT_SECRET
            );
        } catch (err) {
            return res.status(400).json({
                msg: "invalid or expired reset token"
            });
        }
 
        if (decoded.purpose !== "password_reset") {
            return res.status(400).json({
                msg: "invalid reset token"
            });
        }
 
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                msg: "user not found"
            });
        }
 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
 
        res.status(200).json({
            msg: "password reset successful"
        });
 
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "server error" });
    }
};
 

module.exports = {
    signUp,
    login,
    forgotPassword,
    resetPassword,
}