import express from 'express';
import validateOrder from 'middleware/validateOrder';
import {
  getOrders,
  addOrder,
  editOrder,
  deleteOrder,
} from 'controllers/orders';

const router = express.Router();

router.route('/').get(getOrders).post(validateOrder, addOrder);

router.route('/:id').put(validateOrder, editOrder).delete(deleteOrder);

export default router;
