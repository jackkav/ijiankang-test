Meteor.methods({


    'bp3l.initData': ()=> {

        let MACID_LIST = [
            '7CEC79E05EFA',
            'D05FB8418966',
            '7CEC794184DB',
            '7CEC793A0306',
            '7CEC7939E9B9',
            'A4D578405B5A',
            'A4D578416D45',
            'A4D5783F5A67',
            'A4D578408246',
            "20C38FECC518",
            "D05FB8418B71",
            "D05FB8418720",
            "D05FB8418B06",
            "D05FB8418903",
            "D05FB841892E",
            "7CEC79E06244",

        ]

        for (let i = 0; i < MACID_LIST.length; i++) {
            let macId = MACID_LIST[i]
            DB.BP3LInfo.insert({macId});
        }

    },

    'bp3l.getAvailableDevice': ()=> {

        let initData = DB.BP3LInfo.find({}).fetch();

        if (!initData.length) {
            Meteor.call('bp3l.initData');
        }

        let bp3lList = DB.BP3LInfo.find({'status': false}).fetch();

        if (!bp3lList.length) {

            console.log('No available device to connect~~');
            return ''
        }

        DB.BP3LInfo.update({_id: bp3lList[0]._id}, {
            $set: {
                'status': true
            }
        })

        return bp3lList[0].macId;

    },

    'bp3l.updateAvailableDeviceStatus': (macId)=> {
        DB.BP3LInfo.update({_id: macId}, {
            $set: {
                'status': false
            }
        })
    }

})
