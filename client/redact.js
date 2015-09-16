Redact = Redact || {}

/* This function mainly exists to be potentially overwritten by extensions */
Redact.getUserId = function RedactGetUserId () {
  return Meteor.userId()
}
