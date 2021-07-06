class HistoryControllerEvent extends Event{
  constructor(name, {lastLocation, location}){
    super(name)
    this.lastLocation = lastLocation
    this.location = location
  }

  get URL(){
    return new URL(this.location.href)
  }

  get url(){
    return this.URL.toString()
  }

  get lastURL(){
    return new URL(this.lastLocation.href)
  }

  get lastUrl(){
    return this.lastURL.toString()
  }
}

function launchEvent(name, data){
  const event = new HistoryControllerEvent(name, data)
  window.dispatchEvent(event)
}

export { HistoryControllerEvent, launchEvent }
