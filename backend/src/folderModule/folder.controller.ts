import { Request, Response } from "express";
import { FolderService } from "./folder.service";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTP_STATUS } from "../utils/httpStatus";

export class FolderController {
  private folderService: FolderService;

  constructor() {
    this.folderService = new FolderService();
  }

  async createFolder(req: Request, res: Response) {
    const folder = await this.folderService.createFolder({
      ...req.body,
      ownerId: req.user._id,
    });
    res.status(HTTP_STATUS.CREATED).json(
      new ApiResponse(HTTP_STATUS.CREATED, folder, "Folder created successfully")
    );
  }

  async getRootFolders(req: Request, res: Response) {
    const folders = await this.folderService.getRootFolders(req.user._id);
    res.json(
      new ApiResponse(HTTP_STATUS.SUCCESS, folders, "Root folders fetched successfully")
    );
  }

  async getFolderContents(req: Request, res: Response) {
    const contents = await this.folderService.getFolderContents(req.params.folderId);
    res.json(
      new ApiResponse(HTTP_STATUS.SUCCESS, contents, "Folder contents fetched successfully")
    );
  }

  async deleteFolder(req: Request, res: Response) {
    const folder = await this.folderService.deleteFolder(req.params.folderId);
    res.json(
      new ApiResponse(HTTP_STATUS.SUCCESS, folder, "Folder deleted successfully")
    );
  }

  async updateFolder(req: Request, res: Response) {
    const folder = await this.folderService.updateFolder(req.params.folderId, req.body.name);
    res.json(
      new ApiResponse(HTTP_STATUS.SUCCESS, folder, "Folder updated successfully")
    );
  }
} 