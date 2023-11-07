module.exports = (app, functions, isLoggedIn) => {
    const aspectConfigSchema = require('../models/aspectConfigSchema')
    const userDB = require('../models/userSchema')

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

    app.post('/settings/user', isLoggedIn, async (req, res) => {
        const { profilePic, username } = req.body;
        await userDB.findOneAndUpdate({ username: req.session.user.username }, { profilePic: profilePic, username: username })

        req.session.user.username = username
        req.session.user.profilePic = profilePic

        res.redirect('/');
    });

    app.get('/settings', isLoggedIn, async (req, res) => {
        const data = await userDB.findOne({ username: req.session.user.username })
        const dataSettings = await aspectConfigSchema.findOne({ username: "Marc" })

        res.render('settings', {
            idChecker: dataSettings.idChecker,
            user: data
        });
    });

    app.post('/settings/idchecker', isLoggedIn, async (req, res) => {
        if(req.session.user._id == "654a389044724d629807df33"){
            const { idchecker } = req.body;
            await aspectConfigSchema.findOneAndUpdate({ username: 'Marc' }, { idChecker: idchecker })
            updateSession(req)
        }
        res.redirect('/');
    });
}