import { Router } from 'express';
import adminSlotMachineRoutes from './slot-machine/admin';
import apiSlotMachineRoutes from './slot-machine/api';
import adminPlinkoRoutes from './plinko/admin';
import apiPlinkoRoutes from './plinko/api';
import adminMemoryGameRoutes from './memory-game/admin';
import apiMemoryGameRoutes from './memory-game/api';
import adminCoinFlipRoutes from './coin-flip/admin';
import apiCoinFlipRoutes from './coin-flip/api';
import adminSpinGameRoutes from './Spin/admin'
import apiSpinGameRoutes from './Spin/api'

const adminRouter = Router();
const apiRouter = Router();

// admin routes
adminRouter.use('/slot-machine', adminSlotMachineRoutes);
adminRouter.use('/plinko', adminPlinkoRoutes);
adminRouter.use('/memory-game', adminMemoryGameRoutes);
adminRouter.use('/coin-flip', adminCoinFlipRoutes);
adminRouter.use('/spin', adminSpinGameRoutes)
// api routes
apiRouter.use('/slot-machine', apiSlotMachineRoutes);
apiRouter.use('/plinko', apiPlinkoRoutes);
apiRouter.use('/memory-game', apiMemoryGameRoutes);
apiRouter.use('/coin-flip', apiCoinFlipRoutes);
apiRouter.use('/spin', apiSpinGameRoutes)
export { adminRouter, apiRouter };

