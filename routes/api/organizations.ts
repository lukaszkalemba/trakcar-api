import express from 'express';
import auth from 'middleware/auth';
import { organizations_create_organization } from 'controllers/organizations';

const router = express.Router();

router.post('/', auth, organizations_create_organization);

export default router;
