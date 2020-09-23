import express from 'express';
import validateSignup from 'middleware/validateSignup';
import { users_signup_user, users_login_user } from 'controllers/users';

const router = express.Router();

router.post('/signup', validateSignup, users_signup_user);

router.post('/login', users_login_user);

export default router;
