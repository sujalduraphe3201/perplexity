import { body, validationResult } from "express-validator";

const loginValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password must be at least 8 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

export default loginValidator;
