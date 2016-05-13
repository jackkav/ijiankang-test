/**
 * Created on 5/11/16.
 */


//1000次 按时间 不限制

class DiscoveryTest {

	//发现直到Discovery自动停止  再继续发现
	onSuccess(res, t1, t2) {
		let self = this

		let data = BP3L.parseJSON(res)

		console.log(res, t2 - t1)


		if(data.msg == "Discovery"){

			//setTimeout(()=> {
			//	self.start()
			//}, 100)

		}else if(data.msg == "DiscoveryDone"){

			//console.log(data)

			setTimeout(()=> {
				self.start()
			}, 100)
		}

		//insert DB
		//貌似无需stop可以在发现


	}

	//发现一个立即停止 再继续发现
	onSuccess2(){

		let self = this

		BpManagerCordova.stopDiscovery((res)=> {
			console.log('stopDiscovery success',res)

			let data = BP3L.parseJSON(res)
			if(data.msg == "DiscoveryDone"){
				setTimeout(()=> {
					self.start()
				}, 100)

			}

		}, (res)=> {

			console.log('stopDiscovery failure',res)

		}, BP3L.appsecret)

	}

	//cordova 抛异常时才触发
	onFailure(res, t1, t2) {
		let self = this

		console.log(res, t2 - t1)

		self.timer = setTimeout(()=> {
			self.start()
		}, 100)
	}



	start(number) {
		let self = this

		let t1, t2

		t1 = +new Date()

		console.log('startDiscovery')
		BpManagerCordova.startDiscovery((res)=> {
			t2 = +new Date()

			self.onSuccess(res, t1, t2)

		}, (res)=> {

			self.onFailure(res, t1, t2)

		}, BP3L.appsecret)
	}

	stop() {
		let self =this
		clearTimeout(self.timer)

		BpManagerCordova.stopDiscovery((res)=> {

			console.log('stopDiscovery success',res)
		}, (res)=> {

			console.log('stopDiscovery failure',res)

		}, BP3L.appsecret)

	}

}


this.DiscoveryTest = DiscoveryTest