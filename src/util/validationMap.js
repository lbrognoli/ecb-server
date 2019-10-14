
const banks = [
    {
        bank : "ECB",
        base_currencies : ['EUR'],
        available_currencies : ["AUD","BGN","BRL","CAD","CHF","CNY","CZK","DKK","GBP","HKD","HRK","HUF","IDR","ILS","INR","ISK","JPY","KRW","MXN","MYR","NOK","NZD","PHP","PLN","RON","RUB","SEK","SGD","THB","TRY","USD","ZAR"],
        reports : ['last_price', 'date_range', 'monthly_average', 'quarterly_average', 'month_end']
    }
]

module.exports = banks
