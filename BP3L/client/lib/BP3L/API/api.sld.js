
TIMEOUT_COUNT = 2;

let MACID_LIST= [
  '7CEC79E05EFA',
  'D05FB8418966',
  '7CEC794184DB',
  '7CEC793A0306',
  '7CEC7939E9B9'
]

var DEFAULT_Value = Immutable.Map({
	runningLog: []
})

class SLDTest extends EventEmitter {

  constructor(props) {
		super(props)

	  this.initEvent()
		this.data = {}
		this.stopDiscoverySuccess = false;
    this.count = 0;

    this.aReactiveInfo = new ReactiveVar(DEFAULT_Value)

	}

  initEvent(){
    //TODO
	}

  pushInfoToReact(value) {

    let info = this.aReactiveInfo.get();

    let list = info.get('runningLog');
    list.unshift(value);

    info.set('runningLog',list);

    this.aReactiveInfo.set(info)

  }

  stopDiscovery() {
    BpManagerCordova.stopDiscovery((res)=>{
      this.stopDiscoverySuccess = false;
      console.log('stop discovery!');
    },(err)=>{
      console.log('Cordvoa Error: ', err);
    }, BP3L.appsecret)
  }

  discoveryPromise(deviceId, sessionId,testId) {
    let self = this;
    let deviceInfo = h.getDeviceInfo();
    let apiType = 'discovery';

    return new Promise((resolve, reject)=>{

      let startDiscovery = ()=>{
        self.count++;
        self.data[`startDiscoveryTime${self.count}`] = +new Date()
        BpManagerCordova.startDiscovery((res)=>{

          let device = BP3L.parseJSON(res);
          console.log('Searching', res);
          self.pushInfoToReact(`Searching${res}`)

          if( !deviceId && res.msg !== 'Error' || device.address && MACID_LIST.indexOf(device.address) !== -1){

            self.data[`discoverySuccessTime${self.count}`] = +new Date();
            self.data['discoverySuccessCount'] = this.count;

            this.stopDiscovery();
            this.stopDiscoverySuccess = true;


            // let status = 'success';
            // let device = BP3L.parseJSON(res);
            // let data = self.data;
            // let macId = device.address;
            let count = this.count;

            this.count = 0;
            // DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, count, sessionId, testId});

            resolve(device.address);
            self.pushInfoToReact(`Discovery success${device.address}`)
            console.log('Discovery success', device.address);

          }else if(device && device.msg === 'DiscoveryDone' && !this.stopDiscoverySuccess){

            self.data[`discoveryFailureTime${self.count}`] = +new Date();
            self.data['discoveryFailureCount'] = this.count;

            self.pushInfoToReact(`Discovery timeout ${count} ${deviceId}`)
            console.log(`Discovery timeout ${count} ${deviceId}`);

            if(this.count < TIMEOUT_COUNT) {
              startDiscovery();
              return;
            }

            let status = 'failure';
            let data = self.data;
            let count = this.count;

            let content = {deviceInfo, apiType, status, data, sessionId, testId}

            DB.SLDtest.insert(content);
            this.count = 0;
            reject(`Discovery timeout ${deviceId}`)

          }

        }, (err)=>{
          self.pushInfoToReact(`Make sure you discovery function is ok!`);
          console.log("Make sure you discovery function is ok!", err)
          reject(err);
        }, BP3L.appsecret)
      }

      startDiscovery();

    })
  }

  connectPromise(macId, sessionId, testId) {

		let self = this;
		return new Promise((resolve, reject)=>{

      let deviceInfo = h.getDeviceInfo();
  		let apiType = 'connect';

			console.log(`Start connect ${macId}`);
      self.pushInfoToReact(`Start connect ${macId}`);

      let connectDevice = ()=>{
        this.count++;
        self.data[`startConnectTime${self.count}`] = +new Date()
        BpManagerCordova.connectDevice((res)=>{

          let device = BP3L.parseJSON(res);

          if(device && device.msg === 'Connected') {

            self.data[`connectSuccessTime${self.count}`] = +new Date()
            self.data['connectSuccessCount'] = this.count
            // let status = 'success';
  					// let data = self.data;
            let count = this.count;
            console.log(`Connect success ${count} ${macId}`);
            self.pushInfoToReact(`Connect success ${count} ${macId}`);
            
            this.count = 0;

            // DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, count, sessionId, testId});


  					resolve(macId);

          }else if(device && device.msg === 'ConnectionFail') {


            let count = this.count;

            self.data[`connectFailureTime${self.count}`] = +new Date();
            self.data['connectFailureCount'] = this.count;

            console.log(`Connect failure ${count} ${macId}`);
            self.pushInfoToReact(`Connect failure ${count} ${macId}`);

            if(this.count < TIMEOUT_COUNT) {
              connectDevice();
              return;
            }

  					let status = 'failure';
  					let data = self.data;

            this.count = 0;

  	        DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, testId, sessionId});

  					reject(`Connect failure ${macId}`)
  				}

        },(err)=>{

          console.log('Cordvoa Error: ', err)

        },BP3L.appsecret, macId)
      }

      connectDevice();


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

	disconnectPromise(macId, sessionId, testId) {

		let self = this;

    let deviceInfo = h.getDeviceInfo();
    let apiType = 'disConnect';

		return new Promise((resolve, reject) => {

			console.log('Disconnect start');

      self.data['startDisConnectTime'] = +new Date();

			self.getConnectDevicePromise(macId).then((res)=>{

				let deviceInfo = h.getDeviceInfo();
	  		let apiType = 'dis-connect';


				BpManagerCordova.setDisconnectCallback((res)=>{

					let device = BP3L.parseJSON(res);

					if(device && device.address === macId) {

            self.data['disConnectSuccessTime'] = +new Date();

						let status = 'success';

						// DB.SLDtest.insert({deviceInfo, apiType, status});

						console.log('Disconnect success!')

						resolve('Disconnect success!');

					}else {

            self.data['disConnectFailureTime'] = +new Date();
						let status = 'failure';

            let data = self.data;

						DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, sessionId, testId});

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


  tryMeasurePromise(macId, sessionId, testId) {

		let self = this

    let deviceInfo = h.getDeviceInfo();
    let apiType = 'measureDone';

    return new Promise((resolve, reject) =>{
      self.data['startMeasureTime'] = +new Date();
      BpManagerCordova.startMeasure(function (res) {
  			var json = BP3L.parseJSON(res);

  			if ((json.msg == 'ZeroDoing' || json.msg == 'ZeroDone')) {

  			} else if (json && json.msg == 'MeasureDone') {


  			} else if (json && json.msg == 'MeasureDoing') {

  			} else if (json && json.msg == 'Error') {

          console.log('袖带太松 ');
          self.data['measureTimeForLoose'] = +new Date();
  				self.pushInfoToReact('袖带太松 ');

          let status = 'success';
          let data = self.data;

          DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, sessionId, testId});

          resolve();
  			}

  		}, (err)=> {

  			reject(err);
        console.log('Cordvoa Error: ', err)

  		}, BP3L.appsecret, macId)

    })

	}

}

this.SLDTest = SLDTest