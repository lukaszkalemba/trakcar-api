import express from 'express';
import auth from 'middleware/auth';
import {
  positions_get_all,
  positions_create_position,
  positions_update_position,
  positions_delete_position,
} from 'controllers/positions';

const router = express.Router();

router.get('/', auth, positions_get_all);

router.post('/', auth, positions_create_position);

router.put('/:id', auth, positions_update_position);

router.delete('/:id', auth, positions_delete_position);

export default router;
