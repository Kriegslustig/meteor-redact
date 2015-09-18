Redact = Redact || {}

Redact.getUnixTime = function RedactGetUnixTime () {
  return Math.round((new Date).getTime() / 1000)
}

Redact.deepObjKey = function RedactDeepObjKey (selector, obj) {
  return _.reduce(
    selector.split('.'),
    function (memo, sel) {
      return memo ? memo[sel] : false
    },
    obj
  )
}

Redact.findByAttr = function RedactFindByAttr (key, value, arr) {
  return _.find(arr, function (obj) { return obj[key] === value }) || {}
}
