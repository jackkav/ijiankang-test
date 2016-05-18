Meteor.methods({

  'idInfo.initIDInfo': () =>{

    let initIDInfo = DB.IDInfo.find({}).fetch();

    if(!initIDInfo.length) {
      let testId = `bp3ltt${new Date().getTime()}`
      DB.IDInfo.insert({testId});
    }

  },

  'idInfo.insert': (testId, sessionIds, deviceInfo) =>{
    DB.IDInfo.insert({testId, sessionIds, deviceInfo})
  },

  'idInfo.update': (testId, sessionId) =>{

    DB.IDInfo.update({
      testId: testId
    }, {
      $push: {
        sessionIds: sessionId
      }
    })

  },
  'idInfo.remove': (testId, sessionId) =>{

    DB.IDInfo.update({
      testId: testId
    }, {
      $pull: {
        sessionIds: sessionId
      }
    })

  },


  'idInfo.createTestId': (testId, testType, deviceInfo) =>{
    var _id = DB.IDInfo.insert({testId, testType, deviceInfo})

    return {testId, testType}
  },


})
