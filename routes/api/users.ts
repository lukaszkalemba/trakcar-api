import express from 'express';
import { users_signup_user, users_login_user } from 'controllers/users';

const router = express.Router();

router.post('/', users_signup_user);

router.post('/login', users_login_user);

export default router;
