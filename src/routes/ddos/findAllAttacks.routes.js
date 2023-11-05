module.exports = (app, functions, isLoggedIn) => {

    // Those routes are the same as the attacks routes but for the page ddos/attacks/oneAttack

    app.get('/attacks/attack/findAllAttacksForThisUrl/:url', isLoggedIn, async (req, res) => {
        const a = await functions.findAllAttacksInLive()
        console.log(a)
        const data = await functions.findAllAttacksForThisUrl(req.params.url)
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), title: 'All Attacks for ' + req.params.url, totalAttacks: data.length });
    });

    app.get('/attacks/attack/findAllAttacksForThisServerOnThisUrl/:id/:url', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisServerOnThisUrl(req.params.id, req.params.url)
        res.render('ddos/attacks/allAttacks', { data: data, title: 'All Attacks for ' + req.params.url, totalAttacks: data.length });
    });

    app.get('/attacks/attack/findAllAttacksForThisTimes/:times', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisTimes(req.params.times)
        res.render('ddos/attacks/allAttacks', { data: data });
    });

    app.get('/attacks/attack/findAllAttacksForThisPublicIP/:ip', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisPublicIp(req.params.ip)
        res.render('ddos/attacks/allAttacks', { data: data, title: 'All Attacks for ' + req.params.ip, totalAttacks: data.length });
    });

    app.get('/attacks/attack/findAllAttacksForThisPrivateIP/:ip', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisPrivateIp(req.params.ip)
        res.render('ddos/attacks/allAttacks', { data: data, title: 'All Attacks for ' + req.params.ip, totalAttacks: data.length });
    });

    app.get('/attacks/attack/findAllAttacksForThisTime/:time', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisTime(req.params.time)
        res.render('ddos/attacks/allAttacks', { data: data, title: 'All Attacks for ' + req.params.time, totalAttacks: data.length });
    });

    app.get('/attacks/attack/findAllAttacksForThisTime/:time', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisTime(req.params.time)
        res.render('ddos/attacks/allAttacks', { data: data, title: 'All Attacks for ' + req.params.time, totalAttacks: data.length });
    });

    app.get('/attacks/attack/findAllAttacksForThisCountry/:country', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisCountry(req.params.country)
        res.render('ddos/attacks/allAttacks', { data: data, title: 'All Attacks for this country: ' + req.params.country, totalAttacks: data.length });
    });
}