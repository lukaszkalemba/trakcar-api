import express from 'express';
import {
  getOrders,
  addOrder,
  editOrder,
  deleteOrder,
} from 'controllers/orders';

const router = express.Router();

router.route('/').get(getOrders).post(addOrder);

router.route('/:id').put(editOrder).delete(deleteOrder);

export default router;
