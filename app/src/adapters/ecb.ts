import R = require("ramda")
import request = require("request")
import bluebird = require("bluebird")
import convert = require("xml-js")

const requestAsync : Function = bluebird.promisify(request)

const adapter : Function = ({ base_currency, currency, report, start_date, end_date } : any) => {
    const isCross : boolean = base_currency !== "EUR"

    const formatRows : Function = (rows : any) => {
        const getRate : Function = (r : any) => {
            return isCross ? 1/Number(r["generic:ObsValue"]._attributes.value) : Number(r["generic:ObsValue"]._attributes.value)
        }
        const getDate : Function = (r : any) => {
            return r["generic:ObsDimension"]._attributes.value
        }
        const format : any = (r : any ) => {
            return {
                baseCurrency : base_currency,
                currency : currency,
                date : getDate(r),
                rate : Number(getRate(r)).toFixed(4)
            }
        }
        return Array.isArray(rows) ? R.map(format)(rows) : [format(rows)]
    }

    const request : Function = async (type : string) => {
        const response : any = await requestAsync({
            method : "GET",
            url : `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/${type}.${isCross ? base_currency : currency}.EUR.SP00.A?startPeriod=${start_date}&endPeriod=${end_date}`,
            encoding : null
        })
        const data : any = JSON.parse(convert.xml2json(response.body.toString(), { compact : true, spaces : 4 }))
        const rows : any = data["message:GenericData"]["message:DataSet"]["generic:Series"]["generic:Obs"]
        return formatRows(rows)
    }
    const execute : Function = async () => {
        const reportMap : Function = (type : string) => {
            return R.cond([
                [R.equals("daily"), R.always("D")],
                [R.equals("annual"), R.always("A")],
                [R.equals("halfYearly"), R.always("H")],
                [R.equals("monthly"), R.always("M")],
                [R.equals("quarterly"), R.always("Q")],
            ]) ( type )
        }
        try {
            const response : any = await request(reportMap(report))
            return response
        }
        catch (e){
            return {
                'status' : "Error",
                'message' : "Error retrieving rates from ECB. Please check your request and try again."
            }
        }
    }
    return {
        execute
    }
}

module.exports = adapter