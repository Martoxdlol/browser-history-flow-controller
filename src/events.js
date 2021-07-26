class HistoryControllerEvent{
  constructor({lastLocation, location, setUrl, cancel, isHashChange, triggeredManually, _exit, history}){
    this.lastLocation = lastLocation
    this.location = location
    this._cancel = cancel
    this.history = history
    this.cancelled = false
    this.isHashChange = !!isHashChange
    this.triggeredManually = !!triggeredManually
    this.exit = _exit
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
    this.history.url = url
  }

  set url(url){
    this.setUrl(url)
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

export { HistoryControllerEvent }
