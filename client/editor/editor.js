let currentDoc
let templateInstance
let container = '_draft'
let collection

Template.redactEditor.helpers({
  getDocument: function () {
    currentDoc = typeof this.doc === 'string'
      ? collection.findOne(this.doc)
      : this.doc
    return currentDoc
  },
  getTemplate: function () {
    if(!this._type) throw new Meteor.Error('invalidElement', `_type of element is not defined: ${EJSON.stringify(this)}`)
    return Redact.modules[this._type].template
  },
  shouldBeContenteditable: function (field) {
    return (field._lock && field._lock._user === Redact.getUserId()) || !field._lock
  },
  modules: function () {
    return _.map( Redact.modules, (elem, key) => _.extend(elem, { name: key }) )
  },
  getElements: function () {
    return _.map( this[container], (elem, index) => _.extend(elem, { field: container }) )
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
      .catch((err) => Redact.notify(err.message))
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
      let module = this.node.getAttribute('data-type')
      Redact.addElement(
        collection,
        Redact.normalizeElement(collection, {
          container,
          document: currentDoc._id,
          index: 0,
          value: _.extend({
              _html: '',
              _type: module
            },
            (Redact.modules[module].defaults || {})
          ),
        })
      )
        .then(renderPartlyReactiveContent)
        .catch((e) => console.error(e))
    },
  })
})

function getElement (e) {
  if(!e.currentTarget.getAttribute('data-field'))
    throw 'All contenteditables need a data-field attribute.'
  return Redact.normalizeElement(collection, {
    container,
    document: currentDoc._id,
    id: e.currentTarget.id,
  })
}

function keyFilter (cb) {
  return (e) => {
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
  templateInstance.$('[data-field]').each((i, elem) => {
    if(!elem.id) return
    elem.innerHTML = Redact.findByAttr('_id', elem.id, currentDoc[container], true)._html
  })
  templateInstance.$('[contenteditable=true]').each((i, elem) => {
    let field = elem.getAttribute('data-field')
    // TODO: Fix this memory leak (autorun is never stopped, but created multiple times)
    Tracker.autorun(() => {
      let doc = collection.findOne(currentDoc._id)
      let lock = (doc[field][Redact.findByAttr('_id', elem.id, doc[field])] || {})._lock
      if((lock && lock._user === Redact.getUserId()) || !lock) {
        elem.contentEditable = 'true'
      } else {
        elem.contentEditable = 'false'
      }
    })
  })
}
