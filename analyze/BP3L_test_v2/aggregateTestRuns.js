db.TestV2001.aggregate( [
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
db.TestV2001.aggregate( [
//     { $project: {
//         _id: 0,
//         model: '$mobileInfo.model',
//         result: '$resultInfo.connectStatus',
//          attemptsObject: '$connectInfo',
//          connected: {$cond: [{$gt: ['$resultInfo.connectStatus', 0]}, '$Sentiment', 0]},
//     }},
   { $group: {
       _id: '$mobileInfo.model',
        totalConnectionAttempts: { $sum: '$connectInfo'.length },
        totalSuccessfulConnections: {$sum: {$cond: [{$gt: ['$resultInfo.connectStatus', 0]}, 1, 0]}},
       }
   },
//    { $sort : { _id : 1 } },

//     { $match: { totalPop: { $gte: 1000 } } }
] )
