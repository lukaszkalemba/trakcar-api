import express from 'express';
import auth from 'middleware/auth';
import {
  organizations_create_organization,
  organizations_delete_organization,
  organizations_update_organization,
  organizations_get_members,
  organizations_assign_member,
} from 'controllers/organizations';

const router = express.Router();

router.post('/', auth, organizations_create_organization);

router.delete('/:id', auth, organizations_delete_organization);

router.put('/:id', auth, organizations_update_organization);

router.get('/members', auth, organizations_get_members);

router.post('/members', auth, organizations_assign_member);

export default router;
