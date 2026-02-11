require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth");



const app = express();
const PORT = process.env.PORT || 5000;

const session = require('express-session');
const passport = require('./lib/passport');

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:3000',
            'https://login-page-frontend.vercel.app', // Keep original example
            'https://login-auth-frontend-blond.vercel.app' // Add user's actual Vercel URL
        ];

        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Root route for testing
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Auth Backend API is running',
        endpoints: {
            health: '/health',
            auth: '/api/auth/*'
        }
    });
});

app.use('/api/auth', authRoutes);


app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});