Meteor.methods({

  'idInfo.initIDInfo': () =>{

    let initIDInfo = DB.IDInfo.find({}).fetch();

    if(!initIDInfo.length) {
      let testId = `bp3ltt${new Date().getTime()}`
      DB.IDInfo.insert({testId});
    }

  },

  'idInfo.insert': (testId, sessionIds) =>{
    DB.IDInfo.insert({testId, sessionIds})
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


})
