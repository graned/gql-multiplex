import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { Logger } from 'tslog'
// import expressWs from 'express-ws'
import { GraphqlRouter } from './gql.router'
import * as WebSocket from 'ws'

import * as http from 'http'

class SubscriptionServer {
  private _wss: WebSocket.Server

  constructor(
    private readonly _httpServer: any,
    private readonly _wsPath: string
  ) { }

  start() {
    this._wss = new WebSocket.Server({ server: this._httpServer, path: this._wsPath })

    this._wss.on('connection', (ws: any) => {
      // ws.isAlive = 1

      // ws.on('pong', () => {
      //   ws.isAlive = 1
      // })
      //connection is up, let's add a simple simple event
      ws.on('message', (message: string) => {
        //log the received message and send it back to the client
        console.log('received: %s', message)
        // ws.send(`Hello, you sent -> ${message}`)
      })

      // setInterval(() => {
      //   this._wss.clients.forEach((ws: any) => {
      //     if (!ws.isAlive) return ws.terminate()

      //     ws.isAlive = 0
      //     ws.ping(null, 0, 1)
      //   })
      // }, 10000)

      //send immediatly a feedback to the incoming connection    
      // ws.send({ msg: 'Hi there, I am a WebSocket server' })
    })
  }

  get wss() {
    return this._wss
  }
}

export class ApiServer {
  private _app: any
  private _httpServer: any
  private _subscriptionServer: SubscriptionServer
  private PORT: number = 9000
  private HOST: string = '0.0.0.0'
  private readonly _logger: Logger = new Logger({ name: 'ApiServer' })
  private readonly _morganLogger = morgan(
    '[:date[iso]] - apiServer - :remote-addr :method :url :status :res[content-length] - :response-time ms'
  )

  constructor() {
    this._app = express()
    this._httpServer = http.createServer(this._app)
    this._subscriptionServer = new SubscriptionServer(this._httpServer, '/graphql/subscriptions')
    // expressWs(this._app, this._httpServer, { leaveRouterUntouched: false })
  }

  start(): void {
    this._subscriptionServer.start()
    this._app.use(express.json())
    this._app.use(express.text({ limit: '50mb', type: 'text/*' }))
    this._app.use(express.urlencoded({ extended: false }))
    this._app.use(this._morganLogger)
    this._app.use(cors())
    this._app.get('/helo', (req, res) => {
      res.send('world')
    })

    // var router = express.Router()
    // router.ws('/echo', function (ws, req) {
    //   ws.on('message', function (msg) {
    //     ws.send(msg)
    //   })
    // })

    // this._app.use("/ws-stuff", router)

    this._app.use('/graphql', GraphqlRouter.createRouter(this._subscriptionServer.wss))
    // this._app.ws('/helo', (ws, req) => {
    //   ws.on('message', function (message) {
    //     //log the received message and send it back to the client
    //     console.log('received: %s', message)
    //     ws.send(`Hello, you sent -> ${message}`)
    //   })
    //   //send immediatly a feedback to the incoming connection    
    //   ws.send('Hi there, I am a WebSocket server')
    // })

    this._httpServer.listen(this.PORT, this.HOST, () => {
      this._logger.info(`Server started at ${this.HOST}:${this.PORT}`)
    })
  }

  get httpServer(): any {
    return this._httpServer
  }
}
