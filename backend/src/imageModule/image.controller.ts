import { Request, Response } from "express";
import { ImageService } from "./image.service";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
import { cloudinary } from "../config/cloudinary";
import { CodeEnum } from "../utils/CodeEnum";
import { ApiError } from "../utils/ApiError";
import fs from 'fs';

export class ImageController {
  private imageService: ImageService;

  constructor() {
    this.imageService = new ImageService();
  }

  async uploadImage(req: Request, res: Response) {
    if (!req.file) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "No image file provided",
        CodeEnum.NO_IMAGE_PROVIDED
      );
    }

    try {
      const image = await this.imageService.uploadImage({
        file: req.file,
        folderId: req.body.folderId || null,
        ownerId: req.user._id,
      });

      // Clean up the temporary file
      console.log("image uploaded successfully");
     /*  if (req.file.path) {
        fs.unlinkSync(req.file.path);
      } */

      console.log("unlinked file");

      res.status(HTTP_STATUS.CREATED).json(
        new ApiResponse(HTTP_STATUS.CREATED, image, "Image uploaded successfully")
      );
    } catch (error) {
      // Clean up the temporary file in case of error
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      throw error;
    }
  }

  async getFolderImages(req: Request, res: Response) {
    const folderId = req.params.folderId === "root" ? null : req.params.folderId;
    const images = await this.imageService.getFolderImages(folderId);
    res.json(
      new ApiResponse(HTTP_STATUS.SUCCESS, images, "Images fetched successfully")
    );
  }

  async deleteImage(req: Request, res: Response) {
    const image = await this.imageService.deleteImage(req.params.imageId);
    
    // Delete from Cloudinary if image exists
    if (image?.imageUrl) {
      try {
        const publicId = `drive-clone/${image.imageUrl.split('/').pop()?.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error('Failed to delete image from Cloudinary:', error);
      }
    }

    res.json(
      new ApiResponse(HTTP_STATUS.SUCCESS, image, "Image deleted successfully")
    );
  }
} 