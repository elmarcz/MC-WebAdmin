const functions = require('./functions/findAllAttacks')

function isNotLoggedIn(req, res, next) {
  if (!req.session.user || !req.session.user.username) {
    next();
  } else {
    res.redirect('/');
  }
}

function isLoggedIn(req, res, next) {
  if (req.session.user && req.session.user.username) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = (app) => {
  require('./general.routes')(app, functions, isLoggedIn)
  require('./auth.routes')(app, functions, isLoggedIn, isNotLoggedIn)
  require('./ddos.routes')(app, functions, isLoggedIn)
  require('./projectstatus.routes')(app, functions, isLoggedIn)
}
