import { body } from "express-validator";

export const registerValidation = [
    body('email','wrong format of mail').isEmail(),
    body('password','wrong format of password, min 5 symbol').isLength({min:5}),
    body('fullName','wrong format of name').isLength({min:3}),
    body('avatarUrl','wrong format of url').optional().isURL()
];