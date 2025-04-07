import { Router } from "express";
import { getGameConfigController } from "../../../../controllers/plinko/admin/gameConfigController";

const router = Router();

router.get('/gameConfig',getGameConfigController);

export default router;