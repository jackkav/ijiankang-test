/**
  * Created on 5/5/16.
*/
Schema.DiscoverAndConnect = new SimpleSchema([Schema.Base, {


  discoveryTime:{
    type: Number
  },
  connectTime:{
    type: Number
  },
  deviceInfo:{
    type: Object,
    blackbox: true, //todo
  },



  //optional
  discoveryStartTime:{
    type: Date,
    optional: true
  },
  discoverySuccessTime:{
    type: Date,
    optional: true
  },
  connectStartTime:{
    type: Date,
    optional: true
  },
  connectSuccessTime:{
    type: Date,
    optional: true
  },


}])

DB.Result = new Mongo.Collection('DiscoverAndConnect')
DB.Result.attachSchema(Schema.DiscoverAndConnect)
