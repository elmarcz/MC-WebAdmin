const { Schema, model } = require('mongoose');

const serverSchema = new Schema({
    serverName: String,
    Url: String,
    Location: String,
    isAttacking: {
        type: Boolean,
        default: false
    },
    Date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('serverSchema', serverSchema);