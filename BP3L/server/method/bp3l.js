Meteor.methods({


  'bp3l.initData': ()=>{

    let bp3lData = [
      {macId: 'D05FB8418966', status: false},
      {macId: '7CEC793A0306', status: false},
      {macId: '7CEC79E05EFA', status: false}
    ];

    for(let i=0; i < bp3lData.length; i++) {
      DB.BP3LInfo.insert(bp3lData[i]);
    }

  },

  'bp3l.getAvailableDevice': ()=>{

    let initData = DB.BP3LInfo.find({}).fetch();

    if(!initData.length) {
      Meteor.call('bp3l.initData');
    }

    let bp3lList = DB.BP3LInfo.find({'status': false}).fetch();

    if(!bp3lList.length) {

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

  'bp3l.updateAvailableDeviceStatus': (macId)=>{
    DB.BP3LInfo.update({_id: macId}, {
      $set: {
        'status': false
      }
    })
  }

})
