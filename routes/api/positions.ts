import express from 'express';
import { getPositions } from 'controllers/positions';

const router = express.Router();

router.route('/').get(getPositions);

export default router;
