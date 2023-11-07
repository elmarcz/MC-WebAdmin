const { Schema, model } = require('mongoose');

const serverSchema = new Schema({
    userID: String,
    code: String,
    nameCode: String,
    lastChange: String,
    Date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('codeSchema', serverSchema);