/**
 * Created on 5/11/16.
 */



/*
 正常流程
 发现设备  连接设备  断开设备 监听断开回调 之后重头执行

 未考虑 连接超时 断开连接 重新连接
 * */

let DEVICE_ID = '' //7CEC793A0306


class ConnectDirectly extends EventEmitter {

	constructor(props) {
		super(props)

		this.initEvent()
	}

	initEvent() {

		//this.on('continue',this._run)


		this.on('startByDiscoveryOne', this.startByDiscoveryOne)
		this.on('start', this.start)
		this.on('stop', this.stop)

	}



	//发现一个设备 之后再进行直连
	startByDiscoveryOne(){
		let self = this

		console.log('start startByDiscoveryOne')
		BpManagerCordova.startDiscovery((res)=>{
			let device = BP3L.parseJSON(res)

			if (DEVICE_ID) return;

			if(device.msg == "Discovery"){

				if (device.address && device.name === "BP3L") {

					console.log("Discovery device success ", device.address)
					DEVICE_ID = device.address

					BpManagerCordova.stopDiscovery((res)=>{

					})

					//开启直连
					self.start()

				}

			}else if(device.msg == "DiscoveryDone"){

				console.log("DiscoveryDone")
				if(!DEVICE_ID){

						setTimeout(()=>{
							self.discoveryOne()
						},2000)
				}

			}

		},(res)=>{
			console.log(res)
		},BP3L.appsecret)

	}

	detectDisconnect(mac, cb_success) {
		let self = this

		console.log("add setDisconnectCallback ", mac)
		BpManagerCordova.setDisconnectCallback((res)=> {
			console.log(" in DisconnectCallback  success", res)


			//开始下一轮
			if (self.running) {
				self.nextStartTimer = setTimeout(function () {

					//self.emit("continue")

					self._run()

				}, 2000)
			} else {
				//stop
				console.log('DiscoverAndConnectTest stopped')

			}

		}, (res)=> {

			//无错误回调  仅cordova才有回调
			console.log("in DisconnectCallback  error", res)

		}, BP3L.appsecret, mac);


	}

	disConnectDevice(mac) {
		let self = this

		//断开设备 重新开始  仅cordova才有回调

		BpManagerCordova.disConnectDevice((res)=> {
			console.log('disConnectDevice success', res)


		}, (res)=> {
			//断开连接失败 有回调?
			console.log('disConnectDevice error', res)

		}, BP3L.appsecret, mac);

	}

	//发现一个设备并连接
	_run(number) {
		let self = this


		let data = {
			type: "ConnectDirectly",
			startConnectTime: +new Date(),
			deviceInfo: {...window.device}
		}

		console.log("begin connectDevice directly ", DEVICE_ID)
		BpManagerCordova.connectDevice((res)=> {

			console.log('in connectDevice first callback',res)
			let dataJSON = BP3L.parseJSON(res)


			data.connectInfo = dataJSON

			if (dataJSON.msg == "Connected") {
				console.log('connectDevice success', res)

				data.connectSuccessTime = +new Date()
				data.result = "Connected"


				DB.ConnectDirectly.insert(data)


				self.detectDisconnect(DEVICE_ID)

				//
				setTimeout(()=> {

					self.disConnectDevice(DEVICE_ID)

				}, 2000)
			} else if (dataJSON.msg == "ConnectionFail") {

				console.warn('connectDevice ConnectionFail', res)



				data.connectionFailTime = +new Date()
				data.result = "ConnectionFail"

				DB.ConnectDirectly.insert(data)

				//开始下一轮
				if (self.running) {
					self.nextStartTimer = setTimeout(function () {

						//self.emit("continue")



						self._run()

					}, 2000)
				} else {
					//stop
					console.log('DiscoverAndConnectTest stopped')

				}

			}


		}, (res)=> {
			console.log('cordova connectDevice error', res)

			//连接失败的回调
			data.connectionErrorTime = +new Date()
			data.result = "error"

			DB.ConnectDirectly.insert(data)


		}, BP3L.appsecret, DEVICE_ID)


	}

	start() {
		var self = this
		self.running = true

		console.log('ConnectDirectly start')

		self._run()
	}

	stop() {
		var self = this


		console.log('try stop ConnectDirectly')

		clearTimeout(self.nextStartTimer)

		self.running = false
	}

}


this.ConnectDirectly = ConnectDirectly

