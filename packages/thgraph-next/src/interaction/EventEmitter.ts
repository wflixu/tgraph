import type { Cell, Geometry, Point, GraphEventMap } from '../types'

/**
 * Event listener function type
 */
export type EventListener<T = any> = (event: T) => void

/**
 * Type-safe event emitter for graph events
 */
export class EventEmitter {
  private listeners = new Map<string, Set<EventListener>>()

  /**
   * Add an event listener
   */
  on<K extends keyof GraphEventMap>(event: K, listener: EventListener<GraphEventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener)
  }

  /**
   * Add an event listener that will be called only once
   */
  once<K extends keyof GraphEventMap>(event: K, listener: EventListener<GraphEventMap[K]>): void {
    const onceWrapper = (eventData: GraphEventMap[K]) => {
      listener(eventData)
      this.off(event, onceWrapper)
    }
    this.on(event, onceWrapper)
  }

  /**
   * Remove an event listener
   */
  off<K extends keyof GraphEventMap>(event: K, listener: EventListener<GraphEventMap[K]>): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.delete(listener)
      if (eventListeners.size === 0) {
        this.listeners.delete(event)
      }
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners<K extends keyof GraphEventMap>(event?: K): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }

  /**
   * Emit an event to all listeners
   */
  emit<K extends keyof GraphEventMap>(event: K, eventData: GraphEventMap[K]): void {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      // Create a copy to avoid issues with listeners being added/removed during iteration
      const listeners = Array.from(eventListeners)
      listeners.forEach(listener => {
        try {
          listener(eventData)
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error)
        }
      })
    }
  }

  /**
   * Check if there are listeners for an event
   */
  hasListeners<K extends keyof GraphEventMap>(event: K): boolean {
    const eventListeners = this.listeners.get(event)
    return eventListeners ? eventListeners.size > 0 : false
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount<K extends keyof GraphEventMap>(event: K): number {
    const eventListeners = this.listeners.get(event)
    return eventListeners ? eventListeners.size : 0
  }

  /**
   * Get all event names that have listeners
   */
  eventNames(): (keyof GraphEventMap)[] {
    return Array.from(this.listeners.keys()) as (keyof GraphEventMap)[]
  }
}

/**
 * Global event emitter instance for application-wide events
 */
export const globalEventEmitter = new EventEmitter()