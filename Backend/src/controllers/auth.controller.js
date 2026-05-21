// auth.controller.js
import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 * @body    { username, email, password }
 */
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // Input validation
        if (!username?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Username, email, and password are required",
                success: false,
            });
        }

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

        // Fire-and-forget — don't let email failure break registration
        sendEmail({
            to: email,
            subject: "Welcome to Perplexity!",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>.</p>
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