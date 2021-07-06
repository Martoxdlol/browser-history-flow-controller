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

historyController.navigate('/otherpage')

historyController.replace('/newpageurl')

historyController.back()

historyController.forward()

historyController.disableForwardButton()

historyController.enableForwardButton()


window.addEventListener('backward', function(event){

})

window.addEventListener('forward', function(event){

})

window.addEventListener('navigate', function(event){
  console.log(event.lastLocation, event.location)
  console.log(event.lastURL, event.lastURL)
})

window.addEventListener('replace', function(event){
  console.log(event.lastLocation, event.location)
  console.log(event.lastURL, event.lastURL)
})
```