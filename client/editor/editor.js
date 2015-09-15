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
  },
  module: function () {
    return _.map(Redact.modules, function (elem, key) {
      elem.name = key
      return elem
    })
  }
})

Template.redactEditor.onRendered(function () {
  var self = this
  self.$('.redactEditor__title')[0].innerHTML = currentDoc._title._html
  self.$('[contenteditable=true]').each(function (i, elem) {
    var field = elem.getAttribute('data-field')
    Tracker.autorun(function () {
      var lock = Redact.collection.findOne(currentDoc._id)[field + '.lock']
      if((lock && lock._user === Redact.getUserId()) || !lock) {
        elem.contenteditable = 'true'
      } else {
        elem.contenteditable = 'false'
      }
    })
  })
})

Template.redactEditor.events({
  'focus [contenteditable=true]': contentGetter(Redact.lockField),
  'keyup [contenteditable=true]': contentGetter(_.throttle(Redact.updateFieldValue, 5000)),
  'blur [contenteditable=true]': contentGetter(Redact.updateFieldValue),
  'mousedown .redactEditor__module': Redact.dragndrop.starter()
})

function contentGetter (cb) {
  return function (e) {
    if(!e.currentTarget.getAttribute('data-field'))
      throw 'All contenteditables need a data-field attribute.'
    cb(currentDoc._id, e.currentTarget.getAttribute('data-field'), e.currentTarget.innerHTML, e.currentTarget)
  }
}
