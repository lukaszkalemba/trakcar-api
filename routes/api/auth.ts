import express from 'express';
import { signUpUser } from 'controllers/auth';

const router = express.Router();

router.route('/signup').post(signUpUser);

export default router;
