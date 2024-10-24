const { config } = require('dotenv')
const http = require("http");
const cors = require('cors')
const express = require('express')


config()

const APP_PORT = process.env.PORT;

const app = require('./src/app');
app.use(cors())
app.use(express.json())
const { socketConnect } = require('./src/socket');
const connectDB = require('./src/db.js');

const server = http.createServer(app);

socketConnect(server)

connectDB()

app.use('/pou', require('./src/pou.js'))




server.listen(APP_PORT, console.log(`PORT: ${APP_PORT}`))