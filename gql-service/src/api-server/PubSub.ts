import { EventEmitter, on } from 'events'

export class PubSub {
    private _emitter: EventEmitter

    constructor() {
        this._emitter = new EventEmitter()
    }

    publish(topic: string, payload: any) {
        this._emitter.emit(topic, payload)
    }

    async *subscribe(topic: string) {
        console.log('> subscrito a', topic)

        const asyncIterator = on(this._emitter, topic)
        for await (const [value] of asyncIterator) {
            yield value
        }
    }

    unsubscribeAll(topic) {
        this._emitter.removeAllListeners(topic)
    }

    get emitter() {
        return this._emitter
    }
}
