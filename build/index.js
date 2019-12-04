"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
// Create a new express application instance
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.post('/api/ECB', async (req, res, next) => {
    const adapter = require("./src/adapters/ecb")(req.body);
    const response = await adapter.execute();
    res.send(response);
});
app.listen(port, () => {
    console.log('Server is up and running on port', port);
});
