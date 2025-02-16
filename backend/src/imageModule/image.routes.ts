import { Router } from "express";
import { ImageController } from "./image.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { upload } from "../config/cloudinary";
import { uploadImageSchema } from "./image.validation";

const router = Router();
const imageController = new ImageController();

router.use(authMiddleware);

router.post(
  "/",
  upload.single('image'),
  asyncHandler(imageController.uploadImage.bind(imageController))
);

router.get(
  "/:folderId",
  asyncHandler(imageController.getFolderImages.bind(imageController))
);

router.delete(
  "/:imageId",
  asyncHandler(imageController.deleteImage.bind(imageController))
);

export default router; 