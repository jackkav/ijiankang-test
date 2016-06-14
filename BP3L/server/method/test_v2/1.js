/**
 * Created by fanjinhui on 6/7/16.
 */


Meteor.methods({

    'test_v2/mobile_list':function(){

        DB.TestV2001.find()

    },
    
    'test_v2/testGroup':function(){




    },

    'test_v2/getOverviewData':function(){

        let queryCondition ={}

        var myFuture = new Future();
        DB.TestV2001.rawCollection().group(

            function(x){
                var mobileInfo = x.mobileInfo
                return {
                    mobileInfo:{
                        platform:mobileInfo.platform,
                        version:mobileInfo.version,
                        manufacturer:mobileInfo.manufacturer ,
                        model:mobileInfo.model,
                        serial:mobileInfo.serial,
                    },

                    testType:x.testType,


                };
            },
            //condition
            // {
            //
            //     'resultInfo.connectSuccessTime':{$exists:1},
            //     'resultInfo.connectStatus':'success',
            // },
            queryCondition,

            //initial
            {
                type1_testTimesAll:0,     //测试次数
                type1_connectTimesAll:0,   //总连接次数
                type1_connectTimesSuccessAll:0,

                type1_connectTimes:[
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},

                ],
                type1_connect_timeout_count:0,


                ///=============

                type2_connectTimes:[
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},
                    {sum:0,success:0},

                ],
            },

            //reduce
            function(doc,prev){
                if(doc.testType ==1){
                    //prev.count_type_1++

                    prev.type1_testTimesAll++
                    prev.type1_connectTimesAll = prev.type1_connectTimesAll+doc.connectInfo.length


                    for(var i=0;i<10;i++){
                        if(i<doc.connectInfo.length)prev.type1_connectTimes[i].sum++
                    }

                    // 第doc.connectInfo.length次连接成功
                    if(doc.resultInfo.connectStatus == 'success'){

                        for(var j =0;j<doc.connectInfo.length;j++){
                            if(doc.connectInfo[j].type=='success'){
                                prev.type1_connectTimes[j].success++

                            }
                        }


                        prev.type1_connectTimesSuccessAll++
                    }
                    //统计超时次数
                    for(var i=0;i<doc.connectInfo.length;i++){
                        //prev.type1_connectTimes[i].all++
                        if(doc.connectInfo[i].errorType =="connect_timeout"){
                            prev.type1_connect_timeout_count++
                        }

                    }




                    //统计最多次数
                    if(doc.connectInfo.length>prev.max_type_1_connect_times){
                        prev.max_type_1_connect_times=  doc.connectInfo.length
                    }
                    if(doc.discoverInfo.length>prev.max_type_1_discover_times){
                        prev.max_type_1_discover_times=  doc.discoverInfo.length
                    }





                }else if(doc.testType ==2){


                    prev.type2_testTimesAll++
                    prev.type2_connectTimesAll = prev.type2_connectTimesAll+doc.connectInfo.length


                    for(var i=0;i<10;i++){
                        if(i<doc.connectInfo.length)prev.type2_connectTimes[i].sum++
                    }


                    // 第doc.connectInfo.length次连接成功
                    if(doc.resultInfo.connectStatus == 'success'){

                        //prev.type2_connectTimes[doc.connectInfo.length-1].success++
                        for(var j =0;j<doc.connectInfo.length;j++){
                            if(doc.connectInfo[j].type=='success'){
                                prev.type2_connectTimes[j].success++

                            }
                        }

                        prev.type2_connectTimesSuccessAll++
                    }


                    //统计超时次数
                    for(var i=0;i<doc.connectInfo.length;i++){
                        //prev.type1_connectTimes[i].all++
                        if(doc.connectInfo[i].errorType =="connect_timeout"){
                            prev.type1_connect_timeout_count++
                        }

                    }



                    //统计最多次数
                    if(doc.connectInfo.length>prev.max_type_2_connect_times){
                        prev.max_type_2_connect_times=  doc.connectInfo.length
                    }
                    if(doc.discoverInfo.length>prev.max_type_2_discover_times){
                        prev.max_type_2_discover_times=  doc.discoverInfo.length
                    }

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


