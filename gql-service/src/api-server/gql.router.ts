import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { useServer } from 'graphql-ws/lib/use/ws'

const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge')
const { buildSchema, print } = require('graphql')

import gqlSchema from './gql.schema'
import { GqlResolver } from './gql.resolvers'


export class GraphqlRouter {
    static createRouter(wss: any): express.Router {
        const graphqlRouter: express.Router = express.Router({ mergeParams: true })

        const gqlResolver = new GqlResolver()

        const types = mergeTypeDefs([gqlSchema])
        const resolvers = mergeResolvers([{
            createNote: gqlResolver.createNote,
            newNoteCreated: gqlResolver.newNoteCreated,
            getNotes: gqlResolver.getNotes
        }])

        graphqlRouter.use('/', graphqlHTTP({
            schema: buildSchema(print(types)),
            rootValue: resolvers,
            customFormatErrorFn: (error) => {
                return {
                    message: error.message,
                    stack: error.stack ? error.stack.split('\n') : [],
                    path: error.path
                }
            }
        }))

        // Uses current wss server to expose subscriptions
        useServer({
            schema: buildSchema(print(types)),
            roots: {
                mutation: { createNote: gqlResolver.createNote },
                subscription: { newNoteCreated: gqlResolver.newNoteCreated }
            }
        }, wss)

        return graphqlRouter
    }
}
