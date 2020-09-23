import express from 'express';
import validateSignup from 'middleware/validateSignup';
import { signUpUser, signInUser } from 'controllers/auth';

const router = express.Router();

router.route('/signup').post(validateSignup, signUpUser);

router.route('/signin').post(signInUser);

export default router;
