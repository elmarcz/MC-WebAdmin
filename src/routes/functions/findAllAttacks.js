const attackInfoSchema = require('../../models/attackInfoSchema');
const serverSchema = require('../../models/serverSchema');

module.exports = {
    async findOneAttack(id) {
        const data = await attackInfoSchema.findById(id);
        return data;
    },
    async findAllAttacks() {
        const data = await attackInfoSchema.find();
        return data;
    },
    async findAllAttacksForThisServer(serverID) {
        const data = await attackInfoSchema.find({ serverID: serverID });
        return data;
    },
    async findAllAttacksForThisUrl(url) {
        const data = await attackInfoSchema.find({ url: url });
        return data;
    },
    async findAllAttacksForThisServerOnThisUrl(serverID, url) {
        const data = await attackInfoSchema.find({ serverID: serverID, url: url });
        return data;
    },
    async findAllAttacksForThisPublicIp(publicIP) {
        const data = await attackInfoSchema.find({ publicIP: publicIP });
        return data;
    },
    async findAllAttacksForThisPrivateIp(privateIP) {
        const data = await attackInfoSchema.find({ privateIP: privateIP });
        return data;
    },
    async findAllAttacksForThisHourStart(hourStart) {
        const data = await attackInfoSchema.find({ hourStart: hourStart });
        return data;
    },
    async findAllAttacksForThisHourEnd(hourEnd) {
        const data = await attackInfoSchema.find({ hourEnd: hourEnd });
        return data;
    },
    async findAllAttacksForThisTime(time) {
        const data = await attackInfoSchema.find({ time: time });
        return data;
    },
    async findAllAttacksForThisTimes(times) {
        const data = await attackInfoSchema.find({ times: times });
        return data;
    },
    async findAllAttacksForThisCountry(country) {
        const data = await serverSchema.find({ Location: country });
        const results = [];

        for (let i = 0; i < data.length; i++) {
            const attacks = await this.findAllAttacksForThisServer(data[i]._id);
            results.push(...attacks);
        }

        return results;
    },
    async findAllAttacksForThisCountryOnThisUrl(country, url) {
        const data = await this.findAllAttacksForThisCountry(country);
        const filteredAttacks = data.filter(a => a.url == url);
        return filteredAttacks;
    },
    async findAllAttacksOfThisDate(date) {
        const data = await attackInfoSchema.find();

        let dateSpplited = date.split('/')
        let month = dateSpplited[1]
        let year = dateSpplited[2]
        let day = dateSpplited[0]
        let a;
        let arr2 = []

        for (let i = 0; i < data.length; i++) {
            a = data[i].hourStart.split(' ')[2]
            a = a.split('[')[1]
            a = a.split(']')[0]
            if (a == `${day}/${month}/${year}`) {
                arr2.push(data[i])
            }
        }

        return arr2;
    },
    async findAllAttacksOfThisMonth(date) {
        const data = await attackInfoSchema.find();

        let dateSpplited = date.split('/')
        let month = dateSpplited[0]
        let year = dateSpplited[1]
        let a;
        let arr = []

        for (let i = 0; i < data.length; i++) {
            a = data[i].hourStart.split(' ')[2]
            a = a.split('[')[1]
            a = a.split(']')[0]
            a = a.split('/')[1] + '/' + a.split('/')[2]
            if (a == `${month}/${year}`) {
                arr.push(data[i])
            }
        }

        return arr;
    },
    async findAllAttacksOfThisYear(year) {
        const data = await attackInfoSchema.find();
        let a;
        let arr = []

        for (let i = 0; i < data.length; i++) {
            a = data[i].hourStart.split(' ')[2]
            a = a.split('[')[1]
            a = a.split(']')[0]
            if (a.split('/')[2] == year) {
                arr.push(data[i])
            }
        }

        return arr;
    },

    // Attacks in live!
    async findAllAttacksInLive() {
        const data = await serverSchema.find();
        let listaAtaquesEnVivo = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].isAttacking == true) {
                listaAtaquesEnVivo.push(data[i].id)
            }
        }
        
        return listaAtaquesEnVivo;
    }
}