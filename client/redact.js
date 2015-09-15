Redact = Redact || {}

/* This function mainly exists to be potentially overwritten by extensions */
Redact.getUserId = function RedactGetUserId () {
  return Meteor.userId()
}

Redact.addElement = function RedactAddElement (document, field, position, element) {
  Redact.collection.update(document, {
    $push: _.object(
      [field],
      [{
        $each: [element],
        $position: position
      }]
    )
  })
}
