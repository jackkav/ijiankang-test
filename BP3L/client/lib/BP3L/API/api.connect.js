
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

        if( device.address && device.address.substr(-4) === lastId){

          this.stopDiscovery();

          let device = BP3L.parseJSON(res);

          resolve(device.address);
        }

      }, (err)=>{
        reject(err);
      }, BP3L.appsecret)
    })
  }

  connect() {
    let lastId = '8966'
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

        if(device && device.msg === 'connected') {

          let status = 'success';

          DB.APItest.insert({deviceInfo, apiType, status});
        }

      },(err)=>{

        console.log('Cordvoa Error: ', err)

      },BP3L.appsecret, macId)

    }, (err)=>{
      console.log("Make sure you discovery function is ok!", err)
    }, BP3L.appsecret)

  }
}


this.APIConnect = APIConnect
