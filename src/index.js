require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth");



const app = express();
app.set('trust proxy', 1); // trust first proxy
const PORT = process.env.PORT || 5000;

const session = require('express-session');
const passport = require('./lib/passport');

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true, // HTTPS only
            sameSite: "none", // allow cross-site OAuth
        }
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