module.exports = (app, functions, isLoggedIn) => {
    const pSSchema = require('../models/pSSchema')

    app.get('/projectstatus', isLoggedIn, async (req, res) => {
        const data = await pSSchema.find()
        res.render('projectStatus/main', { data: data });
    });

    app.get('/projectstatus/add', isLoggedIn, async (req, res) => {
        res.render('projectStatus/add');
    });

    app.post('/projectstatus/add', isLoggedIn, async (req, res) => {
        const newe = new pSSchema({
            name: req.body.name,
            url: req.body.url
        })
        await newe.save()
        res.render('projectStatus/add');
    });
}