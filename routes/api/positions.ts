import express from 'express';
import {
  getPositions,
  addPosition,
  deletePosition,
} from 'controllers/positions';

const router = express.Router();

router.route('/').get(getPositions).post(addPosition);

router.route('/:id').delete(deletePosition);

export default router;
