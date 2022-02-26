import express from 'express'
import { graphqlHTTP } from 'express-graphql'
// import { useServer } from 'graphql-ws/lib/use/ws'


// function createGraphqlRouter(app: any): express.Router {
const graphqlRouter = express.Router({ mergeParams: true })
graphqlRouter.get('/', (req, res) => {
    console.log('aqui?');

    // ws.on('message', function (message) {
    //     //log the received message and send it back to the client
    //     console.log('received: %s', message)
    //     ws.send(`Hello, you sent -> ${message}`)
    // })
})
// graphqlRouter.ws('/subscriptions/notes', (ws, req) => { })

// graphqlRouter.use('/', graphqlHTTP({
//     schema: graphqlServerDefinitions.schema,
//     rootValue: graphqlServerDefinitions.resolvers,
//     // graphql: true,
//     customFormatErrorFn: (error) => {
//         return {
//             message: error.message,
//             stack: error.stack ? error.stack.split('\n') : [],
//             path: error.path
//         }
//     }
// }))
//     return graphqlRouter
// }

export default graphqlRouter
