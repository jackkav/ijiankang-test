
class APIConnect extends EventEmitter {
	constructor(props) {
		super(props)

	  this.initEvent()
	}

	initEvent(){
    //TODO
	}

  stopDiscovery() {
    BpManagerCordova.stopDiscovery((res)=>{
      console.log('stop discovery!');
		},(err)=>{
			console.log('Cordvoa Error: ', err);
		}, BP3L.appsecret)
  }

  discoveryPromise(lastId) {
    return new Promise((resolve, reject)=>{

      BpManagerCordova.startDiscovery((res)=>{

        let device = BP3L.parseJSON(res);
				console.log('Searching', res);
        if( !lastId || device.address && device.address.substr(-4) === lastId){

          this.stopDiscovery();

          let device = BP3L.parseJSON(res);

          resolve(device.address);

					console.log('Discovery success', device.address);
        }

      }, (err)=>{
        reject(err);
      }, BP3L.appsecret)
    })
  }

  connect() {
    let lastId = '8966';
    this.discoveryPromise(lastId).then((macId)=>{

      let deviceInfo = h.getDeviceInfo();
  		let apiType = 'connect';


      let connectFauilreTime = Meteor.setTimeout(()=>{

        let status = 'failure';

        DB.APItest.insert({deviceInfo, apiType, status});

      }, 15000)

      BpManagerCordova.connectDevice((res)=>{

        Meteor.clearTimeout(connectFauilreTime);

        let device = BP3L.parseJSON(res);

        if(device && device.msg === 'Connected') {

          let status = 'success';

          DB.APItest.insert({deviceInfo, apiType, status});

					console.log('Discovery success');
        }

      },(err)=>{

        console.log('Cordvoa Error: ', err)

      },BP3L.appsecret, macId)

    }, (err)=>{
      console.log("Make sure you discovery function is ok!", err)
    })
  }


	getConnectDevicePromise(macId) {
		return new Promise((resolve, reject)=>{

			BpManagerCordova.getConnectedDevice((res)=>{

				let parseObject = BP3L.parseJSON(res);
				let list = parseObject && parseObject.list;

				list = _.filter(list,function(item){
					return item.name == 'BP3L' && item.address === macId;
				})

				if (!list.length) {
					reject({errMsg: `Make sure you connect the ${macId} firstly!`});
				}else {
					console.log(`Find the match macId ${macId}`);
					resolve(macId);
				}
			},  null, BP3L.appsecret)

		})
	}

	disConnect(macId) {

		console.log('Disconnect start');

		this.getConnectDevicePromise(macId).then((res)=>{

			let deviceInfo = h.getDeviceInfo();
  		let apiType = 'dis-connect';

			BpManagerCordova.disConnectDevice((res)=>{
				console.log('Disconnect callback success!', res);
			}, (error)=>{
				console.log('Cordvoa Error: ', error);
			}, BP3L.appsecret, macId);


			BpManagerCordova.setDisconnectCallback((res)=>{

				let status = 'success';

				DB.APItest.insert({deviceInfo, apiType, status});

				console.log('Disconnect end!')

			}, (error)=>{
				console.error('Cordvoa Error: ', error);
			}, BP3L.appsecret, macId)


		}, (error)=>{
			console.log(error.errMsg);
		})

  }
}


this.APIConnect = APIConnect
