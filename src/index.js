require('dotenv').config()

const app = require('./server')
require('./db')

app.listen(app.get('port'), () => {
    console.log(`[Server] On port ${app.get('port')}`)
})

app.use(function (req, res, next) {
    res.status(404).redirect('/');
});