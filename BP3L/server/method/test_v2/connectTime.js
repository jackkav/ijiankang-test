/**
 * Created on 6/13/16.
 */

Future = Npm.require('fibers/future');

Meteor.methods({

    //todo delete
    'test_v2/connectTime':function(){

        console.log('in test_v2/connectTime')
        //获取时间统计数据

        var sum=DB.TestV2001.find({
            'resultInfo.connectStatus':'success'
        }).count()


        var result ={
            x:[],
            y:[]
        }
        var count=0
        for(var i=1;i<125;i++){
            console.log(i)

            count = DB.TestV2001.find({
                'resultInfo.connectStatus':'success',
                'resultInfo.connectSuccessTime':{$lte:i*200}

            }).count()

            // result[i] = {
            //     i:i,
            //     sum:sum,
            //     count:count,
            //     p:count/sum
            // }

            //echart format
            result.x.push(i)
            result.y.push(count/sum)

        }

        console.log(result)

        return result;

    },


    'test_v2/getConnectTimeData':function(filter){


        // console.log(Mongo.Collection.prototype)
        //
        // console.log('----------')
        //
        // console.log(DB.TestV2001)

        //(keys, condition, initial, reduce[, finalize[, command[, options]]])


        var myFuture = new Future();
        DB.TestV2001.rawCollection().group(

            function(x){
                var mobileInfo = x.mobileInfo
                return {
					
					testType:x.testType,
					
					
                    m_platform:mobileInfo.platform,  //time
					m_version:mobileInfo.version,
					m_manufacturer:mobileInfo.manufacturer,
					m_model:mobileInfo.model,
					m_serial:mobileInfo.serial,
                
                };  
            },
            //condition
            {

                'resultInfo.connectSuccessTime':{$exists:1},
                'resultInfo.connectStatus':'success',
            },

            //initial
            {
                "count":0
            },

            //reduce
            function(doc,prev){
                prev.count++
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




	'test_v2/getSearchOptionsData':function(){
        var myFuture = new Future();
		DB.TestV2001.rawCollection().group(
            function(x){
                var mobileInfo = x.mobileInfo
                return {
                    x:Math.floor(x.resultInfo.connectSuccessTime/100),  //time

                };
            },
            //condition
            {

                'resultInfo.connectSuccessTime':{$exists:1},
                'resultInfo.connectStatus':'success',
            },

            //initial
            {
                "count":0
            },

            //reduce
            function(doc,prev){
                prev.count++
            },

            function (err, result) {

                if(err){
                    throw new Meteor.Error(err)
                }
                return myFuture.return(result);
            }
		)
		
        return myFuture.wait();
		
		
		
	},

    //生成数据
    'test_v2/connectTime/update':function(){

        var resultCursor = DB.TestV2001.find({
            'resultInfo.connectStatus':'success'
        }).sort({'resultInfo.connectSuccessTime':1})




    },

    //读取数据
    'test_v2/connectTime/search':function(){


    },

})