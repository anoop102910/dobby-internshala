import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { IUserInput } from "./user.model";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTP_STATUS } from "../utils/httpStatus";
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    const userInput: IUserInput = req.body;
    const result = await this.authService.register(userInput);
    res.json(new ApiResponse(HTTP_STATUS.SUCCESS, result, "User registered successfully"));
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    res
      .status(200)
      .json(new ApiResponse(HTTP_STATUS.SUCCESS, result, "User logged in successfully"));
  }

  async getProfile(req: Request, res: Response) {
    const user = await this.authService.getProfile(req.user._id);
    res.json(new ApiResponse(HTTP_STATUS.SUCCESS, user, "User profile fetched successfully"));
  }

  async verifyEmail(req: Request, res: Response) {
    const { token } = req.params;
    const user = await this.authService.verifyEmail(token);
    res.json(new ApiResponse(HTTP_STATUS.SUCCESS, user, "Email verified successfully"));
  }
}
