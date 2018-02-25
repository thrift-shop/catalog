import { Request, Server } from 'hapi'

import { ThriftPlugin } from '@creditkarma/thrift-server-hapi'

import { catalogServiceImpl as service } from './serviceImpl'

const HOST = '0.0.0.0'
const PORT = process.env.PORT || 3010;

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
    if (err) { throw err }
})

/**
 * Register server and request logger
 */
server.register({
    register: require('good'),
    options: {
        ops: {
            interval: 1000,
        },
        reporters: {
            myConsoleReporter: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }],
            }, {
                module: 'good-console',
            }, 'stdout'],
        },
    },
}, (err) => {
    if (err) { throw err }
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
            service,
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
    server.log('info', `Server running on port ${PORT}`)
})
