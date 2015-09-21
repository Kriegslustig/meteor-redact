Redact.notify = function RedactNotify (message, type, timeout) {
  timeout = timeout || 2000
  type = type || 'error'
  Blaze.renderWithData(
    Template.notify,
    {
      type: type,
      text: message
    },
    document.body
  )
  setTimeout(Redact.notifyHideAll, timeout)
  setTimeout(Redact.notifyRemoveAll, timeout + 200)
}

Redact.notifyDoOnAll = function RedactNotifyDoOnAll (cb) {
  [].slice.call(document.querySelectorAll('.notify')).forEach(cb)
}

Redact.notifyHideAll = function RedactNotifyHideAll () {
  Redact.notifyDoOnAll(function (elem) {
    elem.className += ' notify--hidden'
  })
}

Redact.notifyRemoveAll = function RedactNotifyRemoveAll () {
  Redact.notifyDoOnAll(function (elem) {
    elem.parentNode.removeChild(elem)
  })
}
