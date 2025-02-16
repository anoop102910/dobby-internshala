import mongoose from "mongoose";
import { IImage, IImageInput } from "./image.model";

const imageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ImageModel = mongoose.model<IImage>("Image", imageSchema);

export class ImageDao {
  async createImage(imageInput: IImageInput): Promise<IImage> {
    const image = new ImageModel(imageInput);
    return await image.save();
  }

  async getRootImages(userId: string): Promise<IImage[]> {
    return await ImageModel.find({ ownerId: userId, folderId: null   })
      .sort({ createdAt: -1 });
  }

  async getFolderImages(folderId: string | null): Promise<IImage[]> {
    return await ImageModel.find({ folderId })
      .sort({ createdAt: -1 });
  }

  async deleteImage(imageId: string): Promise<IImage | null> {
    return await ImageModel.findByIdAndDelete(imageId);
  }
} 