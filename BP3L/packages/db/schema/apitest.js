
Schema.APItestInfo = new SimpleSchema([Schema.Base, {

  apiType: {
    type: String,
    label: '发现设备(discovery) 连接设备(connect) ...'
  },

  deviceInfo: {
    type: String,
    label: '设备型号(Android/Iphone) 设备品牌(OPPO/XIAOMI...) 设备版本(4.4.4/9.2.1...)'
  },

  status: {
    type: String,
    label: '成功(success) 失败(failure)'
  }

}])

DB.APItest = new Mongo.Collection('APItest')
DB.APItest.attachSchema(Schema.APItestInfo)
