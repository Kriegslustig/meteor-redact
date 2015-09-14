Redact.modules = {}

Redact.addModule = function RedactAddModule (name, template, options) {
  if(Redact[name]) throw ["Redact: Module ", " already exists"].join(name)
  Redact.modules[name] = {
    template: template,
    schema: options.schema || {},
    label: (options && options.label) || name,
    icon: (options && options.icon) || '',
  }
}
