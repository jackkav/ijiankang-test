Package.describe({
  name: 'ijiankang-test:db',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');

  api.use([
    "aldeed:simple-schema",
    "aldeed:collection2",
  ], ['client', 'server'])


  api.addFiles('db.js',["server", "client"]);

  api.addFiles('schema/base.js', ["server", "client"]);
  api.addFiles('schema/result.js', ["server", "client"]);
  api.addFiles('schema/apitest.js', ["server", "client"]);
  api.addFiles('schema/bp3l.js', ["server", "client"]);


  api.export([
    "DB",
    "Schema",
  ], ["server", "client"])

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('db');
  api.addFiles('db-tests.js');
});
