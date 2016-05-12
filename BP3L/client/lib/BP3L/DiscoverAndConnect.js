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

	//发现一个设备并连接
	_run (number){
		let self = this


		let data= {
			type:"DiscoverAndConnect",
			time1: +new Date()

		}

		BpManagerCordova.startDiscovery((res)=>{
			console.log('startDiscovery success',res)

			data.time2 = +new Date()

			let device = BP3L.parseJSON(res)
			if (device.address && device.name && device.name === "BP3L") {

				//模拟真实环境  不等回调结束
				BpManagerCordova.stopDiscovery((res)=>{
					console.log('stopDiscovery success',res)
				}, (res)=>{
					console.log('stopDiscovery error',res)

				}, BP3L.appsecret)


				BpManagerCordova.connectDevice(()=>{

					console.log('connectDevice success',res)

					data.time3 = +new Date()
					data.result = "success"

					//断开设备 重新开始
					BpManagerCordova.disConnectDevice((res)=>{
						console.log('disConnectDevice success',res)


						//开始下一轮
						if(self.running){
							self.nextStartTimer = setTimeout(function(){

								//self.emit("continue")

								self._run()

							},100)
						}else{
							//stop
							console.log('DiscoverAndConnectTest stopped')

						}



					}, (res)=>{
						//断开连接失败 有回调?
						console.log('disConnectDevice error',res)


					}, BP3L.appsecret, device.address);


				},()=>{
					console.log('connectDevice error',res)

					//连接失败的回调
					data.time3 = +new Date()
					data.result = "failue"

				},BP3L.appsecret, device.address)

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

		self.running = false
		clearTimeout(self.nextStartTimer)
	}

}



this.DiscoverAndConnectTest=DiscoverAndConnectTest

