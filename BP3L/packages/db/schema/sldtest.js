
Schema.SLDtest = new SimpleSchema([Schema.Base, {

  apiType: {
    type: String,
    label: '发现设备(discovery) 连接设备(connect) ...'
  },

  deviceInfo: {
    type: Object,
    blackbox: true, //todo
    label: '设备型号(Android/Iphone) 设备品牌(OPPO/XIAOMI...) 设备版本(4.4.4/9.2.1...)'
  },

  status: {
    type: String,
    label: '成功(success) 失败(failure)'
  },

  timeData:{
    type: Object,
    blackbox: true, //todo
    optional: true
  },

  macId: {
    type: String,
    label: '小馒头Id (D05FB8418966)',
    optional: true
  },

  testId: {
    type: String,
    label: 'bp3ltt123456789'
  },

  sessionId: {
    type: String,
    label: 'bp3lsn123456789'
  },

  errorId: {
    type: String,
    optional: true
  }

}])

DB.SLDtest = new Mongo.Collection('SLDtest')
DB.SLDtest.attachSchema(Schema.SLDtest)
