const Websocket = require('ws')
const uuid = require('uuid')
const { createClient } = require('graphql-ws')
const gqlQueryBuilder = require('gql-query-builder')
const Observable = require('zen-observable')

let retries = 0

function toObservable (operation, client) {
  return new Observable((observer) => {
    client.subscribe(operation, {
      next: (data) => observer.next(data),
      error: (err) => observer.error(err),
      complete: () => observer.complete()
    })
  })
}


async function connectToSubscription () {
  return new Promise((resolve, reject) => {
    const client = createClient({
      url: 'ws://0.0.0.0:9000/graphql/subscriptions',
      lazy: true,
      webSocketImpl: Websocket,
      generateID: uuid.v4
    })  
    
    const query = gqlQueryBuilder.subscription({
      operation: 'Note: newNoteCreated',
      fields: ['id', 'msg'],
      variables: {}
    })
    
    const observable = toObservable({ ...query }, client)
    
    observable.subscribe({
      next: (note) => {
        console.log('>>> got data from web socket', note)
      },
      error: (err) => {
        console.log('>>> got error from web socket', err)

        // RETRY CONNECTION mechanism
        // const interval = setInterval(() => {
        //   if (retries < 10) {
        //     console.log('>>> trying to reconnect')
        //     connectToSubscription().then(() => {
        //       clearInterval(interval)
        //       retries = 0
        //     }).catch(err => {console.log(err.message)})
        //     retries++
        //   } else {
        //     clearInterval(interval)
        //   }
        // }, 2000)
      },
      complete: () => {
        console.log('>>> completed')
      }
    })
  
    client.on('connected', resolve)
    client.on('error', reject)
  })
}

connectToSubscription ().then().catch(console.error)