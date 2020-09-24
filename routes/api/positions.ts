import express from 'express';
import {
  positions_get_all,
  positions_create_position,
  positions_update_position,
  positions_delete_position,
} from 'controllers/positions';

const router = express.Router();

router.get('/', positions_get_all);

router.post('/', positions_create_position);

router.put('/:id', positions_update_position);

router.delete('/:id', positions_delete_position);

export default router;
