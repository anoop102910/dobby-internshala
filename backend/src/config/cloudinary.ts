import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config } from './index';
import { ApiError } from '../utils/ApiError';
import { HTTP_STATUS } from '../utils/httpStatus';
import { CodeEnum } from '../utils/CodeEnum';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'drive-clone',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ quality: 'auto' }],
  } as any,
});

// File filter to check if uploaded file is an image
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      'Only image files are allowed',
      CodeEnum.INVALID_FILE_TYPE
    ));
  } else {
    cb(null, true);
  }
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: config.fileUpload.limit * 1024 * 1024, // Convert MB to bytes
  }
});

export { cloudinary }; 