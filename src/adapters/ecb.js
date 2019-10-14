const R = require('ramda')
const request = require('request')
const Promise = require('bluebird')
const convert = require('xml-js')
const requestAsync = Promise.promisify(request)

const adapter = ({base_currency, currency, report, start_date, end_date}) => {
    const isCross = base_currency !== "EUR"
    const formatRows = (rows) => {
        const getRate = (r) => {
            return isCross ? 1/Number(r["generic:ObsValue"]._attributes.value) : Number(r["generic:ObsValue"]._attributes.value)
        }
        const getDate = (r) => {
            return r["generic:ObsDimension"]._attributes.value
        }
        const format = (r) => {
            return {
                baseCurrency : base_currency,
                currency : currency,
                date : getDate(r),
                rate : Number(getRate(r)).toFixed(4)
            }
        }
        if( Array.isArray(rows) ){
            return R.map(format)(rows)
        } else {
            return [format(rows)]
        }
    }
    const request = async (type) => {
        const response = await requestAsync({
            method : "GET",
            url : `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/${type}.${isCross ? base_currency : currency}.EUR.SP00.A?startPeriod=${start_date}&endPeriod=${end_date}`,
            encoding : null
        })
        const data = JSON.parse(convert.xml2json(response.body.toString(), { compact : true, spaces : 4}))
        const rows = data["message:GenericData"]["message:DataSet"]["generic:Series"]["generic:Obs"]
        return formatRows(rows)
    }
    const execute = async () => {
        const reportMap = {
            daily : "D",
            annual : "A",
            halfYearly : "H",
            monthly : "M",
            quarterly : "Q"
        }
        try {
            const response = await request(reportMap[report])
            return response
        } 
        catch (err) {
            return {
                "status" : "Error",
                "message" : "Error retrieving rates from ECB."
            }
        }
    }
    return {
        execute
    }
}

module.exports = adapter