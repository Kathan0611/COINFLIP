//src/middlewares/uploadGameImages.ts
import { multiFileUpload } from "../fileUpload";

export const uploadGameImages = multiFileUpload.fields([
    { name: 'BackgroundImage', maxCount: 1 },
    { name: 'images' },
])