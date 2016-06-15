
Meteor.methods({

      'test_v2/model_list_group':function(){
        var myFuture = new Future();
        DB.TestV2001.rawCollection().group(
            {
             'mobileInfo.model':1

            },
            //queryCondition
            {
                // 'resultInfo.connectSuccessTime':{$exists:1},//todo
                // 'resultInfo.connectStatus':'success',
                // 'testType':1
            },

            //initial
            {
              totalAttemptsToConnect: 0,
              totalSuccessfulConnections: 0,
              totalFailedConnections: 0,
              totalSuccessfulFirstConnections: 0,
               totalSuccessfulSecondConnections: 0,
               totalAttemptsToDiscover: 0,
               totalSuccessfulFirstDiscoveries: 0,
               totalSuccessfulSecondDiscoveries: 0
            },

            // reduce
            function(doc,prev){

                if(doc.testType===1){
                  prev.totalAttemptsToConnect++

                  prev.totalSuccessfulConnections+=doc.resultInfo.connectStatus==='success'?1:0

                  prev.totalFailedConnections+=doc.resultInfo.connectStatus!='success'?1:0

                  prev.totalSuccessfulFirstConnections+=doc.timeInfo.connectSuccessTime_1?1:0

                  prev.totalSuccessfulSecondConnections+=doc.timeInfo.connectSuccessTime_2?1:0

                }
                if(doc.testType===2){
                  prev.totalAttemptsToDiscover++
                  prev.totalSuccessfulFirstDiscoveries+=doc.timeInfo.discoverSuccessTime_1?1:0
                  prev.totalSuccessfulSecondDiscoveries+=doc.timeInfo.discoverSuccessTime_2?1:0
                  }
                },

            function (err, result) {

                if(err){
                    throw new Meteor.Error(err)
                }
                return myFuture.return(result);
            }
        );
        return myFuture.wait();
        },

})
