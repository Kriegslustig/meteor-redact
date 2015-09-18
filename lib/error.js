Redact.error = function RedactError (name/*, rest*/) {
  var error = new Meteor.Error(
    'Redact.' + name,
    (Redact.errors[name] || Redact.defaultError).apply(null, _.rest(arguments))
  )
  if(Meteor.isClient) console.error(error)
  return error
}

Redact.defaultError = function () {
  return [
    'An error occured inside Redact. These parameters were passed: (',
    [].join.call(arguments, ', '),
    ')'
  ].join('')
}

Redact.errors = {
  noSuchElement: function (element, document) {
    return [
      'No elment with id',
      element,
      'in document',
      document
    ].join(' ')
  }
}
