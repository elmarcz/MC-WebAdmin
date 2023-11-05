module.exports = (app, functions, isLoggedIn) => {

    app.get('/analytics', isLoggedIn, async (req, res) => {
        const todayDate = new Date()

        let month = todayDate.getMonth() + 1
        let year = todayDate.getFullYear()
        let day = todayDate.getDate()

        let arr1 = await functions.findAllAttacksOfThisMonth(`${month}/${year}`)
        let arr2 = await functions.findAllAttacksOfThisDate(`${day}/${month}/${year}`)

        res.render('ddos/analytics', {
            attackDay: arr2.reverse(),
            attackMonth: arr1.reverse()
        });
    });

}