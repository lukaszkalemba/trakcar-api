import express from 'express';
import auth from 'middleware/auth';
import {
  users_get_user,
  users_signup_user,
  users_login_user,
} from 'controllers/users';

const router = express.Router();

router.get('/', auth, users_get_user);

router.post('/', users_signup_user);

router.post('/login', users_login_user);

export default router;
