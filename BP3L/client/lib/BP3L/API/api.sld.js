
TIMEOUT_COUNT = 2;

let MACID_LIST= [
  '7CEC79E05EFA',
  'D05FB8418966',
  '7CEC794184DB',
  '7CEC793A0306',
  '7CEC7939E9B9',
  'A4D578405B5A',
  'A4D578416D45',
  'A4D5783F5A67',
  'A4D578408246'
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

    let count = 0;

    return new Promise((resolve, reject)=>{

      let startDiscovery = ()=>{

        count++;
        self.data[`discoveryStartTime_${count}`] = +new Date()

        BpManagerCordova.startDiscovery((res)=>{

          let device = BP3L.parseJSON(res);
          console.log('Searching', res);
          self.pushInfoToReact(`Searching${res}`)

          let flagRandom = device && device.address && (MACID_LIST.indexOf(device.address) !== -1) && !deviceId;
          let flagSpecial = device && device.address && device.address === deviceId;

          if( flagRandom || flagSpecial ){

            self.data[`discoverSuccessTime_${count}`] = +new Date();
            // self.data['discoverySuccessCount'] = this.count;

            this.stopDiscovery();
            this.stopDiscoverySuccess = true;


            // let status = 'success';
            // let device = BP3L.parseJSON(res);
            // let data = self.data;
            // let macId = device.address;
            // let count = this.count;

            self.count = 0;
            // DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, count, sessionId, testId});

            resolve(device.address);
            self.pushInfoToReact(`Discovery success ${device.address}`)
            console.log('Discovery success', device.address);

          }else if(device && device.msg === 'DiscoveryDone' && !this.stopDiscoverySuccess){

            self.data[`discoveryFailureTime_${count}`] = +new Date();
            // self.data['discoveryFailureCount'] = this.count;

            self.pushInfoToReact(`Discovery timeout ${count} 次, ErrorId: ${device.errorid}`)
            console.log(`Discovery timeout ${count} 次, ErrorId: ${device.errorid}`);

            if(this.count < TIMEOUT_COUNT) {
              startDiscovery();
              return;
            }

            let status = 'failure';
            let timeData = self.data;
            let errorId = device.errorid;

            let content = {deviceInfo, apiType, status, timeData, sessionId, testId, errorId}

            DB.SLDtest.insert(content);

            count = 0;

            reject(`Discovery timeout`)

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
    let count = 0;
		return new Promise((resolve, reject)=>{

      let deviceInfo = h.getDeviceInfo();
  		let apiType = 'connect';

			console.log(`Start connect ${macId}`);
      self.pushInfoToReact(`Start connect ${macId}`);

      let connectDevice = ()=>{
        count++;
        self.data[`connectStartTime_${count}`] = +new Date()
        BpManagerCordova.connectDevice((res)=>{

          let device = BP3L.parseJSON(res);

          if(device && device.msg === 'Connected') {

            self.data[`connectSuccessTime_${count}`] = +new Date()

            // let status = 'success';
  					// let data = self.data;
            console.log(`Connect success ${count} ${macId}`);
            self.pushInfoToReact(`Connect success ${count} ${macId}`);

            count = 0;

            // DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, count, sessionId, testId});


  					resolve(macId);

          }else if(device && device.msg === 'ConnectionFail') {

            self.data[`connectFailureTime_${count}`] = +new Date();

            console.log(`Connect failure ${count} ${macId}`);
            self.pushInfoToReact(`Connect failure ${count} ${macId}, ErrorId: ${device.errorid}`);

            if(count < TIMEOUT_COUNT) {
              connectDevice();
              return;
            }

  					let status = 'failure';
  					let timeData = self.data;
            let errorId = device.errorid

            count = 0;

  	        DB.SLDtest.insert({deviceInfo, apiType, status, timeData, macId, testId, sessionId, errorId});

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

      self.data['disconnectStartTime'] = +new Date();

			self.getConnectDevicePromise(macId).then((res)=>{

				let deviceInfo = h.getDeviceInfo();
	  		let apiType = 'dis-connect';


				BpManagerCordova.setDisconnectCallback((res)=>{

					let device = BP3L.parseJSON(res);

					if(device && device.address === macId) {

            self.data['disconnectSuccessTime'] = +new Date();

						let status = 'success';
            let timeData =self.data;
						// DB.SLDtest.insert({deviceInfo, apiType, status});
						DB.SLDtest.insert({deviceInfo, apiType, status, timeData, macId, sessionId, testId});

						console.log('Disconnect success!')

						resolve('Disconnect success!');

					}else {

            self.data['disconenctFailureTime'] = +new Date();
						let status = 'failure';

            let timeData = self.data;
            let errorId = device.errorid;

						DB.SLDtest.insert({deviceInfo, apiType, status, timeData, macId, sessionId, testId, errorId});

						console.log('Disconnect failure!')

            self.pushInfoToReact(`Disconnect failure! ErrorId: ${errorId}`);

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
      self.data['measureStartTime'] = +new Date();
      BpManagerCordova.startMeasure(function (res) {
  			var json = BP3L.parseJSON(res);

  			if ((json.msg == 'ZeroDoing' || json.msg == 'ZeroDone')) {

  			} else if (json && json.msg == 'MeasureDone') {


  			} else if (json && json.msg == 'MeasureDoing') {

  			} else if (json && json.msg == 'Error') {

          console.log('袖带太松 ');
          self.data['measureDoneTime'] = +new Date();
  				self.pushInfoToReact('袖带太松 ');

          let status = 'success';

          // DB.SLDtest.insert({deviceInfo, apiType, status, data, macId, sessionId, testId});

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
