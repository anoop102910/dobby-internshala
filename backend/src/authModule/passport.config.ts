import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../config";
import { IUser } from "./user.model";
import { UserDao } from "./user.dao";

export class PassportConfig {
  private static userDao = new UserDao();

  public static initialize(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: config.google.clientId,
          clientSecret: config.google.clientSecret,
          callbackURL: config.google.callbackUrl,
        },
        async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
          try {
            let user = await PassportConfig.userDao.findByGoogleId(profile.id);

            if (!user) {
              user = await PassportConfig.userDao.createUser({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.photos[0].value,
              });             
            }
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
  }
}
