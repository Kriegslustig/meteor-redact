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
        new SimpleSchema(_.extend(
          Redact.modules[this.value._type].schema,
          Redact.schemata.element
        ))
      )
    )) return 'notAllowed'

  }
}

Redact.schemata = {}

Redact.schemata.element = {
  _id: {
    type: 'String'
  },
  _type: {
    type: 'String'
  },
  _html: {
    type: 'String'
  }
}

Redact.schemata.document = {
  _title: {
    type: 'String'
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
}
