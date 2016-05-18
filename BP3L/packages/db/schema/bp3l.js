


Schema.BP3LInfo = new SimpleSchema([Schema.Base, {

  macId: {
    type: String,
    label: '小馒头Id (D05FB8418966)'
  },

  status: {
    type: Boolean,
    optional: true,
    label: '连接中(true) 未连接(false)'
  }

}])

DB.BP3LInfo = new Mongo.Collection('BP3LInfo')
DB.BP3LInfo.attachSchema(Schema.BP3LInfo)
