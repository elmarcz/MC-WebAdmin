const { Schema, model } = require('mongoose');

const serverSchema = new Schema({
    username: String,
    bgImg: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/255px-Gay_Pride_Flag.svg.png"
    },
    profilePic: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/255px-Gay_Pride_Flag.svg.png"
    },
    idChecker: {
        type: String,
        default: "No puedes cambiar este valor"
    },
    // Enable o Disable Services
    Codes: Boolean,
    Settings: Boolean,
    DDoSAttacks: Boolean,
    DDoSServers: Boolean,
    DDoSAnalytics: Boolean,
    Date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('userSchema', serverSchema);