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

 DiscoverAndConnectAndMeasureTest
 * */


let DEVICE_ID = ''
//let DEVICE_ID = '7CEC793A0306'

let DISCOVERY_TIME = 2


class DiscoverAndConnectAndMeasureTest extends EventEmitter {

	constructor(props) {
		super(props)


		this.reactiveInfo = new ReactiveVar()

		this.reactiveData = new ReactiveVar({
			runOrder:0,
			runAll:0,
			runSuccess:0,
			runFailure:0

		})


		this.initEvent()
	}

	updateReactiveData(obj){
		let data ={}
		Object.assign(data,this.reactiveData.get(),obj)

		this.reactiveData.set(data)

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





	detectDisconnect(mac) {
		let self = this

		self.log("add setDisconnectCallback "+ mac)
		BpManagerCordova.setDisconnectCallback((res)=> {
			self.log(" in setDisconnectCallback 1st callback "+ res)
			var json = BP3L.parseJSON(res);

			let disconnectData = {}
			disconnectData.info = json

			self._runAllCount++

			if(json.msg == 'Disconnect' && json.address== mac){

				 self.data.timeData['disconnectSuccessTime'] = disconnectData.time=  +new Date()
				 self.data.timeData['runEndTime'] =self.data.timeData['disconnectSuccessTime']

				//整体结果
				self.data.runResult={type:"success"}

				//成功次数++
				self.updateReactiveData({runSuccess: self.reactiveData.get().runSuccess+1})


			}else{

				//never happen?
				self.data.timeData['disconnectFailureTime'] = disconnectData.time=  +new Date()
				self.data.timeData['runEndTime'] = self.data.timeData['disconnectFailureTime']

				self.data.runResult={type:"disconenctFailure"}

				self.updateReactiveData({runFailure: self.reactiveData.get().runFailure+1})


			}



			self.saveData()

			self.tryRestart()


		}, (res)=> {

			//无错误回调  仅cordova才有回调
			self.log("in setDisconnectCallback 2st callback  error "+ res)

		}, BP3L.appsecret, mac);


	}

	//断开  开始下一轮
	disConnectDevice() {
		let self = this

		//断开设备 重新开始  仅cordova才有回调

		self.detectDisconnect(DEVICE_ID)

		//总时间应超过8s ios
		setTimeout(function () {

			self.data.timeData['disconnectStartTime'] = +new Date()

			BpManagerCordova.disConnectDevice((res)=> {
				self.log('disConnectDevice 1 callback '+ res)

			}, (res)=> {
				//断开连接失败 有回调?
				self.log('disConnectDevice 2 callback error'+ res)

			}, BP3L.appsecret, DEVICE_ID);

		},2000)



	}

	saveData(){
		let self = this

		self._runtimes++
		self.data.runOrder = self._runtimes
		DB.DiscoverAndConnectAndMeasureTest.insert(self.data)
	}

	//尝试两次
	tryConnect(num) {
		let self = this

		let data ={}

		num = num || 1

		if(num>2){

			self.data.result={type:'connectFailure'}
			self.saveData()

			//失败1次
			self.updateReactiveData({runFailure: self.reactiveData.get().runFailure+1})

			self.tryRestart()

			return
		}

		self.connectTimer = setTimeout(function(){
			//异常情况

			//纪录连接超时
			self.log('connectTimeout_'+num)

			self.data.timeData['connectTimeout_'+num] = data['connectTimeout_'+num] = +new Date()

			data.connectFallBackToSetTimeout= 25000

			self.data.connectData[num] = data

			self.tryConnect(num+1)

		},25000)

		self.log("begin connectDevice directly "+num +'  ' +DEVICE_ID)


		self.data.timeData['connectStartTime_'+num] = data['connectStartTime'] =+new Date()


		BpManagerCordova.connectDevice((res)=> {
			clearTimeout(self.connectTimer)

			self.log('in connectDevice first callback '+ res)
			let dataJSON = BP3L.parseJSON(res)


			data.connectInfo = dataJSON

			if (dataJSON.msg == "Connected") {
				self.log('connectDevice success '+ res)

				self.data.timeData['connectSuccessTime_'+num] = data.connectSuccessTime = +new Date()

				data.result = "Connected"
				data.resultInfo = res

				//DB.ConnectDirectly.insert(data)
				self.data.connectData[num] = data


				//连接成功  开始加压

				self.tryMeasure()


			} else if (dataJSON.msg == "ConnectionFail" || dataJSON.msg == "Error") {

				console.warn('connectDevice ConnectionFail '+num, res)

				self.data.timeData['connectFailTime_'+num] = data.connectFailTime = +new Date()
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
			self.log('cordova connectDevice error '+num + ' ' + res)

			//连接失败的回调
			self.data.timeData['connectErrorTime_'+num] = data.connectErrorTime = +new Date()
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
		let data ={}
		self.data.measure = data

		self.data.timeData['measureStartTime'] = data.startTime = + new Date()
		BpManagerCordova.startMeasure(function (res) {
			var json = BP3L.parseJSON(res);

			if (json.msg == 'ZeroDoing') {

			}else if(json.msg == 'ZeroDone'){
				self.data.timeData['measureZeroDoneTime']= + new Date()


			} else if (json && json.msg == 'MeasureDone') {
				self.log('MeasureDone '+res)

				self.data.timeData['measureDoneTime']= data.endTime = + new Date()

				data.endType = 'Success'
				data.endInfo = json
				self.disConnectDevice()

			} else if (json && json.msg == 'MeasureDoing') {
					self.log('MeasureDoing '+res)

			} else if (json && json.msg == 'Error') {
				self.log('ErrorID '+json.errorid)


				self.data.timeData['measureErrorTime'] = data.endTime = + new Date()
				data.endType = 'Error'
				data.endInfo = json

				self.disConnectDevice()
			}


		},function (res) {
			self.log('start measure fail ' + res)

			data.endTime = + new Date()
			data.endType = 'StartFailure'
			data.endInfo = res

			self.disConnectDevice()

		},BP3L.appsecret, DEVICE_ID)


	}

	//发现一个设备并连接
	_run() {
		let self = this
		self.data = {
			testId:self.testID,
			macId:self.deviceID,
			//sessionId:"sessionId_"+ (+new Date()),
			sessionId:self.sessionID,

			type: "DiscoverAndConnectAndMeasureTest",
			//runStartTime: +new Date(),
			deviceInfo: {...window.device},
			connectData:{},    //连接信息
			//纪录所有时间
			timeData:{
				runsSartTime: +new Date(),
			}
		}



		self.log('[[[==='+self._runtimes+'===]]] Run DiscoverAndConnectAndMeasureTest')

		self.reactiveData.set(
			_.extend(self.reactiveData.get(),{runOrder:self._runtimes})
		)

		self.tryConnect()

	}
	addTime(key, value){
		self.timeData[key] = value
	}


	//发现一个设备 之后再进行直连
	startByDiscoveryOne(deviceID) {
		let self = this

		self.log('start startByDiscoveryOne '+ deviceID)
		BpManagerCordova.startDiscovery((res)=> {
			let device = BP3L.parseJSON(res)

			self.log("startByDiscoveryOne 1st callback "+ res)

			if (device.msg == "Discovery") {

				if (device.address==deviceID && device.name === "BP3L" ) {

					self.DiscoverySuccess = true

					self.log("Discovery device success "+ device.address)

					BpManagerCordova.stopDiscovery((res)=> {

					})

					//开启直连
					self._run()

				}

			} else if (device.msg == "DiscoveryDone") {

				self.log("DiscoveryDone")


				if (!self.DiscoverySuccess) {

					if(self.discoveryTime > DISCOVERY_TIME){
						setTimeout(()=> {
							self.startByDiscoveryOne(deviceID)
						}, 2000)
						self.discoveryTime++

					}else{
						alert('Discovery Device failue '+ deviceID)

					}


				}

			}

		}, (res)=> {
			self.log(res)
		}, BP3L.appsecret)

	}



	start(testID, sessionID, deviceID) {
		var self = this
		self.running = true
		self._runtimes = 1
		self._runAllCount=0
		self._runSuccessCount=0

		this.log('DiscoverAndConnectAndMeasureTest start '+ testID,deviceID)


		self.testID = testID
		self.sessionID = sessionID
		self.deviceID = deviceID
		DEVICE_ID = deviceID


		self.DiscoverySuccess = false
		self.discoveryTime = 1


		//self._run()
		self.startByDiscoveryOne(deviceID)
	}

	stop() {
		var self = this


		this.log('try stop DiscoverAndConnectAndMeasureTest')


		clearTimeout(self.nextStartTimer)


		self.testID = ''
		self.sessionID=''
		self.deviceID = ''
		DEVICE_ID = ''

		self.running = false
	}

	tryRestart(){
		let self= this;


		//限制运行次数
		//self._runtimes++
		if(self._runtimes > 20){
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
}


this.DiscoverAndConnectAndMeasureTest = DiscoverAndConnectAndMeasureTest

