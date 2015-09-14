Redact = Redact || {}

Redact.attachCollection = function RedactSetCollection (collection) {
  Redact.collection = collection
  Redact.collection.attachSchema(new SimpleSchema(Redact.schemata.document))
}
