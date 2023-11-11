const { Schema, model } = require('mongoose') ;

const schema = new Schema({
    servers: [
        {
            serverID: String
        }
    ],
    url: String,
    times: String,
    timesRealized: String,
    time: String,
    hourStart: String,
    port: String
});

module.exports = model('attackLiveSchema', schema);