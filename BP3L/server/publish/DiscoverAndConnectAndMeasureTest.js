/**
 * Created on 5/17/16.
 */


Meteor.publish("DiscoverAndConnectAndMeasureTest",function(){


	return DB.DiscoverAndConnectAndMeasureTest.find({});

})