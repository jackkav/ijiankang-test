Schema.IDInfo = new SimpleSchema([Schema.Base, {

  testId: {
    type: String,
    label: 'bp3ltt123456789'
  },

  sessionIds: {
    type: [String],
    optional: true

  }

}])

DB.IDInfo = new Mongo.Collection('IDInfo')
DB.IDInfo.attachSchema(Schema.IDInfo)
