module.exports = (app, functions, isLoggedIn) => {
    const aspectConfigSchema = require('../models/aspectConfigSchema')
    async function updateSession(req) {
        const data = await aspectConfigSchema.findOne({ username: 'Marc' })
        req.session.user = data
    }

    app.post('/settings/bgimage', isLoggedIn, async (req, res) => {
        const { bgImg } = req.body;
        await aspectConfigSchema.findOneAndUpdate({ username: 'Marc' }, { bgImg: bgImg })
        updateSession(req)
        req.session.user.bgImg = bgImg
        res.redirect('/');
    });

    app.get('/settings', isLoggedIn, async (req, res) => {
        const data = await aspectConfigSchema.findOne({ username: 'Marc' })
        res.render('settings', {
            idChecker: data.idChecker,
            bgImg: data.bgImg
        });
    });

    app.post('/settings/idchecker', isLoggedIn, async (req, res) => {
        const { idchecker } = req.body;
        await aspectConfigSchema.findOneAndUpdate({ username: 'Marc' }, { idChecker: idchecker })
        updateSession(req)
        res.redirect('/');
    });
}