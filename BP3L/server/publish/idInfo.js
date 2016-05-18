

Meteor.publish("bp3l.IDInfo",function(){


  return DB.IDInfo.find({});

})

Meteor.publish("bp3l.SLDtest",function(){


  return DB.SLDtest.find({});

})
