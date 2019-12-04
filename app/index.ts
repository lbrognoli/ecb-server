import express = require('express');
import cors = require("cors");


// Create a new express application instance
const app: express.Application = express();
const port: any = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())

app.post('/api/ECB',  async (req : any, res : any, next : any) => {
    const adapter : any = require("./src/adapters/ecb")(req.body)
    const response : any = await adapter.execute()
    res.send(response)
});

app.listen(port,  () => {
  console.log('Server is up and running on port', port);
});