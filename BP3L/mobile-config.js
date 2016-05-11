// This section sets up some basic app metadata,
// the entire section is optional.
App.info({
  id: 'com.meteor.ihealth',
  name: 'meteor_ihealth_plugin',
  description: 'Well Lets Go Meteor!',
  author: 'Xuewei Chen',
  email: 'chenxuewei.cc32@gmail.com',
  version: '0.10.0'
});

// Pass preferences for a particular PhoneGap/Cordova plugin
App.configurePlugin('com.ihealth.plugin.am.ammanagercordova', {
  APP_ID: '2015042801',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'AmManagerCordova'
});

App.configurePlugin('com.ihealth.plugin.bg.bgmanagercordova', {
  APP_ID: '2015042802',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'BgManagerCordova'
});

App.configurePlugin('com.ihealth.plugin.bp.bpmanagercordova', {
  APP_ID: '2015042803',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'BpManagerCordova'
});

App.configurePlugin('com.ihealth.plugin.hs.hsmanagercordova', {
  APP_ID: '2015042804',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'HsManagerCordova'
});

App.configurePlugin('com.ihealth.plugin.po.pomanagercordova', {
  APP_ID: '2015042805',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'PoManagerCordova'
});

App.configurePlugin('com.ihealth.plugin.hs.hs6managercordova', {
  APP_ID: '2015042806',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'Hs6ManagerCordova'
});

App.configurePlugin('com.ihealth.plugin.bttool.bttoolmanagercordova', {
  APP_ID: '2016030913',
  API_KEY: 'supersecretapikey',
  APP_NAME: 'BTToolManagerCordova'
});