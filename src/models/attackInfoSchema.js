const { Schema, model } = require('mongoose') ;

const attackInfoSchema = new Schema({
    serverID: String,
    url: String,
    times: String,
    time: String,
    hourStart: String,
    hourEnd: String,
    publicIP: String,
    privateIP: String,
    port: String
});

module.exports = model('attackInfoSchema', attackInfoSchema);