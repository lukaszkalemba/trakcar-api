import express from 'express';
import {
  orders_get_all,
  orders_create_order,
  orders_update_order,
  orders_delete_order,
} from 'controllers/orders';

const router = express.Router();

router.get('/', orders_get_all);

router.post('/', orders_create_order);

router.put('/:id', orders_update_order);

router.delete('/:id', orders_delete_order);

export default router;
