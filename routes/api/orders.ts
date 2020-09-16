import express from 'express';
import { getOrders } from '../../controllers/orders';

const router = express.Router();

router.route('/').get(getOrders);

export default router;
