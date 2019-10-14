const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
//const requestLogger = require('./src/util/requestLogger')
//app.use(requestLogger)

app.post("/api/ECB", async (req, res, next) => {
    const adapter = require(`./src/adapters/ecb.js`)(req.body)
    const response = await adapter.execute()
    res.send(response)
})

// app.get("/api/ECB/GAS/LastPrice", async (req, res, next) => {
//     const adapter = require("./src/gas_adapters/ecbLastPrice")
//     const response = await adapter.getLastPrice(req.query.base_currency,req.query.currency)
//     res.send(response)
// })

app.listen(PORT, () => {
    console.log("Server is up and listening in port", PORT)
})




