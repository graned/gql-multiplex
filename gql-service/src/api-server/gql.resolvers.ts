import { PubSub } from './PubSub'

const _pubSub: PubSub = new PubSub()
export class GqlResolver {

    async *newNoteCreated() {
        for await (const data of _pubSub.subscribe('NOTE_CREATED')) {
            yield ({ newNoteCreated: data })
        }
    }

    async createNote(delta: any) {
        _pubSub.publish('NOTE_CREATED', Object.assign({}, delta.note, { id: 1 }))
        return Object.assign({}, delta.note, { id: 1 })
    }

    async getNotes() {
        return [{ msg: 'Hello' }]
    }
}