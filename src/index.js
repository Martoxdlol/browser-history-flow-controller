import handleEvent from './handler'
import { HistoryControllerEvent, launchEvent } from './events'
import { copyLocation } from './util'
const DEFAULT_OPTIONS = {
  forwardButtonAutoEnable: true,
  forwardButtonAutoDisable: true,
}

class BrowserHistoryFlowController{
  constructor(originalHistory, options){
    //General purpose options
    this.options = {...DEFAULT_OPTIONS, ...options}

    //Browser real history
    this.originalHistory = originalHistory

    //Store last location info
    this.lastLocation = copyLocation(location)

    //toggle this on when popstate event is espected to happen
    //0 == false
    this.ignoreEvent = 0

    //keeps track of forward button enable state
    this.forwardButtonEnabled = false

    //Inicializar sistema
    this.initHistory()

    //handles popstate event
    this.waitEventTrigger = handleEvent(this)
  }

  initHistory(){
    // HISTORY STATES: [ state = {pos: 0 } ]       [ state = {pos: 1 } ]             [ state = {pos: 2 } ]   => the last block can be romeved to disable forward button
    //       USED TO DETECT BACK                  KEEP TEH USER ALLWAYS HERE        USED TO DETECT FORWARD
    // If user goes back: the event handler will detect pos = 0 and take action as back event
    // If user goes forward: the event handler will detect pos = 2 and take action as forward event
    // If user use hash navigation: the event handler will detect pos = undefined and take action as navigate event
    this.originalHistory.replaceState({pos:0},'')
    this.originalHistory.pushState({pos:1},'')
  }

  async enableForwardButton(){
    //Prevent handler from doing strange stuff
    this.ignoreEvent++
    //Ensure there are a 3rd block (pos: 2)
    this.originalHistory.pushState({pos:2},'')
    //Returns to pos:1
    this.originalHistory.back()
    //Wait event call
    await this.waitEventTrigger()
    //Keep track of state
    this.forwardButtonEnabled = true
    //
    this.ignoreEvent--
  }

  async disableForwardButton(){
    //new pushed url
    const href = location.href
    //Prevent handler from doing strange stuff
    this.ignoreEvent++
    //return to pos 1 from pos undefined ==> 2
    this.originalHistory.back()
    //wait back event finish
    await this.waitEventTrigger()
    //set correct url
    this.originalHistory.pushState({pos:1},'',href)
    //Keeps track of forwardButtonEnabled
    this.forwardButtonEnabled = false
    //
    this.ignoreEvent--
  }

  async pushState(data, title, url){
    //Change url and stay on block 1
    this.originalHistory.replaceState({pos:1}, title, url)
    //Disables forward
    if(this.options.forwardButtonAutoDisable) await this.disableForwardButton()
    //Create event
    const customEventData = {lastLocation:this.lastLocation, location}
    //Update last location
    this.lastLocation = {...location}
    //Launch event
    launchEvent('navigate', customEventData)
  }

  async replaceState(data, title, url){
    //Change url and stay on block 1
    this.originalHistory.replaceState({pos:1}, title, url)
    //Create event
    const customEventData = {lastLocation:this.lastLocation, location}
    //Update last location
    this.lastLocation = {...location}
    //Launch event
    launchEvent('replace', customEventData)
  }

  forward(){
    this.originalHistory.forward()
  }

  back(){
    this.originalHistory.back()
  }

  push(url){
    this.pushState(null, null, url)
  }

  //Navigate and push are the same
  navigate(...args){
    this.push(...args)
  }

  replace(url){
    this.replaceState(null, null, url)
  }

}

module.export = BrowserHistoryFlowController

if(typeof window == 'object'){
  window.BrowserHistoryFlowController = BrowserHistoryFlowController
}