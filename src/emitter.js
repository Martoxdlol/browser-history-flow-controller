import { HistoryControllerEvent } from './events'

class EventEmitter{
  constructor(){
    this.eventHandlers = {}
  }

  addEventListener(name, handler){
    if(!this.eventHandlers[name]) this.eventHandlers[name] = new Set()
    this.eventHandlers[name].add(handler)
  }

  removeEventListener(name, handler){
    if(!this.eventHandlers[name]) this.eventHandlers[name] = new Set()
    this.eventHandlers[name].delete(handler)
  }

  emit(name, event){
    if(!this.eventHandlers[name]) this.eventHandlers[name] = new Set()
    for(const cb of this.eventHandlers[name]){
      let stop = false
      event.stopPropagation = () => stop = true 
      cb.call(this, event)
      if(stop) break
    }
  }

  launchEvent(name, data){
    const event = new HistoryControllerEvent(data)
    this.emit(name, event)
  }
}

export default function makeEmitter(instance){
  //this function adds events emitting capabilities to any object/instance
  const emitter = new EventEmitter()
  instance.eventEmitter = emitter
  instance.eventHandlers = emitter.eventHandlers
  instance.addEventListener = emitter.addEventListener
  instance.removeEventListener = emitter.removeEventListener
  instance.emit = emitter.emit
  instance.launchEvent = emitter.launchEvent
}
