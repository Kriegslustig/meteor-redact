Redact = Redact || {}

Redact.validators = {
  userId: function isValidUserId () {
    if( !Meteor.users.findOne(this.value) ) return 'notAllowed'
  },
  element: function validateElement () {
    if(!(
      Redact.modules[this.value._type]
      && Match.test(
        this.value,
        Redact.modules[this.value._type].schema
      )
    )) return 'notAllowed'
  }
}

Redact.schemata = {}

Redact.schemata.lock = new SimpleSchema({
  _user: {
    type: 'String',
    custom: Redact.validators.userId
  },
  _time: {
    type: 'Number'
  }
})

Redact.schemata.element = new SimpleSchema({
  _id: {
    type: 'String'
  },
  _type: {
    type: 'String'
  },
  _html: {
    type: 'String'
  }
})

Redact.schemata.document = new SimpleSchema({
  _title: {
    type: 'Object'
  },
  '_title._html': {
    type: 'String'
  },
  '_title._lock': {
    type: Redact.schemata.lock
  },
  _createdAt: {
    type: 'Number'
  },
  _lastPublishedAt: {
    type: 'Number',
    optional: true
  },
  _createdBy: {
    type: 'String',
    custom: Redact.validators.userId
  },
  _draft: {
    type: 'Array'
  },
  '_draft.$': {
    type: 'Object',
    blackbox: true,
    custom: Redact.validators.element
  },
  _public: {
    type: 'Array',
    optional: true
  },
  '_public.$': {
    type: 'Object',
    blackbox: true,
    custom: Redact.validators.element
  }
})
