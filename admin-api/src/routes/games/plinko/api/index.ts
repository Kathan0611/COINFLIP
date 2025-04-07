import { Router } from 'express';
import otproute from './otproute';
import { validateRequest } from '../../../../middlewares/validateRequest';
import GameConfig from './gameConfig';

const router = Router();
router.use('/plinko', GameConfig);
router.use('/', validateRequest, otproute);


export default router;
