import { Router } from "express";
import { createMedia, deleteMedia, getMedia } from "../../controllers/admin/mediaController";
import { multiFileUpload } from "../../middlewares/fileUpload";
import { validateImagesUpload } from "../../validators/admin/media";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get('/', getMedia);
router.delete('/:id', deleteMedia);
router.post('/', multiFileUpload.array('images'), validateImagesUpload,validateRequest, createMedia);



export default router;