const schedule = require("node-schedule")
const axios = require("axios")
const Currencies = require("../models/Currencies");


const job = schedule.scheduleJob('0 0 */12 * * *',
    async function () {

        try {
            await axios.get("https://api.apilayer.com/currency_data/live?source=MUR&currencies=USD", {
                headers: {
                    'apikey': 'UpMe25jelKoRZ78TLzPpB2RGIBH27qor'
                }
            }

            ).then(async res => {

                if (res.status === 200 && res.data.source === "MUR") {
                    await Currencies.findOneAndUpdate({ type: "MUR" }, { rate: res.data.quotes.MURUSD })
                }
            })
        } catch (err) {
            console.log(err)
        }


    });