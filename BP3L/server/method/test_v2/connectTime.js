/**
 * Created on 6/13/16.
 */


Meteor.methods({
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