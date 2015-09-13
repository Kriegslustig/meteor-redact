Redact.modules = {}

Redact.addModule = function RedactAddModule (name, schema, options) {
  if(Redact[name]) throw ["Redact: Module ", " already exists"].join(name)
  Redact.modules[name] = {
    schema: schema || {},
    label: (options && options.label) || name,
    icon: (options && options.icon) || '',
  }
}
