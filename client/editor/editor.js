var currentDoc

Template.redactEditor.helpers({
  getDocument: function () {
    currentDoc = typeof this.doc === 'string'
      ? Redact.collection.findOne(this.doc)
      : this.doc
    return currentDoc
  },
  getTemplate: function () {
    return Redact.modules[this.doc._type].template
  },
  shouldBeContenteditable: function (field) {
    return (field._lock && field._lock._user === Redact.getUserId()) || !field._lock
  }
})

Template.redactEditor.onRendered(function () {
  this.$('.redactEditor__title')[0].innerHTML = currentDoc._title._html
})

Template.redactEditor.events({
  'focus [contenteditable=true]': contentGetter(Redact.lockField),
  'keyup [contenteditable=true]': contentGetter(Redact.updateFieldValue)
})

function contentGetter (cb) {
  return function (e) {
    if(!e.currentTarget.getAttribute('data-field'))
      throw 'All contenteditables need a data-field attribute.'
    cb(currentDoc._id, e.currentTarget.getAttribute('data-field'), e.currentTarget.innerHTML)
  }
}
