Browser History Flow Controller
=================

Full control of back and forward keys on browser


### Browser
```html
<!-- Polyfill for old browsers -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>

<!-- Import the module -->
<script src="browser-history-flow-controller.js" charset="utf-8"></script>
```

```javascript

var options = {
  forwardButtonAutoEnable: true, //OPTIONAL: Enable forward key when back
  forwardButtonAutoDisable: true, //OPTIONAL: Disable forward key when pushed new route
}

var historyController = new BrowserHistoryFlowController(window.history, options)

//triggers event 'navigate'
historyController.navigate('/otherpage')

//triggers event 'replace'
historyController.replace('/newpageurl')

//triggers event 'backward'
historyController.back()

//triggers event 'forward' only if forward button is enabled
historyController.forward()

//doesn't trigger any event
historyController.url = 'new url'

//Disable (=>) go forward button
historyController.disableForwardButton()

//Enable (=>) go forward button
historyController.enableForwardButton()

//Events are triggered globally

window.addEventListener('backward', function(event){

})

window.addEventListener('forward', function(event){

})

window.addEventListener('navigate', function(event){
  console.log(event.lastLocation, event.location)
  console.log(event.lastURL, event.lastURL)
  console.log('Is hash change:', event.isHashChange)

  if(!event.triggeredManually){
    event.cancel() //url won't change
    event.setUrl(differentUrl) //Replace url
  }

})

window.addEventListener('replace', function(event){
  console.log(event.lastLocation, event.location)
  console.log(event.lastURL, event.lastURL)
})
```

```javascript
//Also you can do
import BrowserHistoryFlowController from 'browser-history-flow-controller'

//Or
const BrowserHistoryFlowController = require('browser-history-flow-controller').default

```
