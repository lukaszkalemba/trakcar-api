import express from 'express';
import { getOrders, addOrder, deleteOrder } from 'controllers/orders';

const router = express.Router();

router.route('/').get(getOrders).post(addOrder);

router.route('/:id').delete(deleteOrder);

export default router;
