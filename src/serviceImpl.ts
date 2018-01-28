import { CatalogService, IItemArgs, Item } from './codegen/catalog'

const data = [
    {
        itemId: '1001',
        version: 1,
        name: 'Pair of Nike running shoes',
    },
    {
        itemId: '1002',
        version: 2,
        name: 'Alarm clock',
    },
    {
        itemId: '1010',
        version: 1,
        name: 'Old stop sign',
    },
]

/**
 * Implementation of our thrift service.
 *
 * Notice the second parameter, "context" - this is the Hapi request object,
 * passed along to our service by the Hapi thrift plugin. Thus, you have access to
 * all HTTP request data from within your service implementation.
 */
export const catalogServiceImpl = new CatalogService.Processor({
    getAll(context?: Request): Promise<Item[]> {
        const items = data.map((item) => new Item(item))
        return Promise.resolve(items)
    },
})
