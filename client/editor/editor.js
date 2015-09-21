var currentDoc
var templateInstance
var container = '_draft'
var collection

Template.redactEditor.helpers({
  getDocument: function () {
    currentDoc = typeof this.doc === 'string'
      ? collection.findOne(this.doc)
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
    return _.map(this[container], function (elem, index) {
      return _.extend(elem, {
        field: container
      })
    })
  },
  getField: function (key) {
    return Redact.deepObjKey(key, collection.findOne(currentDoc._id, {reactive: false}))
  }
})

Template.redactEditor.onCreated(function () {
  if(!this.data.collection) throw Redact.error('missingCollectionInTemplate')
  collection = this.data.collection
})

Template.redactEditor.onRendered(renderPartlyReactiveContent)

Template.redactEditor.events({
  'focus [contenteditable=true]': function lockElementOnFocus (e) {
    Redact.lockElement(collection, getElement(e))
      .then( function () {
        debugger;
      })
      .catch(function (err) {
        Redact.notify(err.message)
      })
  },

  'keyup [contenteditable=true]': keyFilter(function updateElementOnKeyup (e) {
    Redact.updateFieldValue(
      collection,
      getElement(e),
      '_html',
      e.currentTarget.innerHTML
    )
  }),

  'blur [contenteditable=true]': function (e) {
    Redact.updateAndUnlockElement(
      collection,
      getElement(e),
      '_html',
      e.currentTarget.innerHTML
    )
  },

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

function getElement (e) {
  if(!e.currentTarget.getAttribute('data-field'))
    throw 'All contenteditables need a data-field attribute.'
  return Redact.normalizeElement(collection, {
    document: currentDoc._id,
    container: container,
    id: e.currentTarget.id,
  })
}

function keyFilter (cb) {
  return function (e) {
    if(e.char) cb(e)
  }
}

function getUpdateParams (params) {
  return [
    params[0],
    params[1],
    '_html',
    params[2].innerHTML
  ]
}

function renderPartlyReactiveContent () {
  currentDoc = collection.findOne(currentDoc._id)
  templateInstance = templateInstance || this
  templateInstance.$('[data-field]').each(function (i, elem) {
    if(!elem.id) return
    elem.innerHTML = Redact.findByAttr('_id', elem.id, currentDoc[container], true)._html
  })
  templateInstance.$('[contenteditable=true]').each(function (i, elem) {
    var field = elem.getAttribute('data-field')
    // TODO: Fix this memory leak (autorun is never stopped, but created multiple times)
    Tracker.autorun(function () {
      var lock = Redact.deepObjKey(field + '._lock', collection.findOne(currentDoc._id))
      if((lock && lock._user === Redact.getUserId()) || !lock) {
        elem.contentEditable = 'true'
      } else {
        elem.contentEditable = 'false'
      }
    })
  })
}
