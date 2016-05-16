/**
 * Created on 5/16/16.
 */


/**
 *

 0.启动程序 一个session
 1.发现设备
 2.连接设备   尝试2s 每次25s超时
 3.加压
 4.断开  (确保在连接成功8s以后)
 5.goto step2  一共20次
 6.关闭程序 回到step0  一共10次

 一个test 10个session  一个session 20次直连

 DiscoveAndConnectAndMeasureTest
 * */


let DEVICE_ID = ''
//let DEVICE_ID = '7CEC793A0306'


class DiscoveAndConnectAndMeasureTest extends EventEmitter {

	constructor(props) {
		super(props)


		this.reactiveInfo = new ReactiveVar()


		this.initEvent()
	}

	log(value){
		console.log(value)
		this.reactiveInfo.set(value)
	}

	initEvent() {
		let self =this
		//this.on('continue',this._run)


		this.on('startByDiscoveryOne', this.startByDiscoveryOne)
		this.on('start', this.start)
		this.on('stop', this.stop)

	}


	//发现一个设备 之后再进行直连
	startByDiscoveryOne() {
		let self = this

		self.log('start startByDiscoveryOne')
		BpManagerCordova.startDiscovery((res)=> {
			let device = BP3L.parseJSON(res)

			self.log("startByDiscoveryOne 1st callback ", res)

			if (DEVICE_ID) return;

			if (device.msg == "Discovery") {

				if (device.address && device.name === "BP3L") {

					self.log("Discovery device success ", device.address)
					DEVICE_ID = device.address

					BpManagerCordova.stopDiscovery((res)=> {

					})

					//开启直连
					self.start()

				}

			} else if (device.msg == "DiscoveryDone") {

				self.log("DiscoveryDone")
				if (!DEVICE_ID) {

					setTimeout(()=> {
						self.startByDiscoveryOne()
					}, 2000)
				}

			}

		}, (res)=> {
			self.log(res)
		}, BP3L.appsecret)

	}

	tryRestart(){
		let self= this;


		//限制运行次数
		//self._runtimes++
		if(self._runtimes>=20){
			self.running= false

			return;
		}

		//开始下一轮
		if (self.running) {
			self.nextStartTimer = setTimeout(function () {

				//self.emit("continue")

				self._run()

			}, 2000)
		} else {
			//stop
			self.log('DiscoverAndConnectTest stopped')

		}

	}

	detectDisconnect(mac, cb_success) {
		let self = this

		self.log("add setDisconnectCallback ", mac)
		BpManagerCordova.setDisconnectCallback((res)=> {
			self.log(" in DisconnectCallback  success", res)


			self.disconectTime = +new Date()

			self.saveData()

			self.tryRestart()

		}, (res)=> {

			//无错误回调  仅cordova才有回调
			self.log("in DisconnectCallback  error", res)

		}, BP3L.appsecret, mac);


	}

	//断开  开始下一轮
	disConnectDevice() {
		let self = this

		//断开设备 重新开始  仅cordova才有回调

		self.detectDisconnect(DEVICE_ID)



		//总时间应超过8s ios
		setTimeout(function () {

			BpManagerCordova.disConnectDevice((res)=> {
				self.log('disConnectDevice 1 callback', res)

			}, (res)=> {
				//断开连接失败 有回调?
				self.log('disConnectDevice error', res)

			}, BP3L.appsecret, DEVICE_ID);

		},2000)



	}

	saveData(){
		let self = this

		self._runtimes++
		self.data.runOrder = self._runtimes
		DB.DiscoveAndConnectAndMeasureTest.insert(self.data)
	}

	//尝试两次
	tryConnect(num) {
		let self = this

		let data ={}

		num = num || 1

		if(num>2){
			self.log('tryConnect failure '+num + ' times')
			self.saveData()

			self.tryRestart()

			return
		}

		self.connectTimer = setTimeout(function(){
			self.log('connectTimeout_'+num)
			//纪录连接超时
			self.data['connectTimeout_'+num] =+new Date()

			self.tryConnect(num+1)

		},25000)

		self.log("begin connectDevice directly "+num, DEVICE_ID)
		BpManagerCordova.connectDevice((res)=> {
			clearTimeout(self.connectTimer)

			self.log('in connectDevice first callback', res)
			let dataJSON = BP3L.parseJSON(res)


			data.connectInfo = dataJSON

			if (dataJSON.msg == "Connected") {
				self.log('connectDevice success', res)

				data.connectSuccessTime = +new Date()
				data.result = "Connected"
				data.resultInfo = res

				//DB.ConnectDirectly.insert(data)
				self.data.connectData[num] = data




				//连接成功  开始加压

				self.tryMeasure()


			} else if (dataJSON.msg == "ConnectionFail" || dataJSON.msg == "Error") {

				console.warn('connectDevice ConnectionFail '+num, res)


				data.connectionFailTime = +new Date()
				data.result = "ConnectionFail"
				data.resultInfo = res

				//DB.ConnectDirectly.insert(data)

				self.data.connectData[num] = data


				//连接失败尝试重连


				setTimeout(function(){
					self.tryConnect(num+1)

				},2000)



			}


		}, (res)=> {
			self.log('cordova connectDevice error '+num, res)

			//连接失败的回调
			data.connectionErrorTime = +new Date()
			data.result = "error"
			data.resultInfo = res

			//DB.ConnectDirectly.insert(data)
			self.data.connectData[num] = data


			setTimeout(function(){
				self.tryConnect(num+1)

			},2000)


		}, BP3L.appsecret, DEVICE_ID)

	}


	tryMeasure() {
		let self = this

		BpManagerCordova.startMeasure(function (res) {
			var json = BP3L.parseJSON(res);

			if ((json.msg == 'ZeroDoing' || json.msg == 'ZeroDone')) {

			} else if (json && json.msg == 'MeasureDone') {


			} else if (json && json.msg == 'MeasureDoing') {


			} else if (json && json.msg == 'Error') {
				self.log('ErrorID',json.errorid)

				self.data.MeasureMsgError = json

				self.disConnectDevice()
			}


		},function (res) {
			self.log('start measure fail' + res)

			self.data.MeasureStartError = res

			self.disConnectDevice()

		},BP3L.appsecret, DEVICE_ID)


	}

	//发现一个设备并连接
	_run() {
		let self = this
		self.data = {
			testID:self.testID,
			deviceID:self.deviceID,
			sessionID:"sessionId_"+ (+new Date()),

			type: "DiscoveAndConnectAndMeasureTest",
			startConnectTime: +new Date(),
			deviceInfo: {...window.device},
			connectData:{}    //连接信息
		}

		self.log('DiscoveAndConnectAndMeasureTest run '+self._runtimes)


		self.tryConnect()

	}



	start(testID, deviceID) {
		var self = this
		self.running = true
		self._runtimes = 1

		this.log('DiscoveAndConnectAndMeasureTest start ', testID,deviceID)


		self.testID = testID
		self.deviceID = deviceID
		DEVICE_ID = deviceID


		self._run()
	}

	stop() {
		var self = this


		this.log('try stop DiscoveAndConnectAndMeasureTest')


		clearTimeout(self.nextStartTimer)


		self.testID = ''
		self.deviceID = ''
		DEVICE_ID = ''

		self.running = false
	}

}


this.DiscoveAndConnectAndMeasureTest = DiscoveAndConnectAndMeasureTest
