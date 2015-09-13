Redact.modules = {}

Redact.addModule = function RedactAddModule (name, schema) {
  if(Redact[name]) throw ["Redact: Module ", " already exists"].join(name)
  Redact.modules[name] = schema
}
