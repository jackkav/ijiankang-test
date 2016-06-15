var results = db.runCommand({
    group:{
        ns:'TestV2001',
        $keyf:function(x){
            var mobileInfo = x.mobileInfo
            return {
                mobileInfo:{
                    platform:mobileInfo.platform,
                    version:mobileInfo.version,
                    manufacturer:mobileInfo.manufacturer ,
                    model:mobileInfo.model,
                },
                testType:x.testType,
            };
        },
        initial:{
                totalTestRuns:0,     //测试次数
                totalConnectionAttempts:0,   //总连接次数
                totalSuccessfulConnections:0,
                totalConnectionTimeOuts:0,
        },
        // $cond: {
        //   [testType: 1]
        // }
        $reduce:function(doc,prev){
        	if(doc.testType ==1){
                        prev.totalTestRuns++
                        prev.totalConnectionAttempts = prev.totalConnectionAttempts+doc.connectInfo.length
                        if(doc.resultInfo.connectStatus == 'success'){
                            prev.totalSuccessfulConnections++
                        }
                         //统计超时次数
                        for(var i=0;i<doc.connectInfo.length;i++){
                           if(doc.connectInfo[i].errorType =="connect_timeout"){
                               prev.totalConnectionTimeOuts++
                            }
                         }
        	}
        }
    }
})

print(results.retval)
