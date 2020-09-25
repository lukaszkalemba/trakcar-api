import express from 'express';
import auth from 'middleware/auth';
import {
  organizations_create_organization,
  organizations_delete_organization,
  organizations_assign_member,
} from 'controllers/organizations';

const router = express.Router();

router.post('/', auth, organizations_create_organization);

router.delete('/:id', auth, organizations_delete_organization);

router.post('/assign-member', auth, organizations_assign_member);

export default router;
