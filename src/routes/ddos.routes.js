module.exports = (app, functions, isLoggedIn) => {
    const attackInfoSchema = require('../models/attackInfoSchema')

    app.get('/ddos', isLoggedIn, async (req, res) => {
        res.render('ddos/ddos');
    });

    app.get('/attacks', isLoggedIn, async (req, res) => {
        const data = await attackInfoSchema.find();
        res.render('ddos/attacks/findPage', { data: data.reverse() });
    });

    require('./ddos/findAllAttacks.routes')(app, functions, isLoggedIn)
    require('./ddos/attacks.routes')(app, functions, isLoggedIn)
    require('./ddos/server.routes')(app, functions, isLoggedIn)
    require('./ddos/analytics.routes')(app, functions, isLoggedIn)
}