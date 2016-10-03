const path = require('path')
const express = require('express')
const Parse = require('parse/node')
const { ParseServer } = require('parse-server')

const SERVER_PORT = process.env.PORT || 8080
const SERVER_HOST = process.env.HOST || 'localhost'
const APP_ID = process.env.APP_ID || 'hackathon'
const MASTER_KEY = process.env.MASTER_KEY || 'haha'
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/hackathon'
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'

Parse.initialize(APP_ID)
Parse.serverURL = `http://localhost:${SERVER_PORT}/parse`
Parse.masterKey = MASTER_KEY
Parse.Cloud.useMasterKey()

const server = express()

server.use(
  '/parse',
  new ParseServer({
    databaseURI: DATABASE_URI,
    cloud: path.resolve(path.join(__dirname, 'src'), 'cloud.js'),
    appId: APP_ID,
    masterKey: MASTER_KEY,
    serverURL: `http://${SERVER_HOST}:${SERVER_PORT}/parse`,
  })
)

server.listen(SERVER_PORT, () => console.log(
  `Server is now running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${SERVER_PORT}`
))
