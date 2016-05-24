Meteor.methods({

  'apitest.analysis': (testId)=>{

    let testReg = testId;

    let allCount =  DB.SLDtest.find({testId: {$regex: testReg, $options: 'i'}}).count();

    let firstDiscoveryCount = DB.SLDtest.find({testId: {$regex: testReg, $options: 'i'}, 'timeData.discoveryFailureTime_1': {$exists: 1}}).count();
    let secondDiscoveryCount = DB.SLDtest.find({testId: {$regex: testReg, $options: 'i'}, 'timeData.discoveryFailureTime_2': {$exists: 1}}).count();

    let firstConnectCount = DB.SLDtest.find({testId: {$regex: testReg, $options: 'i'}, 'timeData.connectFailureTime_1': {$exists: 1}}).count();
    let secondConnectCount = DB.SLDtest.find({testId: {$regex: testReg, $options: 'i'}, 'timeData.connectFailureTime_2': {$exists: 1}}).count();

    return {
      allCount,
      firstDiscoveryCount,
      secondDiscoveryCount,
      firstConnectCount,
      secondConnectCount

    }

  }

})
