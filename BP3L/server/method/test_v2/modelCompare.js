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

}
})
