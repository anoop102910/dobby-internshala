import { ImageDao } from "../imageModule/image.dao";
import { FolderDao } from "./folder.dao";
import { IFolderInput, IFolder } from "./folder.model";

export class FolderService {
  private folderDao: FolderDao;
  private imageDao: ImageDao;

  constructor() {
    this.folderDao = new FolderDao();
    this.imageDao = new ImageDao();
  }

  async createFolder(folderInput: IFolderInput) {
    const folder = await this.folderDao.createFolder(folderInput);

    if (folderInput.parentId) {
      await this.folderDao.updateItemsCount(folderInput.parentId, 1);
    }

    return folder;
  }

  async getRootFolders(userId: string) {
    const folders = await this.folderDao.getRootFolders(userId);
    const images = await this.imageDao.getRootImages(userId);
    return { folders, images };
  }

  async getFolderContents(folderId: string) {
    const folders = await this.folderDao.getFolderContents(folderId);
    const images = await this.imageDao.getFolderImages(folderId);
    return { folders, images };
  }

  async deleteFolder(folderId: string) {
    const folder = await this.folderDao.deleteFolder(folderId);
    if (folder?.parentId) {
      await this.folderDao.updateItemsCount(folder.parentId, -1);
    }
    return folder;
  }

  async updateFolder(folderId: string, data: Partial<IFolder>) {
    const folder = await this.folderDao.updateFolder(folderId, data);
    return folder;
  }
}
