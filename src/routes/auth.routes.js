module.exports = (app, functions, isLoggedIn, isNotLoggedIn) => {
    const aspectConfigSchema = require('../models/aspectConfigSchema')
    const userDb = require('../models/userSchema')
    //let interval;

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
        /*
        try {
            const url = 'https://idchecker.marcmedrano.repl.co/dateToChange';
            const json = await fetchData(url);
            const jsonData = json.split(' ')[1];

            const date = new Date();
            const todayDate = {
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            };

            const fetchDate = parseTime(jsonData);

            let timeDifference = calculateTimeDifference(fetchDate, todayDate);

            if (timeDifference < 0) {
                timeDifference += 24 * 3600;
            }

            clearInterval(interval);
            startInterval(timeDifference);

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('An error occurred');
        }*/

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
        //clearInterval(interval);
        const todayDate = new Date()

        let month = todayDate.getMonth() + 1
        let year = todayDate.getFullYear()
        let day = todayDate.getDate()

        let arr1 = await functions.findAllAttacksOfThisMonth(`${month}/${year}`)
        let arr2 = await functions.findAllAttacksOfThisDate(`${day}/${month}/${year}`)

        res.render('index', {
            attackDay: arr2.reverse(),
            attackMonth: arr1.reverse()
        });
    });

    /* Functions
    function fetchData(url) {
        return fetch(url).then(response => response.json());
    }
    
    function parseTime(timeString) {
        const [hour, minute, second] = timeString.split(':').map(Number);
        return { hour, minute, second };
    }
    
    function calculateTimeDifference(fetchDate, todayDate) {
        return (
            (fetchDate.hour - todayDate.hour) * 3600 +
            (fetchDate.minute - todayDate.minute) * 60 +
            (fetchDate.second - todayDate.second)
        );
    }
    
    function startInterval(timeDifference) {
        interval = setInterval(() => {
            if (timeDifference > 0) {
                const hours = Math.floor(timeDifference / 3600);
                const rh = timeDifference % 3600;
                const minutes = Math.floor(rh / 60);
                const seconds = rh % 60;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }*/
}