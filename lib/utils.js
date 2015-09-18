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

Redact.findByAttr = function RedactFindByAttr (key, value, arr, getObj) {
  return _.reduce(arr, function (memo, obj, index) {
    return obj[key] === value
      ? (getObj ? obj : index)
      : memo
  }, false)
}

Redact.mongoKey = function RedactMongoKey (/*arguments*/) {
  return [].join.call(arguments, '.')
}

Redact.elementFieldGetter = function RedactElementFieldGetter (cb) {
  return function (document, field, element, value, target, event) {
    var elemIndex = Redact.findByAttr('_id', element, Redact.collection.findOne(document)[field])
    if(elemIndex === false) throw Redact.error('noSuchElement', element, document)
    cb(document, Redact.mongoKey(field, elemIndex), value, target, event)
  }
}
