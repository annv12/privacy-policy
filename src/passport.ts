import passport from 'passport';
import { Strategy as FacebookStrategy, Profile } from 'passport-facebook';
import dotenv from 'dotenv';
import { saveAccessToken } from './tokenStore';

dotenv.config();

passport.use(new FacebookStrategy(
  {
    clientID: process.env.APP_ID || '',
    clientSecret: process.env.APP_SECRET || '',
    callbackURL: process.env.REDIRECT_URI || '',
    profileFields: ['id', 'displayName', 'emails']
  },
  (accessToken: string, _refreshToken: string, profile: Profile, done) => {
    saveAccessToken(profile.id, accessToken);
    return done(null, profile);
  }
));

// Required for session handling
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
