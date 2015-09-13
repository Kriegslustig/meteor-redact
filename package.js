Package.describe({
  name: 'kriegslustig:redact',
  version: '0.0.0',
  repository: 'git@github.com:Kriegslustig/meteor-redact.git',
  documentation: 'README.md',
  description: 'A reactive cotent editor built using contenteditable and with extendability in mind.'
})

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.1.0.3')
  api.use([
    'templating',
    'mongo',
    'aldeed:simple-schema@1.3.3'
  ])
  api.addFiles([
    'lib/schema.js'
  ])
  api.addFiles([
    'server/redact.js'
  ], 'server')
  api.addFiles([
    'client/redact.js'
  ], 'client')
  api.export('Readact')
})
