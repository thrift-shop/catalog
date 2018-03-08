import {
    createClient,
} from '@creditkarma/thrift-client'

import * as childProcess from 'child_process'
import { expect } from 'code'
import * as Lab from 'lab'
import { CoreOptions } from 'request'

import {
    CatalogService,
    Item,
} from '../codegen/catalog'

export const lab = Lab.script()

const describe = lab.describe
const it = lab.it
const before = lab.before
const after = lab.after

describe('Thrift Server Hapi', () => {
    let server: any
    let client: CatalogService.Client<CoreOptions>

    before((done: any) => {
        server = childProcess.fork('./dist/server.js')
        client = createClient(CatalogService.Client, {
            hostName: '0.0.0.0',
            port: parseInt(process.env.PORT || '3010', 10),
        })
        setTimeout(done, 1000)
    })

    it('should return all result for getAll request', async () => {
        return client.getAll().then((response: Item[]) => {
            expect(response.length).to.equal(3)
        })
    })

    after((done: any) => {
        server.kill('SIGINT')
        setTimeout(done, 1000)
    })
})
