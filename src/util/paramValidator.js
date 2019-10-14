const R = require('ramda')
const moment = require('moment')

const validator = (req, res, next) => {
    const { bank, base_currency, currency, report, start_date, end_date } = req.body
    const validationMap = require("./validationMap")
    //validate bank
    const validBanks = R.map(v => v.bank )(validationMap)
    const isBankValid = R.any(bank)(validBanks)
    if ( isBankValid ) {
        const selectedBank = R.find(R.propEq('bank', bank))(validationMap)
        
        const isBaseCcyValid = R.any(base_currency)(selectedBank.base_currencies)
        if ( isBaseCcyValid ) {
            const isCcyValid = R.any(currency)(selectedBank.available_currencies)
            if ( isCcyValid ) {
                const isReportValid = R.any(report)(selectedBank.reports)
                if ( isReportValid ) {

                } else {
                    res.status(400).send("Invalid Report for the selected Bank")
                }
            } else {
                res.status(400).send("Invalid Currency for the selected Bank")
            }
        } else {
            res.status(400).send("Invalid Base Currency for the selected Bank")
        }
    } else {
        res.status(400).send("Invalid Bank Code")
    }
    // validate currencies
    
    // validate reports
    // validate dates 
}

module.exports = validator