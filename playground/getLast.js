const axios = require('axios')
const moment = require('moment')
const bd = require("moment-business-days")
 
const getLast = async (base_currency, currency) => {
  const response = await axios({
    url: 'http://localhost:3000/api/ECB',
    method: 'POST',
    data: {
      "base_currency" : base_currency,
      "currency" : currency,
      "report" : "daily",
      "start_date" : bd(new Date()).prevBusinessDay().format("YYYY-MM-DD"),
      "end_date" : moment(new Date()).format("YYYY-MM-DD")
    }
  })
  return response
}

(async () => {
    const response = await getLast("EUR", "BRL")
    console.log(response)
})()
 
//module.exports = getLast