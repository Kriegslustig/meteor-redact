Package.describe({
  name: 'redact:core',
  version: '0.0.0',
  repository: 'git@github.com:Kriegslustig/redact-core.git',
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
    'promise',
    'ejson',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.5.0',
  ])
  api.addFiles([
    'lib/utils.js',
    'lib/error.js',
    'lib/schema.js',
    'lib/redact.js',
    'lib/modules.js',
  ])
  api.addFiles([
    'client/dragndrop/dragndrop.css',
    'client/dragndrop/dragndrop.js',
    'client/editor/editor.html',
    'client/editor/editor.css',
    'client/editor/editor.js',
  ], 'client')
  api.export('Redact')
})
