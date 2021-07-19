import { HistoryControllerEvent } from './events'
import { copyLocation } from './util'

function createPromise() {
  let resolver
  return {
    promise: new Promise((resolve, reject) => {
      resolver = resolve
    }),
    resolver
  }
}

export default function handleEvent() {
  let { promise: waitEventPromise, resolver: waitEventPromiseResovler } = createPromise()

  window.addEventListener('popstate', async event => {
    //User triggered event
    const newPos = this.originalHistory.state && this.originalHistory.state.pos
    if (!this.ignoreEvent && newPos != 1) {
      const customEventData = { lastLocation: copyLocation(this.lastLocation), location: copyLocation(location), history: this }

      //Push state / navigate event / hash change
      if (!this.originalHistory.state || this.originalHistory.state.pos == undefined || this.originalHistory.state.pos == null) {
        //new pushed url
        this.url = location.href
        //Prevent handler from doing strange stuff
        this.ignoreEvent++
        //return to pos 1 from pos undefined ==> 2
        this.originalHistory.back()
        //wait back event finish
        await waitEventTrigger()

        //Add event options
        //cancel: keeps original url
        customEventData.cancel = () => {
          this.url = this.lastLocation.href
        }

        //Actually the only way this event is trigerred by popstate is by a hashchange
        customEventData.isHashChange = true

        //Launch event
        this.launchEvent('navigate', customEventData)
        //If new url, should disable forward
        if (this.options.forwardButtonAutoDisable) await this.disableForwardButton()
        //end prevent handler from doing strange stuff
        this.ignoreEvent--
        //The event new location is different on navigate event and only on navigate event
        customEventData.location = copyLocation(location)
      } else
        //Forward event
        if (this.originalHistory.state.pos == 2) {
          this.originalHistory.back()
          //Wait back event finish
          await waitEventTrigger()
          //Launch event
          this.launchEvent('forward', customEventData)
        } else
          //Backward event
          if (this.originalHistory.state.pos == 0) {
            //Use last known location, don't change url
            const href = this.lastLocation.href
            //this.originalHistory.pushState ( back state )
            this.originalHistory.pushState({ pos: 1 }, '', href)
            //Event can be cancelled (doesn't do much)
            let cancelled = false
            customEventData.cancel = () => cancelled = true
            //Launch event
            this.launchEvent('backward', customEventData)
            //Enable forward button
            if (this.options.forwardButtonAutoEnable && !cancelled) await this.enableForwardButton()
          }

      if (this._nextUrl) {
        //set correct url
        this.originalHistory.replaceState(this.originalHistory.state, '', href)
        //Reset value
        this._nextUrl = null
      }


      //Save new location
      this.lastLocation = copyLocation(location)
    }

    waitEventPromiseResovler(event)
    const { promise, resolver } = createPromise()
    waitEventPromise = promise
    waitEventPromiseResovler = resolver
  })

  function waitEventTrigger() {
    const promise = waitEventPromise
    const resolver = waitEventPromiseResovler

    //Resolve promise in 100 ms if for some reaason doesn't get resolved by event (ITS NECESARY ON IE)
    let resolved = false
    promise.then(() => { resolved = true })
    setTimeout(function () {
      if (!resolved) resolver()
    }, 100)
    //////

    return promise
  }

  return waitEventTrigger
}
