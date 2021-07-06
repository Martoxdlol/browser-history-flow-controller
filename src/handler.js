import { HistoryControllerEvent, launchEvent } from './events'
import { copyLocation } from './util'

function createPromise(){
  let resolver
  return {
    promise: new Promise((resolve, reject) => {
      resolver = resolve
    }),
    resolver
  }
}

export default function(history){
  let { promise:waitEventPromise, resolver:waitEventPromiseResovler } = createPromise()

  window.addEventListener('popstate', async event => {
    //User triggered event
    const newPos = history.originalHistory.state && history.originalHistory.state.pos
    if(!history.ignoreEvent && newPos != 1){
      const customEventData = {lastLocation: copyLocation(history.lastLocation), location: copyLocation(history.lastLocation)}

      //Push state / navigate event / hash change
      if(!history.originalHistory.state || history.originalHistory.state.pos == undefined || history.originalHistory.state.pos == null){
        //new pushed url
        const href = location.href
        //Prevent handler from doing strange stuff
        history.ignoreEvent++
        //return to pos 1 from pos undefined ==> 2
        history.originalHistory.back()
        //wait back event finish
        await waitEventPromise
        //set correct url
        history.originalHistory.replaceState(history.originalHistory.state, '', href)
        //If new url, should disable forward
        if(history.options.forwardButtonAutoDisable) await history.disableForwardButton()
        //end prevent handler from doing strange stuff
        history.ignoreEvent--
        //The event new location is different on navigate event and only on navigate event
        customEventData.location = copyLocation(location)
        //Launch event
        launchEvent('navigate', customEventData)
      }else
      //Forward event
      if(history.originalHistory.state.pos == 2){
        history.originalHistory.back()
        //Wait back event finish
        await waitEventPromise
        //Launch event
        launchEvent('forward', customEventData)
      }else
      //Backward event
      if(history.originalHistory.state.pos == 0){
        //Use last known location, don't change url
        const href = history.lastLocation.href
        //history.originalHistory.pushState ( back state )
        history.originalHistory.pushState({pos:1}, '', href)
        //Enable forward button
        if(history.options.forwardButtonAutoEnable) await history.enableForwardButton()
        //Launch event
        launchEvent('backward', customEventData)
      }

      //Save new location
      history.lastLocation = copyLocation(location)
    }

    waitEventPromiseResovler(event)
    const { promise, resolver } = createPromise()
    waitEventPromise = promise
    waitEventPromiseResovler = resolver
  })

  return function waitEventTrigger(){
    const promise = waitEventPromise
    const resolver = waitEventPromiseResovler

    //Resolve promise in 100 ms if for some reaason doesn't get resolved by event (ITS NECESARY ON IE)
    let resolved = false
    promise.then(()=>{resolved = true})
    setTimeout(function () {
      if(!resolved) resolver()
    }, 100)
    //////

    return promise
  }
}
