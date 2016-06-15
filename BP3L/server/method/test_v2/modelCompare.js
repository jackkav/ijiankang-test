DB.TESTEST = new Mongo.Collection('TestV2002')

Meteor.methods({

    'test_v2/model_list':function(){
        return DB.TESTEST.aggregate( [
             { $match: { testType: { $eq: 1 } } },
             { $group: {
                 _id: '$mobileInfo.model',
                  totalAttemptsToConnect: { $sum: 1 },
                  totalSuccessfulConnections: {$sum: {$cond: [{$eq: ['$resultInfo.connectStatus', 'success']}, 1, 0]}},
                  totalFailedConnections: {$sum: {$cond: [{$ne: ['$resultInfo.connectStatus', 'success']}, 1, 0]}},
                  totalSuccessfulFirstConnections: {$sum: {$cond: [{$gt: ['$timeInfo.connectSuccessTime_1', 0]}, 1, 0]}},
                   totalSuccessfulSecondConnections: {$sum: {$cond: [{$gt: ['$timeInfo.connectSuccessTime_2', 0]}, 1, 0]}},
                 }
             },
        ] )
      },
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
                'testType':1
            },

            //initial
            {
              totalAttemptsToConnect: 0,
              totalSuccessfulConnections: 0,
              totalFailedConnections: 0,
              totalSuccessfulFirstConnections: 0,
               totalSuccessfulSecondConnections: 0,
            },

            // reduce
            function(doc,prev){
                prev.count++

                prev.totalAttemptsToConnect++

                prev.totalSuccessfulConnections+=doc.resultInfo.connectStatus==='success'?1:0

                prev.totalFailedConnections+=doc.resultInfo.connectStatus!='success'?1:0

                prev.totalSuccessfulFirstConnections+=doc.timeInfo.connectSuccessTime_1?1:0

                prev.totalSuccessfulSecondConnections+=doc.timeInfo.connectSuccessTime_2?1:0

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
