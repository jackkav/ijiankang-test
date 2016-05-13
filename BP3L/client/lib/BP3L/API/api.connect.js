
class APIConnect extends EventEmitter {
	constructor(props) {
		super(props)

	  this.initEvent()
		this.data = {}
		this.stopDiscoverySuccess = false;
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


	stopDiscoveryPromise() {
		return new Promise((resolve, reject)=>{
			BpManagerCordova.stopDiscovery((res)=>{
	      console.log('stop discovery!');
				resolve();
			},(err)=>{
				console.log('Cordvoa Error: ', err);
				reject();
			}, BP3L.appsecret)
		})
	}

  discoveryPromise(deviceId) {
		let self = this;
		let deviceInfo = h.getDeviceInfo();
		let apiType = 'discovery';

    return new Promise((resolve, reject)=>{
			self.data = {
				type: 'discoveryByIdAndConnect',
				startDiscoveryTime: +new Date()
			}
      BpManagerCordova.startDiscovery((res)=>{

        let device = BP3L.parseJSON(res);
				console.log('Searching', res);
        if( !deviceId || device.address && device.address === deviceId){

					self.data.discoverySuccessTime = +new Date();
          this.stopDiscovery();
					this.stopDiscoverySuccess = true;

					let status = 'success';
          let device = BP3L.parseJSON(res);
					let data = self.data;

					DB.APItest.insert({deviceInfo, apiType, status, data});
          resolve(device.address);

					console.log('Discovery success', device.address);

        }else if(device && device.msg === 'DiscoveryDone' && !this.stopDiscoverySuccess){

					self.data.discoveryFailureTime = +new Date();
					let status = 'failure';
					let data = self.data;

					let content = {deviceInfo, apiType, status, data}

					DB.APItest.insert(content);
					reject(`Discovery timeout ${lastId}`)
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
			console.log(`Start connect ${macId}`);

      BpManagerCordova.connectDevice((res)=>{

        let device = BP3L.parseJSON(res);

        if(device && device.msg === 'Connected') {

          let status = 'success';

          DB.APItest.insert({deviceInfo, apiType, status});

					console.log(`Connect success ${macId}`);
        }else if(device && device.msg === 'ConnectionFail') {

					let status = 'failure';

	        DB.APItest.insert({deviceInfo, apiType, status});

					console.log(`Connect failure ${macId}`);

				}

      },(err)=>{

        console.log('Cordvoa Error: ', err)

      },BP3L.appsecret, macId)

    }, (err)=>{
      console.log("Make sure you discovery function is ok!", err)
    })
  }


	connectPromise(deviceId) {

		let self = this;
		return new Promise((resolve, reject)=>{

	    self.discoveryPromise(deviceId).then((macId)=>{

	      let deviceInfo = h.getDeviceInfo();
	  		let apiType = 'connect';
				console.log(`Start connect ${macId}`);

				Object.assign(self.data, {startConnectTime: +new Date()})

	      BpManagerCordova.connectDevice((res)=>{

	        let device = BP3L.parseJSON(res);

					console.log(`connect status ${ device && device.msg }`);

	        if(device && device.msg === 'Connected') {

	          let status = 'success';
						let data = self.data;
						Object.assign(self.data, {connectSuccessTime: +new Date()})
	          DB.APItest.insert({deviceInfo, apiType, status, data});

						console.log(`Connect success ${macId}`);

						resolve(macId);
	        }else if(device && device.msg === 'ConnectionFail') {

						let status = 'failure';
						let data = self.data;
						Object.assign(self.data, {connectFailureTime: +new Date()})
		        DB.APItest.insert({deviceInfo, apiType, status, data});

						console.log(`Connect failure ${macId}`);

						reject(`Connect failure ${macId}`)
					}

	      },(err)=>{

	        console.log('Cordvoa Error: ', err)

	      },BP3L.appsecret, macId)

	    }, (err)=>{
				reject(err);
	      console.log("Make sure you discovery function is ok!", err)
	    })
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

				let device = BP3L.parseJSON(res);

				if(device && device.address === macId) {

					let status = 'success';

					DB.APItest.insert({deviceInfo, apiType, status});

					console.log('Disconnect success!')

				}else {

					let status = 'failure';

					DB.APItest.insert({deviceInfo, apiType, status});

					console.log('Disconnect failure!')
				}



			}, (error)=>{
				console.error('Cordvoa Error: ', error);
			}, BP3L.appsecret, macId)


		}, (error)=>{
			console.log(error.errMsg);
		})

  }


	disconnectPromise(macId) {

		let self = this;

		return new Promise((resolve, reject) => {

			console.log('Disconnect start');

			self.getConnectDevicePromise(macId).then((res)=>{

				let deviceInfo = h.getDeviceInfo();
	  		let apiType = 'dis-connect';


				BpManagerCordova.setDisconnectCallback((res)=>{

					let device = BP3L.parseJSON(res);

					if(device && device.address === macId) {

						let status = 'success';

						// DB.APItest.insert({deviceInfo, apiType, status});

						console.log('Disconnect success!')

						resolve('Disconnect success!');

					}else {

						let status = 'failure';

						// DB.APItest.insert({deviceInfo, apiType, status});

						console.log('Disconnect failure!')

						reject('Fail to Disconnect');
					}

				}, (error)=>{
					console.error('Cordvoa Error: ', error);
				}, BP3L.appsecret, macId)

				BpManagerCordova.disConnectDevice((res)=>{
					console.log('Disconnect callback success!', res);
				}, (error)=>{
					console.log('Cordvoa Error: ', error);
				}, BP3L.appsecret, macId);

			}, (error)=>{
				console.log(error.errMsg);
			})

		})
	}


	disConnectTest(macId) {

		console.log('Disconnect start');

		let deviceInfo = h.getDeviceInfo();
		let apiType = 'dis-connect';

		BpManagerCordova.disConnectDevice((res)=>{
			console.log('Disconnect callback success!', res);
		}, (error)=>{
			console.log('Cordvoa Error: ', error);
		}, BP3L.appsecret, macId);


		BpManagerCordova.setDisconnectCallback((res)=>{

			let device = BP3L.parseJSON(res);

			if(device && device.address === macId) {

				let status = 'success';

				// DB.APItest.insert({deviceInfo, apiType, status});

				console.log('Disconnect success!')

			}else {

				let status = 'failure';

				// DB.APItest.insert({deviceInfo, apiType, status});

				console.log('Disconnect failure!')
			}


		}, (error)=>{
			console.error('Cordvoa Error: ', error);
		}, BP3L.appsecret, macId)

  }
}


this.APIConnect = APIConnect
