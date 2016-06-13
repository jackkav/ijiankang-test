db.getCollection('TestV2001').find({}).count()


var results = db.runCommand({
    'group':{
        'ns':'TestV2001',
//         'key':{
//                 'mobileInfo.platform':1,
//                 'mobileInfo.version':1,
//                 'mobileInfo.manufacturer':1 ,
//                 'mobileInfo.model':1,
//                 'mobileInfo.serial':1,
//            
//             },
        '$keyf':function(x){
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
        'initial':{
        	
       
//                 max_type_1_connect_times:0,       
//                 max_type_1_discover_times:0,
                
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

                ],
           
            
//                 max_type_2_connect_times:0,       
//                 max_type_2_discover_times:0,
//                 
//         	count_type_2:0,
//         	count_type_2_result_success:0,

        	//连接超时次数
//         	count_connect_timeout:0,

        },
        $reduce:function(doc,prev){
                
            
        	if(doc.testType ==1){
        		//prev.count_type_1++
                    
                        prev.type1_testTimesAll++
                        prev.type1_connectTimesAll = prev.type1_connectTimesAll+doc.connectInfo.length
                        
                        
                        for(var i=0;i<10;i++){
                           if(i<doc.connectInfo.length)prev.type1_connectTimes[i].sum++
                         }
                         
                         //统计超时次数
                        for(var i=0;i<doc.connectInfo.length;i++){
                           //prev.type1_connectTimes[i].all++
                           if(doc.connectInfo[i].errorType =="connect_timeout"){
                               prev.type1_connect_timeout_count++
                            }
                               
                         }
                         
                         // 第doc.connectInfo.length次连接成功
                         if(doc.resultInfo.connectStatus == 'success'){
                             prev.type1_connectTimes[doc.connectInfo.length-1].success++
                             prev.type1_connectTimesSuccessAll++
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
                         
                         //统计超时次数
                        for(var i=0;i<doc.connectInfo.length;i++){
                           //prev.type1_connectTimes[i].all++
                           if(doc.connectInfo[i].errorType =="connect_timeout"){
                               prev.type1_connect_timeout_count++
                            }
                               
                         }
                         
                         // 第doc.connectInfo.length次连接成功
                         if(doc.resultInfo.connectStatus == 'success'){
                             
                             prev.type2_connectTimes[doc.connectInfo.length-1].success++
                             prev.type2_connectTimesSuccessAll++
                         }
                        
                     
                        //统计最多次数                        
                         if(doc.connectInfo.length>prev.max_type_2_connect_times){
                            prev.max_type_2_connect_times=  doc.connectInfo.length
                        }
                        if(doc.discoverInfo.length>prev.max_type_2_discover_times){
                            prev.max_type_2_discover_times=  doc.discoverInfo.length
                        }
                    
                        
                    
                    
                    
                    
                    
                    
                    
                    
                    
//         		prev.count_type_2++
//                     
//                         if(doc.connectInfo.length>prev.max_type_2_connect_times){
//                             prev.max_type_2_connect_times=  doc.connectInfo.length
//                         }
//                         if(doc.discoverInfo.length>prev.max_type_2_discover_times){
//                             prev.max_type_2_discover_times=  doc.discoverInfo.length
//                         }
//                     
//                         if(doc.resultInfo.connectStatus == 'success'){
//                             prev.count_type_2_result_success++
//                             
//                             if(doc.connectInfo.length==1){
//                                 prev.count_type_2_connect1_success++
//                              }
//                         }
//                     
                    
        	}
                
                

        }
    }
})

print(results)


db.TestV2001_analyze_1.remove({})
results.retval.forEach(function(data){
    
    data.mobileString=data.mobileInfo.platform+ '|' + data.mobileInfo.version+ '|' + data.mobileInfo.manufacturer + '|' + data.mobileInfo.model+ '|' + data.mobileInfo.serial

   
    db.TestV2001_analyze_1.insert(data)
})

