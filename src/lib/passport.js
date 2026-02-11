const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/google/callback',
            scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;
                const googleId = profile.id;
                const image = profile.photos[0]?.value;

                let user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { googleId: googleId },
                            { email: email }
                        ]
                    }
                });

                if (!user) {
                    // Create new user if not exists
                    // Since password is required by schema but unnecessary for OAuth, set a random one or handle it in schema
                    // Assuming schema allows optional password or we set a dummy one.
                    // Let's check schema first. But for now, I'll assume we can create one.
                    user = await prisma.user.create({
                        data: {
                            email,
                            name,
                            googleId,
                            image,
                            password: await require('bcrypt').hash(Math.random().toString(36), 10), // Dummy password
                        },
                    });
                } else if (!user.googleId) {
                    // Link Google ID to existing email account
                    user = await prisma.user.update({
                        where: { id: user.id },
                        data: { googleId: googleId, image: image }
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
