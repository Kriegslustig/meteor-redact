Redact = Redact || {}

Redact.schemata = {
  document: {
    '_title': {
      type: 'String'
    },
    '_createdAt': {
      type: 'Number'
    },
    '_lastPublishedAt': {
      type: 'Number',
      optional: true
    },
    '_createdBy': {
      type: 'String',
      custom: Redact.schemata.validators.userId
    },
    '_draft': {
      type: [Redact.schemata.element]
    },
    '_public': {
      type: [Redact.schemata.element],
      optional: true
    }
  },
  element: {
    '_id': {
      type: 'String'
    },
    '_type': {
      type: 'String',
      custom: Redact.schemata.validators.Module
    }
  }
  modules: {},
  validators: {
    userId: function isValidUserId () {
      if( !Meteor.users.find(this.value) ) return 'notAllowed'
    },
    Module: function isValidModule () {
      if( !Redact.modules[this.value] ) return 'notAllowed'
    }
  }
}
