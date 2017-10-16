import { Server } from 'hapi'

import { ThriftPlugin } from '@creditkarma/thrift-server-hapi'
import { CatalogService, IItemArgs, Item } from './codegen/catalog'

const HOST = 'localhost'
const PORT = 3010

const server = new Server({ debug: { request: [ 'error' ] } })

server.connection({
    host: HOST,
    port: PORT,
})

/**
 * Register the thrift plugin.
 *
 * This will allow us to define Hapi routes for our thrift service(s).
 * They behave like any other HTTP route handler, so you can mix and match
 * thrift / REST endpoints on the same server instance.
 */
server.register(ThriftPlugin, (err) => {
    if (err) {
        throw err
    }
})

/**
 * Implementation of our thrift service.
 *
 * Notice the second parameter, "context" - this is the Hapi request object,
 * passed along to our service by the Hapi thrift plugin. Thus, you have access to
 * all HTTP request data from within your service implementation.
 */
const impl = new CatalogService.Processor({
    getAll: (context: Hapi.Request): Promise<Item[]> => {
        const item = new Item({
            itemId: '1001',
            version: 1,
            name: 'Pair of Nike running shoes',
        })
        return Promise.resolve([item])
    },
})

/**
 * Route to our thrift service.
 *
 * Payload parsing is disabled - the thrift plugin parses the raw request
 * using whichever protocol is configured (binary, compact, json...)
 */
server.route({
    method: 'POST',
    path: '/',
    handler: {
        thrift: {
            service: impl,
        },
    },
    config: {
        payload: {
            parse: false,
        },
    },
})

/**
 * Start your hapi server
 */
server.start((err) => {
    if (err) {
        throw err
    }
    server.log('info', `Server running on port ${port}`)
})
