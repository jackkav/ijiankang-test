/**
 * Created by fanjinhui on 5/31/16.
 */


//一次测试
Schema.TestV2001 = new SimpleSchema([Schema.Base, {

    /*
        1:  直连
        2:  发现+连接
    * */
    testType:{
        type: Number,
        allowedValues: [1,2],

    },

    macId:{
        type: String,
        label: 'BP3L Id (D05FB8418966)'
    },
    deviceInfo:{
        type: Object,
        blackbox: true,
        optional: true,
    },

    //'设备型号(Android/Iphone) 设备品牌(OPPO/XIAOMI...) 设备版本(4.4.4/9.2.1...)
    mobileInfo: {
        type: Object,
        blackbox: true,
        optional: true,
    },

    //结果
    // status: {
    //     type: String,
    //     optional: true,
    //     //allowedValues: ["success","failure"],
    //     //allowedValues: ["success","failure",'uncompleted'],
    //     //defaultValue: 'uncompleted'
    // },

    //{type:''}
    resultInfo:{
      type: Object,
      blackbox: true,
      optional: true
    },

    /*

     runsSartTime
     runEndTime
     runResultType  ＝‘success’


     discoveryStartTime_1
     discoveryFailureTime_1
     discoverSuccessTime_1
     discoverErrorTime_1


     connectStartTime_1
     connectSuccessTime_1
     connectFailureTime_1
     connectErrorTime_1

     connectTimeout_1

     measureStartTime
     measureFailureTime
     measureDoneTime
     measureErrorTime

     disconnectStartTime
     disconnectSuccessTime
     disconenctFailureTime


     * */
    timeInfo:{
        type: Object,
        blackbox: true,
        optional: true
    },


    discoverInfo:{
        type: [Object],
        blackbox: true,
        optional: true
    },

    ////////////////
    connectInfo:{
        type: [Object],
        blackbox: true,
        optional: true
    },

    disconnectInfo:{
        type: [Object],
        blackbox: true,
        optional: true
    },
    /*
     {
     "startTime" : 1463489320180,
     "endTime" : 1463489328249,
     "endType" : "Error",
     "endInfo" : {
     "msg" : "Error",
     "errorid" : "4",
     "producttype" : "BP",
     "productmodel" : "BP3L",
     "address" : "D05FB8418966"
     }
     },
    * */
    measureInfo:{
        type: Object,
        blackbox: true,
        optional: true
    },


}])

DB.TestV2001 = new Mongo.Collection('TestV2001')
DB.TestV2001.attachSchema(Schema.TestV2001)
