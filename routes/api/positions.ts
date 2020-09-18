import express from 'express';
import validatePosition from 'middleware/validatePosition';
import {
  getPositions,
  addPosition,
  editPosition,
  deletePosition,
} from 'controllers/positions';

const router = express.Router();

router.route('/').get(getPositions).post(validatePosition, addPosition);

router.route('/:id').put(validatePosition, editPosition).delete(deletePosition);

export default router;
