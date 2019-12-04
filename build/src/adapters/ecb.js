"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const R = require("ramda");
const request = require("request");
const bluebird = require("bluebird");
const convert = require("xml-js");
const requestAsync = bluebird.promisify(request);
const adapter = ({ base_currency, currency, report, start_date, end_date }) => {
    const isCross = base_currency !== "EUR";
    const formatRows = (rows) => {
        const getRate = (r) => {
            return isCross ? 1 / Number(r["generic:ObsValue"]._attributes.value) : Number(r["generic:ObsValue"]._attributes.value);
        };
        const getDate = (r) => {
            return r["generic:ObsDimension"]._attributes.value;
        };
        const format = (r) => {
            return {
                baseCurrency: base_currency,
                currency: currency,
                date: getDate(r),
                rate: Number(getRate(r)).toFixed(4)
            };
        };
        return Array.isArray(rows) ? R.map(format)(rows) : [format(rows)];
    };
    const request = async (type) => {
        const response = await requestAsync({
            method: "GET",
            url: `https://sdw-wsrest.ecb.europa.eu/service/data/EXR/${type}.${isCross ? base_currency : currency}.EUR.SP00.A?startPeriod=${start_date}&endPeriod=${end_date}`,
            encoding: null
        });
        const data = JSON.parse(convert.xml2json(response.body.toString(), { compact: true, spaces: 4 }));
        const rows = data["message:GenericData"]["message:DataSet"]["generic:Series"]["generic:Obs"];
        return formatRows(rows);
    };
    const execute = async () => {
        const reportMap = (type) => {
            return R.cond([
                [R.equals("daily"), R.always("D")],
                [R.equals("annual"), R.always("A")],
                [R.equals("halfYearly"), R.always("H")],
                [R.equals("monthly"), R.always("M")],
                [R.equals("quarterly"), R.always("Q")],
            ])(type);
        };
        try {
            const response = await request(reportMap(report));
            return response;
        }
        catch (e) {
            return {
                'status': "Error",
                'message': "Error retrieving rates from ECB. Please check your request and try again."
            };
        }
    };
    return {
        execute
    };
};
module.exports = adapter;
