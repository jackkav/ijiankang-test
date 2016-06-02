/**
 * Created by fanjinhui on 5/31/16.
 */


//一次测试
Schema.TestV1001 = new SimpleSchema([Schema.Base, {

    /*
        1:  直连
        2: 发现+连接
    * */
    testType:{
        type: Number,
    },

    macId:{
        type: String,
        label: '小馒头Id (D05FB8418966)'
    },
    deviceInfo:{

    },

    //'设备型号(Android/Iphone) 设备品牌(OPPO/XIAOMI...) 设备版本(4.4.4/9.2.1...)
    mobileInfo: {
        type: Object,
        blackbox: true,
    },

    status: {
        type: String,
        optional: true,
        label: 'success/failure/uncompleted'
    },

    /*

     runsSartTime
     runEndTime
     runResultType  ＝‘success’


     discoveryStartTime_1
     discoveryFailureTime_1
     discoverSuccessTime_1


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


    ////////////////
    connectInfo:{
        type: Object,
        blackbox: true,
        optional: true
    },
    measureInfo:{
        type: Object,
        blackbox: true,
        optional: true
    },




}])

DB.TestSession = new Mongo.Collection('TestSession')
DB.TestSession.attachSchema(Schema.TestSession)