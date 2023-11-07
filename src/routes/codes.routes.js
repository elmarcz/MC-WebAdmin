module.exports = (app, functions, isLoggedIn) => {
    const attackInfoSchema = require('../models/attackInfoSchema')

    app.get('/codes', isLoggedIn, async (req, res) => {
        res.render('codes/codes');
    });

    app.get('/mycodes', isLoggedIn, async (req, res) => {
        res.render('codes/mycodes');
    });
}