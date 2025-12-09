import { expect, test, describe, vi } from 'vitest'
import { EventEmitter, globalEventEmitter } from '../src/interaction/EventEmitter'
import type { Cell, GraphEventMap } from '../src/types'

describe('EventEmitter', () => {
  test('should add and remove event listeners', () => {
    const emitter = new EventEmitter()
    const listener = vi.fn()

    emitter.on('cell:click', listener)
    emitter.emit('cell:click', {
      cell: {} as Cell,
      event: {} as MouseEvent
    })

    expect(listener).toHaveBeenCalledTimes(1)

    emitter.off('cell:click', listener)
    emitter.emit('cell:click', {
      cell: {} as Cell,
      event: {} as MouseEvent
    })

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('should handle multiple listeners for same event', () => {
    const emitter = new EventEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    emitter.on('cell:click', listener1)
    emitter.on('cell:click', listener2)

    const eventData = {
      cell: {} as Cell,
      event: {} as MouseEvent
    }

    emitter.emit('cell:click', eventData)

    expect(listener1).toHaveBeenCalledWith(eventData)
    expect(listener2).toHaveBeenCalledWith(eventData)
  })

  test('should support once listeners', () => {
    const emitter = new EventEmitter()
    const listener = vi.fn()

    emitter.once('cell:click', listener)

    const eventData = {
      cell: {} as Cell,
      event: {} as MouseEvent
    }

    emitter.emit('cell:click', eventData)
    emitter.emit('cell:click', eventData)

    expect(listener).toHaveBeenCalledTimes(1)
  })

  test('should handle errors in listeners gracefully', () => {
    const emitter = new EventEmitter()
    const errorListener = vi.fn(() => {
      throw new Error('Test error')
    })
    const normalListener = vi.fn()

    // Mock console.error to avoid test output
    const originalError = console.error
    console.error = vi.fn()

    emitter.on('cell:click', errorListener)
    emitter.on('cell:click', normalListener)

    const eventData = {
      cell: {} as Cell,
      event: {} as MouseEvent
    }

    emitter.emit('cell:click', eventData)

    expect(normalListener).toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Error in event listener for \'cell:click\':', expect.any(Error))

    // Restore console.error
    console.error = originalError
  })

  test('should provide listener count information', () => {
    const emitter = new EventEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    expect(emitter.listenerCount('cell:click')).toBe(0)

    emitter.on('cell:click', listener1)
    expect(emitter.listenerCount('cell:click')).toBe(1)

    emitter.on('cell:click', listener2)
    expect(emitter.listenerCount('cell:click')).toBe(2)

    emitter.off('cell:click', listener1)
    expect(emitter.listenerCount('cell:click')).toBe(1)
  })

  test('should check if listeners exist', () => {
    const emitter = new EventEmitter()
    const listener = vi.fn()

    expect(emitter.hasListeners('cell:click')).toBe(false)

    emitter.on('cell:click', listener)
    expect(emitter.hasListeners('cell:click')).toBe(true)

    emitter.off('cell:click', listener)
    expect(emitter.hasListeners('cell:click')).toBe(false)
  })

  test('should provide event names list', () => {
    const emitter = new EventEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    emitter.on('cell:click', listener1)
    emitter.on('cell:double-click', listener2)

    const eventNames = emitter.eventNames()
    expect(eventNames).toContain('cell:click')
    expect(eventNames).toContain('cell:double-click')
    expect(eventNames).toHaveLength(2)
  })

  test('should remove all listeners for specific event', () => {
    const emitter = new EventEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    emitter.on('cell:click', listener1)
    emitter.on('cell:click', listener2)
    emitter.on('cell:double-click', listener2)

    emitter.removeAllListeners('cell:click')

    expect(emitter.hasListeners('cell:click')).toBe(false)
    expect(emitter.hasListeners('cell:double-click')).toBe(true)
  })

  test('should remove all listeners for all events', () => {
    const emitter = new EventEmitter()
    const listener1 = vi.fn()
    const listener2 = vi.fn()

    emitter.on('cell:click', listener1)
    emitter.on('cell:double-click', listener2)

    emitter.removeAllListeners()

    expect(emitter.hasListeners('cell:click')).toBe(false)
    expect(emitter.hasListeners('cell:double-click')).toBe(false)
  })
})

describe('GlobalEventEmitter', () => {
  test('should be available and work like regular emitter', () => {
    const listener = vi.fn()

    globalEventEmitter.on('cell:click', listener)
    globalEventEmitter.emit('cell:click', {
      cell: {} as Cell,
      event: {} as MouseEvent
    })

    expect(listener).toHaveBeenCalledTimes(1)

    globalEventEmitter.removeAllListeners('cell:click')
  })
})