import { Router } from "express";
import { getMe, login, register, verifyEmail } from "../controllers/auth.controller.js";
import registerValidator from "../validators/register.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = Router();

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post("/register", registerValidator, register);

/**@route POST /api/auth/login
 * @desc  user login
 * @access Public
 */
router.post("/login", login);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 */

router.get("/verify-email", verifyEmail)


/**
 * @route GET /api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
router.get("/get-me", authMiddleware, getMe)

export default router