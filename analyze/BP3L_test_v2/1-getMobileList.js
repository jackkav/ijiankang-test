/**
 * Created by fanjinhui on 6/7/16.
 */


var results = db.runCommand({
    'group':{
        'ns':'TestV2001',
        '$keyf':function(x){
            var mobileInfo = x.mobileInfo
            return {
                platform:mobileInfo.platform,
                version:mobileInfo.version,
                manufacturer:mobileInfo.manufacturer ,
                model:mobileInfo.model,
                serial:mobileInfo.serial

            };
        },
        'initial':{

        },
        $reduce:function(doc,prev){
        }
    }
})

db.TestV2001_mobiles.remove({})
results.retval.forEach(function(mobileInfo){

    db.TestV2001_mobiles.insert({
        mobileString:mobileInfo.platform+ '|' + mobileInfo.version+ '|' + mobileInfo.manufacturer + '|' + mobileInfo.model+ '|' + mobileInfo.serial ,
        mobileInfo:mobileInfo
    })
})
