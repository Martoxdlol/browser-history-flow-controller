class HistoryControllerEvent extends Event{
  constructor(name, {lastLocation, location, setUrl, cancel, isHashChange, triggeredManually}){
    super(name)
    this.lastLocation = lastLocation
    this.location = location
    this._cancel = cancel
    this._setUrl = setUrl
    this.cancelled = false
    this.isHashChange = !!isHashChange
    this.triggeredManually = !!triggeredManually
  }

  cancel(){
    if(this._cancel) {
      this._cancel()
      this.cancelled = true
      return true
    }
    return false
  }

  setUrl(url){
    if(this._setUrl) {
      this._setUrl(url)
      return true
    }
    return false
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
