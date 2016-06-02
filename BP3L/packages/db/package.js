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

  api.addFiles('common/base.js', ["server", "client"]);
  api.addFiles('common/bp3l.js', ["server", "client"]);



  api.addFiles('test_v1/result.js', ["server", "client"]);
  api.addFiles('test_v1/apitest.js', ["server", "client"]);
  api.addFiles('test_v1/IDInfo.js', ["server", "client"]);
  api.addFiles('test_v1/sldtest.js', ["server", "client"]);

  //直连
  api.addFiles('test_v1/ConnectDirectly.js', ["server", "client"]);

  api.addFiles('test_v1/DiscoverAndConnectAndMeasureTest.js', ["server", "client"]);
  //数据分析
  api.addFiles('test_v1/temp_analize_1.js', ["server", "client"]);


  /////Test v2//////
  api.addFiles('test_v2/TestV2001.js', ["server", "client"]);




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
