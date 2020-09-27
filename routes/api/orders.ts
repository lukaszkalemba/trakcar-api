import express from 'express';
import auth from 'middleware/auth';
import {
  orders_get_all,
  orders_create_order,
  orders_update_order,
  orders_delete_order,
} from 'controllers/orders';

const router = express.Router();

router.get('/', auth, orders_get_all);

router.post('/', auth, orders_create_order);

router.put('/:id', auth, orders_update_order);

router.delete('/:id', auth, orders_delete_order);

export default router;
