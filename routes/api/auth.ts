import express from 'express';
import validateSignup from 'middleware/validateSignup';
import { signUpUser } from 'controllers/auth';

const router = express.Router();

router.route('/signup').post(validateSignup, signUpUser);

export default router;
