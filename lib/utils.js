Redact = Redact || {}

Redact.getUnixTime = function RedactGetUnixTime () {
  return Math.round((new Date).getTime() / 1000)
}

Redact.objValMongoSelector = function (obj, selector) {
  return _.reduce(
    selector.split('.'),
    function (memo, sel) {
      return memo[sel] || memo
    },
    obj
  )
}
