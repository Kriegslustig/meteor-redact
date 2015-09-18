Redact = Redact || {}

Redact.attachCollection = function RedactSetCollection (collection) {
  Redact.collection = collection
  Redact.collection.attachSchema(Redact.schemata.document)
}

Redact.getElementIndex = function RedactGetElementIndex (document, element) {
  return Redact.findByAttr('_id', elem.id, Redact.collection.findOne(document))
}

/* Locks an element */
Redact.lockField = Redact.elementFieldGetter(function RedactLockField (document, element) {
  Redact.collection.update(document, {
    $set: _.object(
      [ element + '._lock' ],
      [ { _time: Redact.getUnixTime(), _user: Redact.getUserId()} ]
    )
  })
})

/* Unlocks a field */
Redact.unlockField = Redact.elementFieldGetter(function RedactUnlockField (document, element) {
  Redact.collection.update(document, {
    $unset: _.object( [element + '._lock'], [''] )
  })
})

/* Unlocks all fields locked by a user inside a document */
Redact.unlockAllFields = function RedactUnlockAllFields (document, userId) {}

Redact.updateFieldValue = Redact.elementFieldGetter(function RedactUpdateFieldValue (document, element, value) {
  Redact.collection.update(document, {
    $set: _.object(
      [element + '._html', element + '._lock._time'],
      [ value, Redact.getUnixTime() ]
    )
  })
})

Redact.updateAndUnlockField = Redact.elementFieldGetter(function RedactUpdateAndUnlockField (document, element, value) {
  Redact.collection.update(document, {
    $unset: _.object( [element + '._lock'], [''] ),
    $set: _.object(
      [ element + '._html' ],
      [ value ]
    )
  })
})

Redact.addElement = function RedactAddElement (document, field, position, element, cb) {
  Redact.collection.update(
    document,
    {
      $push: _.object(
        [field],
        [{
          $each: [element],
          $position: position
        }]
      )
    },
    cb
  )
}

Redact.removeElement = function (document, field, element) {
  Redact.collection.update(document, {
    $pull: _.object(
      [field],
      [{ _id: element }]
    )
  })
}
