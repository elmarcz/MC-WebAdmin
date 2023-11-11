module.exports = (app, functions, isLoggedIn, isNotLoggedIn) => {
    const aspectConfigSchema = require('../models/aspectConfigSchema')
    const userDb = require('../models/userSchema')
    const liveAttacksDb = require('../models/attackLiveSchema')

    const add = async() => {
        const db = require('../models/userSchema.js')
        const user = await db({
            name: "Izan",
            idChecker: "https://idchecker.marcmedrano.repl.co/verify",
            Codes: true,
            Settings: true,
            DDoSAttacks: true,
            DDoSServers: true,
            DDoSAnalytics: true
        })

        await user.save()
    }

    app.get('/login', isNotLoggedIn, async (req, res) => {
        res.render('login');
    });

    app.post('/login', isNotLoggedIn, async (req, res) => {
        const url = await aspectConfigSchema.findOne({ username: 'Marc' })
        fetch(url.idChecker, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: req.body.id })
        })
            .then(response => response.json())
            .then(async (result) => {
                if (result.status == true) {
                    const data1 = await userDb.findOne({ username: req.body.username })

                    req.session.user = data1
                    res.redirect('/');
                } else {
                    res.redirect('/login');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    app.get('/logout', isLoggedIn, (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al destruir la sesión:', err);
                return res.status(500).send('Error al cerrar la sesión');
            }
            res.redirect('/');
        });
    });

    app.get('/', isLoggedIn, async (req, res) => {
        const todayDate = new Date()

        let month = todayDate.getMonth() + 1
        let year = todayDate.getFullYear()
        let day = todayDate.getDate()

        let arr1 = await functions.findAllAttacksOfThisMonth(`${month}/${year}`)
        let arr2 = await functions.findAllAttacksOfThisDate(`${day}/${month}/${year}`)

        const attackNow = await liveAttacksDb.find();

        res.render('index', {
            attackDay: arr2.reverse(),
            attackMonth: arr1.reverse(),
            attackNow: attackNow.reverse()
        });
    });
}