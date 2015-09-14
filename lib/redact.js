Redact = Redact || {}

Redact.attachCollection = function RedactSetCollection (collection) {
  Redact.collection = collection
  Redact.collection.attachSchema(Redact.schemata.document)
}

/* Locks a field */
Redact.lockField = function RedactLockField (document, field) {
  Redact.collection.update(document, {
    $set: _.object(
      [ field + '._lock._time', field + '._lock._user' ],
      [ Redact.getUnixTime(), Redact.getUserId() ]
    )
  })
}

/* Unlocks a field */
Redact.unlockField = function RedactUnlockField (document, field) {
  Redact.colection.update(document, {
    $unset: _.object( [field + '._lock'], [''] )
  })
}

/* Unlocks all fields locked by a user inside a document */
Redact.unlockAllFields = function RedactUnlockAllFields (document, userId) {}

Redact.updateFieldValue = function RedactUpdateFieldValue (document, field, value) {
  Redact.collection.update(document, {
    $set: _.object(
      [ field + '._html', field + '._lock._time' ],
      [ value, Redact.getUnixTime() ]
    )
  })
}
