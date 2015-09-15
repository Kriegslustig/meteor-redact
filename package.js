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
    'underscore',
    'templating',
    'mongo',
    'accounts-base',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.5.0',
  ])
  api.addFiles([
    'lib/utils.js',
    'lib/schema.js',
    'lib/redact.js',
    'lib/modules.js',
  ])
  api.addFiles([
    'server/redact.js'
  ], 'server')
  api.addFiles([
    'client/redact.js',
    'client/editor/editor.html',
    'client/editor/editor.js'
  ], 'client')
  api.export('Redact')
})
