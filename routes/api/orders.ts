import express from 'express';
import { getOrders, addOrder } from 'controllers/orders';

const router = express.Router();

router.route('/').get(getOrders).post(addOrder);

export default router;
