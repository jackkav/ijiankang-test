

Meteor.publish("bp3l.IDInfo",function(){

    
  return DB.IDInfo.find({});

})


Meteor.publish("bp3l.IDInfoByuuid",function(uuid){

  //if(!uuid) {
  //  return;
  //}

  return DB.IDInfo.find({'deviceInfo.uuid': uuid});

})





Meteor.publish("bp3l.SLDtest",function(){


  return DB.SLDtest.find({});

})
