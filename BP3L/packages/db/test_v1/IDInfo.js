Schema.IDInfo = new SimpleSchema([Schema.Base, {

  testType: {
    type: String,
    label: 'testType',
    optional: true
  },

  testId: {
    type: String,
    label: 'bp3ltt123456789'
  },

  sessionIds: {
    type: [String],
    optional: true

  },

  deviceInfo: {
    type: Object,
    blackbox: true, //todo
    label: '设备型号(Android/Iphone) 设备品牌(OPPO/XIAOMI...) 设备版本(4.4.4/9.2.1...)',
    optional: true
  },

}])

DB.IDInfo = new Mongo.Collection('IDInfo')
DB.IDInfo.attachSchema(Schema.IDInfo)
