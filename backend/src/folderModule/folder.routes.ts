import { Router } from "express";
import { FolderController } from "./folder.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { createFolderSchema, renameFolderSchema } from "./folder.validation";

const router = Router();
const folderController = new FolderController();

router.use(authMiddleware);

router.post(
  "/",
  validate(createFolderSchema),
  asyncHandler(folderController.createFolder.bind(folderController))
);

router.get(
  "/",
  asyncHandler(folderController.getRootFolders.bind(folderController))
);

router.get(
  "/:folderId",
  asyncHandler(folderController.getFolderContents.bind(folderController))
);

router.delete(
  "/:folderId",
  asyncHandler(folderController.deleteFolder.bind(folderController))
);

router.put(
  "/:folderId",
  validate(renameFolderSchema),
  asyncHandler(folderController.updateFolder.bind(folderController))
);

export default router; 