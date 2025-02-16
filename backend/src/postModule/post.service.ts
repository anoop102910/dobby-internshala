import { PostDao } from "./post.dao";
import { IPostInput } from "./post.model";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS } from "../utils/httpStatus";
import { CodeEnum } from "../utils/CodeEnum";

export class PostService {
  private postDao: PostDao;

  constructor() {
    this.postDao = new PostDao();
  }

  async createPost(postInput: IPostInput, userId: string) {
    try {
      return await this.postDao.createPost(postInput, userId);
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to create post",
        CodeEnum.POST_CREATION_FAILED
      );
    }
  }

  async getPosts() {
    try {
      return await this.postDao.getPosts();
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to fetch posts",
        CodeEnum.POSTS_FETCH_FAILED
      );
    }
  }

  async getUserPosts(userId: string) {
    try {
      return await this.postDao.getUserPosts(userId);
    } catch (error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to fetch user posts",
        CodeEnum.USER_POSTS_FETCH_FAILED
      );
    }
  }
} 