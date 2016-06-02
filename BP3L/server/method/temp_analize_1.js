/**
 * Created by fanjinhui on 5/31/16.
 */


function getDeviceString(deviceInfo){
  let str= deviceInfo.platform
      +'|'+ deviceInfo.version
      +'|'+ deviceInfo.manufacturer
      +'|'+ deviceInfo.model
      +'|'+ deviceInfo.serial
  return str
}

Meteor.methods({

    'temp_analize_1': (testId)=> {



        //所有的testid

        let tests = DB.IDInfo.find().fetch()

        let result = []

        tests.forEach(function (item, index, arr) {
            let test = {
                testId:item.testId
            }
            console.log('handle test: '+item.testId)
            if (item.testType == "DiscoverAndConnectAndMeasureTest") {
                test.testType = 'DiscoverAndConnectAndMeasureTest'
                //test.deviceInfo = item.deviceInfo
                //test.device = item.deviceInfo.platform +'|'+ item.deviceInfo.manufacturer+'|' + item.deviceInfo.version+ '|'+item.deviceInfo.model

                test.device=getDeviceString(item.deviceInfo)

                //第一次直连
                test.connect_1_count = DB.DiscoverAndConnectAndMeasureTest.find({
                    testId: item.testId
                }).count()
                test.connect_1_count_failure = DB.DiscoverAndConnectAndMeasureTest.find({
                    testId: item.testId,
                    'timeData.connectFailTime_1': {$exists: 1}
                }).count()

                test.connect_1_count_success = test.connect_1_count - test.connect_1_count_failure


                //第二次直连
                test.connect_2_count = DB.DiscoverAndConnectAndMeasureTest.find({
                    testId: item.testId,
                    'timeData.connectStartTime_2': {$exists: 1}

                }).count()

                test.connect_2_count_failure = DB.DiscoverAndConnectAndMeasureTest.find({
                    testId: item.testId,
                    'timeData.connectFailTime_2': {$exists: 1}
                }).count()

                test.connect_2_count_success = test.connect_2_count - test.connect_2_count_failure


                DB.TempAnalize1.insert(test)

            } else {


                test.testType = 'SLDtest'
                //test.deviceInfo = item.deviceInfo
                //test.device = item.deviceInfo.platform +'|'+ item.deviceInfo.version+ '|'+item.deviceInfo.model
                test.device=getDeviceString(item.deviceInfo)


                //第一次发现
                test.discover_1_count = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.discoveryStartTime_1':{$exists: 1}
                }).count()
                test.discover_1_count_failure = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.discoveryFailureTime_1': {$exists: 1}
                }).count()
                test.discover_1_count_success = test.discover_1_count -test.discover_1_count_failure


                //第二次发现
                test.discover_2_count = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.discoveryStartTime_2':{$exists: 1}
                }).count()
                test.discover_2_count_failure = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.discoveryFailureTime_2': {$exists: 1}
                }).count()
                test.discover_2_count_success = test.discover_2_count -test.discover_2_count_failure




                //第一次直连
                test.connect_1_count = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.connectStartTime_1':{$exists: 1}
                }).count()
                test.connect_1_count_failure = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.connectFailureTime_1': {$exists: 1}
                }).count()

                test.connect_1_count_success = test.connect_1_count - test.connect_1_count_failure


                //第二次直连
                test.connect_2_count = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.connectStartTime_2': {$exists: 1}

                }).count()

                test.connect_2_count_failure = DB.SLDtest.find({
                    testId: item.testId,
                    'timeData.connectFailureTime_2': {$exists: 1}
                }).count()

                test.connect_2_count_success = test.connect_2_count - test.connect_2_count_failure


                DB.TempAnalize1.insert(test)

            }

        })


    }

})
