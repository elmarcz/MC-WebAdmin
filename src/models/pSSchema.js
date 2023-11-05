const { Schema, model } = require('mongoose');

const pSSchema = new Schema({
    name: String,
    url: String
});

module.exports = model('pSSchema', pSSchema);