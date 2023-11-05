module.exports = (app, functions, isLoggedIn) => {
    const serverSchema = require('../../models/serverSchema')

    app.get('/servers', isLoggedIn, async (req, res) => {
        const servers = await serverSchema.find()
        const serversAttacking = await functions.findAllAttacksInLive()
        let hidden;

        if(serversAttacking.length == 0){
            hidden = true
        }

        res.render('ddos/servers/servers', 
            { servers: servers, subtitle: `(${servers.length} Results)`, hidden: hidden }
        );
    });

    app.get('/servers/server/:id', isLoggedIn, async (req, res) => {
        const server = await serverSchema.findById(req.params.id)
        const findAllAttacks = await functions.findAllAttacksForThisServer(req.params.id)
        res.render('ddos/servers/server', { server: server, attack: findAllAttacks.reverse(), attackResults: findAllAttacks.length });
    });

    app.get('/servers/server/:id/Settings', isLoggedIn, async (req, res) => {
        const server = await serverSchema.findById(req.params.id)
        res.render('ddos/servers/settings', { server: server });
    });

    // Add
    app.get('/servers/add', isLoggedIn, async (req, res) => {
        res.render('ddos/servers/add');
    });

    app.post('/servers/add', isLoggedIn, async (req, res) => {
        const { url, location, name } = req.body
        const server = new serverSchema({
            Url: url,
            Location: location,
            serverName: name
        })
        await server.save()
        res.redirect('/servers');
    });

    // Delete
    app.get('/servers/delete', isLoggedIn, async (req, res) => {
        res.render('ddos/servers/delete');
    });

    app.post('/servers/delete', isLoggedIn, async (req, res) => {
        await serverSchema.findByIdAndRemove(req.body.id)
        res.redirect('/servers');
    });

    app.get('/servers/server/:id/delete', isLoggedIn, async (req, res) => {
        await serverSchema.findByIdAndDelete(req.params.id)
        res.redirect('/servers/');
    });

    // Edit
    app.get('/servers/server/:id/edit', isLoggedIn, async (req, res) => {
        const server = await serverSchema.findById(req.params.id)
        res.render('ddos/servers/editServer', { server: server });
    });

    app.post('/servers/server/:id/edit', isLoggedIn, async (req, res) => {
        await serverSchema.findOneAndUpdate({ _id: req.params.id }, { Location: req.body.Location, Url: req.body.Url, serverName: req.body.serverName })
        res.redirect('/servers/server/' + req.params.id);
    });

    // Attacking Servers
    app.get('/servers/attacking-servers', isLoggedIn, async (req, res) => {
        const serversAttacking = await functions.findAllAttacksInLive()
        let list = [];
        let hidden;

        for(let i = 0; i < serversAttacking.length; i++) {
            let serverInDb = await serverSchema.findById(serversAttacking[i]);
            list.push(serverInDb)
        }

        if(list.length == 0){
            hidden = true;
        }

        res.render('ddos/servers/servers', 
            { servers: list, hidden: hidden, subtitle: `(${list.length} Results)` }
        );
    });
}