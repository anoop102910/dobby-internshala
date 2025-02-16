import { ImageDao } from "./image.dao";
import { IImageInput } from "./image.model";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS } from "../utils/httpStatus";
import { CodeEnum } from "../utils/CodeEnum";
import { FolderDao } from "../folderModule/folder.dao";
import { cloudinary } from "../config/cloudinary";
import { config } from "../config";
interface UploadImageParams {
  file: Express.Multer.File;
  folderId: string | null;
  ownerId: string;
}

export class ImageService {
  private imageDao: ImageDao;
  private folderDao: FolderDao;

  constructor() {
    this.imageDao = new ImageDao();
    this.folderDao = new FolderDao();
  }

  async uploadImage({ file, folderId, ownerId }: UploadImageParams) {
    try {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: config.cloudinary.folder,
        resource_type: 'auto',
      });

      const imageInput: IImageInput = {
        imageUrl: result.secure_url,
        size: result.bytes,
        type: file.mimetype,
        name: file.originalname,
        folderId,
        ownerId,
      };

      const image = await this.imageDao.createImage(imageInput);
      
      if (folderId) {
        await this.folderDao.updateFolderSize(folderId, imageInput.size);
        await this.folderDao.updateItemsCount(folderId, 1);
      }
      
      return image;
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to upload image",
        CodeEnum.IMAGE_UPLOAD_FAILED
      );
    }
  }

  async getFolderImages(folderId: string | null) {
    try {
      return await this.imageDao.getFolderImages(folderId);
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to fetch images",
        CodeEnum.IMAGES_FETCH_FAILED
      );
    }
  }

  async deleteImage(imageId: string) {
    try {
      const image = await this.imageDao.deleteImage(imageId);
      if (image?.folderId) {
        await this.folderDao.updateFolderSize(image.folderId, -image.size);
        await this.folderDao.updateItemsCount(image.folderId, -1);
      }
      return image;
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to delete image",
        CodeEnum.IMAGE_DELETION_FAILED
      );
    }
  }
} 