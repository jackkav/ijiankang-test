/**
 * Created by fanjinhui on 6/7/16.
 */



Meteor.publish("test_v2.all",function(){

    return DB.TestV2001.find({},{limit:100});

})


Meteor.publish("test_v2.TestV2001_analyze_1",function(){

    return DB.TestV2001_analyze_1.find({});

})