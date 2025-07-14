require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// View Engine
app.set('view engine', 'ejs');

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
