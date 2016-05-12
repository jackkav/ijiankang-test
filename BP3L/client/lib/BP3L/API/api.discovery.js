
class APIDiscovery extends EventEmitter {
	constructor(props) {
		super(props)

	  this.initEvent()
	}

	initEvent(){

		this.on('start',this.discovery)
		this.on('stop',this.stop)

		// this.reactLog = new ReactiveVar({});
	}

	discovery(){

		let deviceInfo = h.getDeviceInfo();
		let apiType = 'start-discovery';

		BpManagerCordova.startDiscovery((res)=>{

			let device = BP3L.parseJSON(res);

      if(device && device.msg === 'Discovery') {

				this.stop();

				Meteor.clearTimeout(discoveryFailureTime);

        console.log("Insert DB startDiscovery Success");

				let status = 'success';
				let content = {deviceInfo, apiType, status}
				DB.APItest.insert(content);

      }else if(device && device.msg === 'DiscoveryDone'){

				let status = 'failure';
				DB.APItest.insert({deviceInfo, apiType, status});

			}

		}, (err)=>{
      console.log('Cordvoa Error: ', err);
		}, BP3L.appsecret)
	}


	stop(){

		let deviceInfo = h.getDeviceInfo();
		let apiType = 'stop-discovery';

		let stopDiscoveryFailureTime = Meteor.setTimeout(()=>{

			let status = 'failure';
			let content = {deviceInfo, apiType, status}
			DB.APItest.insert(content);

		}, 3000)

		BpManagerCordova.stopDiscovery((res)=>{

			let device = BP3L.parseJSON(res);

			Meteor.clearTimeout(stopDiscoveryFailureTime);

      if(device && device.msg === 'DiscoveryDone') {

				let status = 'success';
				let content = {deviceInfo, apiType, status}
				DB.APItest.insert(content);

        console.log('Insert DB stopDiscovery Success');

      }else if(device && device.msg === 'Error') {
				let status = 'failure';
				DB.APItest.insert({deviceInfo, apiType, status});
			}

		},(err)=>{
			console.log('Cordvoa Error: ', err);
		}, BP3L.appsecret)

	}

}


this.APIDiscovery = APIDiscovery
