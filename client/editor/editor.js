Template.redactEditor.helpers({
  getDocument: function () {
    return typeof this.doc === 'string'
      ? Redact.collection.findOne(this.doc)
      : this.doc
  },
  getTemplate: function () {
    return Redact.modules[this.doc._type].template
  }
})

Template.redactEditor.onRendered(function () {
  var doc = typeof this.data.doc === 'string'
    ? Redact.collection.findOne(this.data.doc)
    : this.data.doc
  this.data.doc = doc
  this.$('.redactEditor__title')[0].innerHTML = doc._title
})

Template.redactEditor.events({
  'keyup [contenteditable=true]': contentGetter(function (id, field, value) {
    Redact.collection.update(id, { $set: _.object([field], [value]) })
  })
})

function contentGetter (cb) {
  return function (e) {
    if(!e.currentTarget.getAttribute('data-field')) throw 'All contenteditables need a data-field attribute.'
    cb(this.doc._id, e.currentTarget.getAttribute('data-field'), e.currentTarget.innerHTML)
  }
}
