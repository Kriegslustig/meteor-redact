Redact.modules = {}

Redact.module = {
  removeElement: function RedactModuleRemoveElement (document, field, element) {
    var elemType = _.compose(
      Redact.collection.find.bind(Redact.collection),
      Redact.deepObjKey.bind(null, field),
      Redact.findByAttr.bind(null, '_id', element)
    )(document)._type
    if(
      elemType === this.type
    ) {
      Redact.removeElement.apply(null, arguments)
    } else {
      throw new Meteor.Error(['Element has type ', elemType, '. Should be ', this.type].join(''))
    }
  }
}

Redact.addModule = function RedactAddModule (name, template, options) {
  if(Redact[name]) throw ["Redact: Module ", " already exists"].join(name)
  return Redact.modules[name] = _.extend(Object.create(Redact.module), {
    template: template,
    schema: new SimpleSchema([Redact.schemata.element, options.schema || {}]),
    label: (options && options.label) || name,
    icon: (options && options.icon) || '',
    defaults: (options && options.defaults)
  })
}
