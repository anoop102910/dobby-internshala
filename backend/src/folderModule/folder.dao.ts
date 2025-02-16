import mongoose from "mongoose";
import { IFolder, IFolderInput } from "./folder.model";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: 0,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const FolderModel = mongoose.model<IFolder>("Folder", folderSchema);

export class FolderDao {
  async createFolder(folderInput: IFolderInput): Promise<IFolder> {
    const folder = new FolderModel(folderInput);
    return await folder.save();
  }

  async getRootFolders(ownerId: string): Promise<IFolder[]> {
    return await FolderModel.find({ ownerId, parentId: null })
      .sort({ createdAt: -1 });
  }

  async getFolderContents(folderId: string): Promise<IFolder[]> {
    return await FolderModel.find({ parentId: folderId })
      .sort({ createdAt: -1 });
  }

  async deleteFolder(folderId: string): Promise<IFolder | null> {
    return await FolderModel.findByIdAndDelete(folderId);
  }

  async updateFolderSize(folderId: string, sizeChange: number): Promise<void> {
    await FolderModel.findByIdAndUpdate(folderId, {
      $inc: { size: sizeChange }
    });
  }

  async updateItemsCount(folderId: string, change: number): Promise<void> {
    await FolderModel.findByIdAndUpdate(folderId, {
      $inc: { itemsCount: change }
    });
  }

  async updateFolder(folderId: string, data: Partial<IFolder>): Promise<IFolder | null> {
    return await FolderModel.findByIdAndUpdate(folderId, data, { new: true });
  }
} 
