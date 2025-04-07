import { Router } from "express";
import { elibileUserController } from "../../../../controllers/plinko/api/eligibleUserController";

const router = Router();

router.get('/eligible',elibileUserController);

export default router;