// auth.controller.js
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken"

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User with this email or username already exists",
                success: false,
            });
        }

        const user = await userModel.create({ username, email, password });
        const emailverifyToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET)

        sendEmail({
            to: email,
            subject: "Welcome to Perplexity!",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>.</p>
                <p>Please verify your email address by clicking the link below:</p>
                <p><a href="http://localhost:3000/api/auth/verify-email?token=${emailverifyToken}">Verify Email</a></p>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
            `,
        }).catch((err) => console.error("Welcome email failed for", email, err));

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
export async function login(req, res) {
    const { email, password, username } = req.body

    try {
        const user = await userModel.findOne({ $or: [{ email }, { username }] }).select("+password")
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false,
            });
        }
        if (!user.verified) {
            return res.status(403).json({
                message: "User not verified",
                success: false,
            });
        }
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });

        res.cookie("token", token)
        
        res.status(200).json({
            message: "Login successful",
            success: true,
            token
        });

    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
export async function getMe(req, res) {
    const userId = req.user.id
    try {
        const user = await userModel.findById(userId).select("-password")

        res.status(200).json({
            success: true,
            user
        })
    }
    catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}
export async function verifyEmail(req, res) {
    try {
        const { token } = req.query;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
            });
        }
        const user = await userModel.findOne({ email: decoded.email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }
        user.verified = true;
        await user.save();

        const html = `
            <p>Hi ${user.username},</p>
            <p>Your email has been successfully verified. You can now log in to your account.</p>
            <p>Best regards,<br>The Perplexity Team</p>
        `;
        res.send(html)
    }
    catch (err) {
        console.error("Email verification error:", err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}