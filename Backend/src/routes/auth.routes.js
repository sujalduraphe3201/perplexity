import { Router } from "express";
import { register } from "../controllers/auth.controller.js";
import registerValidator from "../validators/register.validator.js";


const router = Router();

/**@route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerValidator, register);

/**@route POST /api/auth/login
 * @desc  user login
 * @access Public
 */
// router.post("/login", login);

export default router