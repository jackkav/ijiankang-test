/**
 * Created on 5/11/16.
 */



/*
  正常流程
  发现设备  连接设备  断开设备 监听断开回调 之后重头执行

  未考虑 连接超时 断开连接 重新连接
* */

class DiscoverAndConnectTest extends EventEmitter {
	constructor(props) {
		super(props)

		this.initEvent()
	}

	initEvent(){



		//this.on('continue',this._run)

		this.on('start',this.start)
		this.on('stop',this.stop)

	}

	detectDisconnect(mac, cb_success){
		let self = this

		console.log("add setDisconnectCallback ",mac)
		BpManagerCordova.setDisconnectCallback((res)=>{
			console.log(" in DisconnectCallback  success",res)


			//开始下一轮
			if(self.running){
				self.nextStartTimer = setTimeout(function(){

					//self.emit("continue")

					self._run()

				},2000)
			}else{
				//stop
				console.log('DiscoverAndConnectTest stopped')

			}

		}, (res)=> {

			//无错误回调  仅cordova才有回调
			console.log("in DisconnectCallback  error",res)

		}, BP3L.appsecret, mac);


	}

	disConnectDevice(mac){
		let  self = this

		//断开设备 重新开始  仅cordova才有回调

		BpManagerCordova.disConnectDevice((res)=>{
			console.log('disConnectDevice success',res)


		}, (res)=>{
			//断开连接失败 有回调?
			console.log('disConnectDevice error',res)

		}, BP3L.appsecret, mac);

	}

	//发现一个设备并连接
	_run (number){
		let self = this


		let data= {
			type:"DiscoverAndConnect",
			time1: +new Date()

		}

		BpManagerCordova.startDiscovery((res)=>{

			data.time2 = +new Date()

			let device = BP3L.parseJSON(res)

			if(device.msg == "Discovery"){
				console.log('startDiscovery success',res)

				if (device.address && device.name === "BP3L") {

					BpManagerCordova.stopDiscovery((res)=>{
						console.log('stopDiscovery success',res)

						console.log('start connectDevice',device.address)

						BpManagerCordova.connectDevice((res)=>{


							let data = BP3L.parseJSON(res)

							if(data.msg=="Connected"){
								console.log('connectDevice success',res)

								data.time3 = +new Date()
								data.result = "success"

								self.detectDisconnect(device.address)

								//
								setTimeout(()=>{

									self.disConnectDevice(device.address)

								},2000)
							}else if(data.msg=="ConnectionFail"){

								console.warn('connectDevice ConnectionFail',res)
							}





						},()=>{
							console.log('cordova connectDevice error',res)

							//连接失败的回调
							data.time3 = +new Date()
							data.result = "failue"

						},BP3L.appsecret, device.address)



					}, (res)=>{
						console.log('stopDiscovery error',res)

					}, BP3L.appsecret)

				}


			}else if(device.msg == "DiscoveryDone"){

					console.log("DiscoveryDone")

			}



		}, (res)=>{

			console.log('startDiscovery error',res)


		}, BP3L.appsecret)
	}

	start(){
		var self = this
		self.running = true

		console.log('DiscoverAndConnectTest start')

		self._run()
	}
	stop(){
		var self = this


		console.log('try stop DiscoverAndConnectTest')

		clearTimeout(self.nextStartTimer)

		self.running = false
	}

}



this.DiscoverAndConnectTest=DiscoverAndConnectTest

