// @ts-ignore

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserDao } from "./user.dao";
import { IUser, IUserInput } from "./user.model";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS } from "../utils/httpStatus";
import crypto from "crypto";
import { emailService } from "../services/email.service";
import { CodeEnum } from "../utils/CodeEnum";
import { config } from "../config";
export class AuthService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDao();
  }

  async register(userInput: IUserInput) {
    const existingUser = await this.userDao.findByEmail(userInput.email);

    if (existingUser && !existingUser.isEmailVerified) {
      return await this.resendVerificationEmail(existingUser);
    }

    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "User already exists",
        CodeEnum.USER_ALREADY_EXISTS
      );
    }

    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    const user = await this.userDao.createUser({
      ...userInput,
      password: hashedPassword,
    });

    return await this.resendVerificationEmail(user);
  }

  async verifyEmail(token: string) {
    const user = await this.userDao.verifyEmail(token);
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Invalid or expired verification token",
        CodeEnum.INVALID_VERIFICATION_TOKEN
      );
    }
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userDao.findByEmail(email);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found", CodeEnum.USER_NOT_FOUND);
    }

    if (!user.isEmailVerified) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Please verify your email first",
        CodeEnum.EMAIL_VERIFICATION_REQUIRED
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid password", CodeEnum.INVALID_PASSWORD);
    }

    const token = this.generateToken(user._id);
    return { user, token };
  }

  async getProfile(userId: string) {
    const user = await this.userDao.findById(userId);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found", CodeEnum.USER_NOT_FOUND);
    }
    return user;
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.secret as string, {
      expiresIn: config.jwt.expiresIn as string,
    } as jwt.SignOptions);
  }

  private async resendVerificationEmail(user: IUser) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    await this.userDao.updateVerificationToken(user._id, verificationToken);
    await emailService.sendVerificationEmail(user.email, verificationToken);
    return {
      message: "Verification email sent successfully",
      code: CodeEnum.VERIFICATION_EMAIL_SENT,
    };
  }
}
