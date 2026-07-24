/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import User from '../modules/user/user.model.ts';
import { env } from './config.ts';
import { IsActiveUser, Role } from '../modules/user/user.interface.ts';


// CREDENTIALS LOGIN LOCAL STRATEGY
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email: string, password: string, done: any) => {
      try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        if (user.isDeleted || user.isActive === IsActiveUser.BLOCKED) {
          return done(null, false, { message: 'This account is unavailable.' });
        }

        if (user.isActive === IsActiveUser.INACTIVE) {
          return done(null, false, { message: 'This account is inactive.' });
        }

        if (!user.isVerified) {
          return done(null, false, { message: 'Verify your email before signing in.' });
        }

        if (!user.password) {
          const provider = user.auths?.find((auth) => auth.provider !== 'credentials')?.provider;
          return done(null, false, {
            message: provider
              ? `Use ${provider} to sign in to this account.`
              : 'Invalid email or password.',
          });
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);

        if (!isMatchPassword) {
          return done(null, false, { message: 'Invalid email or password.' });
        }

        return done(null, user as unknown as Express.User);
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

// USER GOOGLE REGISTER STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_OAUTH_ID,
      clientSecret: env.GOOGLE_OAUTH_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },

    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, { message: 'No email found' });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            cus_address: {
                cus_name: profile.displayName
            },
            email,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: 'google',
                providerId: profile.id,
              },
            ],
          });
        } else {
          user.isVerified = true;
          if (!user.auths.some((auth) => auth.provider === 'google')) {
            user.auths.push({ provider: 'google', providerId: profile.id });
          }
          await user.save();
        }

        return done(null, user as unknown as Express.User);
      } catch (error: any) {
        // authLogger.error({error}, 'Google strategy error');
        console.log('Google strategy error');
        done(error);
      }
    }
  )
);


passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error: any) {
    // authLogger.error({error}, error.message);
    console.log(error?.message);
    done(error);
  }
});
