import express from 'express';
import { getPositions, addPosition } from 'controllers/positions';

const router = express.Router();

router.route('/').get(getPositions).post(addPosition);

export default router;
