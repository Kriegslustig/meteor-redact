Redact.notify = function RedactNotify (message, type = 'error', timeout = 2000) {
  Blaze.renderWithData(
    Template.notify,
    {
      type,
      message
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
