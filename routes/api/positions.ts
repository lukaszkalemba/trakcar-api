import express from 'express';
import {
  getPositions,
  addPosition,
  editPosition,
  deletePosition,
} from 'controllers/positions';

const router = express.Router();

router.route('/').get(getPositions).post(addPosition);

router.route('/:id').put(editPosition).delete(deletePosition);

export default router;
