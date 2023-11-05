const { connect } = require('mongoose');

connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

.then(() => { console.log('[Server] Connected to db') })
.catch(err => { console.log(`[Server] db error: ${err}`) })