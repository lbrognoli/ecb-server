module.exports = (req, res, next) => {
    const body = req.body
    const message = `Request received for ${req._parsedUrl.pathname} \n Timestamp : ${new Date} \n reqBody : ${JSON.stringify(body, null, 2)}`
    console.log(message)
    next()
}