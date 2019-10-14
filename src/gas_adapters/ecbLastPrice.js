const R = require('ramda')
const moment = require('moment')
const bd = require("moment-business-days")
 
const getLastPrice = async (base_currency, currency) => {
    const adapter = require(`../adapters/ecb`)({
        base_currency : base_currency,
        currency : currency,
        report : "daily",
        start_date : bd(new Date()).prevBusinessDay().format("YYYY-MM-DD"),
        end_date : moment(new Date()).format("YYYY-MM-DD")
    })
    const response = await adapter.execute()
    return R.last(response)
}

module.exports =  { getLastPrice }