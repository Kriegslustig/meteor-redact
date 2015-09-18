var currentDoc
var templateInstance

Template.redactEditor.helpers({
  getDocument: function () {
    currentDoc = typeof this.doc === 'string'
      ? Redact.collection.findOne(this.doc)
      : this.doc
    return currentDoc
  },
  getTemplate: function () {
    if(!this._type) throw new Meteor.Error('invalidElement', '_type of element is not defined: ' + EJSON.stringify(this))
    return Redact.modules[this._type].template
  },
  shouldBeContenteditable: function (field) {
    return (field._lock && field._lock._user === Redact.getUserId()) || !field._lock
  },
  modules: function () {
    return _.map(Redact.modules, function (elem, key) {
      return _.extend(elem, { name: key })
    })
  },
  getElements: function () {
    return this._draft.map(function (elem, index) {
      return _.extend(elem, {
        fieldId: ['_draft', index].join('.')
      })
    })
  },
  getField: function (key) {
    return Redact.deepObjKey(key, Redact.collection.findOne(currentDoc._id, {reactive: false}))
  }
})

Template.redactEditor.onRendered(renderPartlyReactiveContent)

Template.redactEditor.events({
  'focus [contenteditable=true]': contentGetter(Redact.lockField),
  'keyup [contenteditable=true]': keyFilter(contentGetter(_.throttle(Redact.updateFieldValue, 1000))),
  'blur [contenteditable=true]': contentGetter(Redact.updateAndUnlockField),
  'mousedown .redactEditor__module': Redact.dragndrop.creator({
    onDrag: function (e) {},
    onDrop: function (e) {
      var module = this.node.getAttribute('data-type')
      Redact.addElement(
        currentDoc._id,
        '_draft',
        0,
        _.extend({
          _html: '',
          _type: module
        },
        (Redact.modules[module].defaults || {})),
        renderPartlyReactiveContent
      )
    },
  })
})

function contentGetter (cb) {
  return function (e) {
    if(!e.currentTarget.getAttribute('data-field'))
      throw 'All contenteditables need a data-field attribute.'
    cb(currentDoc._id, e.currentTarget.getAttribute('data-field'), e.currentTarget.innerHTML, e.currentTarget, e)
  }
}

function keyFilter (cb) {
  return function (e) {
    if(e.char) cb(e)
  }
}

function renderPartlyReactiveContent () {
  currentDoc = Redact.collection.findOne(currentDoc._id)
  templateInstance = templateInstance || this
  templateInstance.$('[data-field]').each(function (i, elem) {
    elem.innerHTML = Redact.findByAttr('_id', elem.id, currentDoc['_draft'])._html
  })
  templateInstance.$('[contenteditable=true]').each(function (i, elem) {
    var field = elem.getAttribute('data-field')
    // TODO: Fix this memory leak (autorun is never stopped, but created multiple times)
    Tracker.autorun(function () {
      var lock = Redact.deepObjKey(field + '._lock', Redact.collection.findOne(currentDoc._id))
      if((lock && lock._user === Redact.getUserId()) || !lock) {
        elem.contentEditable = 'true'
      } else {
        elem.contentEditable = 'false'
      }
    })
  })
}
