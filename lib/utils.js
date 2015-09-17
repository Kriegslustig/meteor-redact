Redact = Redact || {}

Redact.getUnixTime = function RedactGetUnixTime () {
  return Math.round((new Date).getTime() / 1000)
}

Redact.deepObjKey = function RedactDeepObjKey (obj, selector) {
  return _.reduce(
    selector.split('.'),
    function (memo, sel) {
      return memo ? memo[sel] : false
    },
    obj
  )
}

Redact.findByAttr = function RedactFindByAttr (arr, key, value) {
  return _.find(arr, function (obj) { return obj[key] === value }) || {}
}
