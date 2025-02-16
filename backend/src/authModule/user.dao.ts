import mongoose from "mongoose";
import { IUser, IUserInput } from "./user.model";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
    },
    displayName: String,
    profilePic: String,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>("User", userSchema);

export class UserDao {
  async createUser(userInput: IUserInput): Promise<IUser> {
    const user = new UserModel(userInput);
    return await user.save();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).select("-password");
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await UserModel.findOne({ googleId });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await UserModel.findOne({ username });
  }

  async updateVerificationToken(userId: string, token: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      emailVerificationToken: token,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });
  }

  async verifyEmail(token: string): Promise<IUser | null> {
    const user = await UserModel.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) return null;

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    return await user.save();
  }
}
