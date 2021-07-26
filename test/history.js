var historyController = new BrowserHistoryFlowController(history)

var position = 0
var list = [
    {
        url: location.href,
        state: null,
    }
]



historyController.addEventListener('backward', function (event) {
    if (position == 0) {
        historyController.exit()
    } else {
        position--
        event.url = history2.url
    }
    _printHistory()
})

historyController.addEventListener('forward', function (event) {
    if (position < list.length - 1) {
        position++
        event.url = history2.url
        if (position == list.length - 1) {
            historyController.disableForwardButton()
        }
    }
    _printHistory()
})

historyController.addEventListener('navigate', function (event) {
    list.push({
        url: event.url,
    })
    position = list.length - 1
    _printHistory()
})

historyController.addEventListener('replace', function (event) {

})

historyController.addEventListener('exit', function (event) {
    if (!confirm('U sure?')) event.cancel()
})

var history2 = {
    get url() {
        return list[position].url
    },
    set url(url) {
        list[position].url = url
        historyController.url = url
    },
    get state() {
        return list[position].state
    },
    set state(state) {
        list[position].state = state
    },
    get position() {
        return position
    },
    push: historyController.push,
    back: historyController.back,
    forward: historyController.forward,
}

function _printHistory() {
    var t = ''
    list.forEach(function (elem, i) {
        var _url = new URL(elem.url)
        if (i > position) {
            t += '|' + _url.pathname + '| '
        } else {
            t += '[' + _url.pathname + '] '
        }
    })
    document.getElementById('title').innerText = t
}