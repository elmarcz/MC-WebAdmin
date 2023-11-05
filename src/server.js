const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: true
}));

// Global Variables
app.use((req, res, next) => {
    app.locals.session = req.session;
    next();
});

// Routes
require('./routes/router')(app);

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
