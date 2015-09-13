Redact = Redact || {}

Redact.attachCollection = function RedactSetCollection (collection) {
  collection.attachSchema(new SimpleSchema(Redact.schemata.document))
}
