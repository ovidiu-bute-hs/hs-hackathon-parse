const path = require('path')
const express = require('express')
const Parse = require('parse/node')
const { ParseServer } = require('parse-server')

const SERVER_PORT = process.env.PORT || 8080
const SERVER_HOST = process.env.HOST || '192.168.1.137'
const APP_ID = process.env.APP_ID || 'hackathon'
const MASTER_KEY = process.env.MASTER_KEY || 'haha'
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/hackathon'
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'

Parse.initialize(APP_ID)
Parse.serverURL = `http://localhost:${SERVER_PORT}/parse`
Parse.masterKey = MASTER_KEY
Parse.Cloud.useMasterKey()

const app = express()

app.use(
  '/parse',
  new ParseServer({
    databaseURI: DATABASE_URI,
    cloud: path.resolve(path.join(__dirname, 'src'), 'cloud.js'),
    appId: APP_ID,
    masterKey: MASTER_KEY,
    serverURL: `http://${SERVER_HOST}:${SERVER_PORT}/parse`,
    liveQuery: {
      classNames: ['BucharestOffice']
    }
  })
)

let httpServer = require('http').createServer(app)
httpServer.listen(SERVER_PORT)
let parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer)
