/**
 * Created on 5/11/16.
 */


//1000次 按时间 不限制

class DiscoveryTest {

	onSuccess(res, t1, t2) {
		let self = this
		console.log(res, t2 - t1)


		//insert DB
		//无超时会中断
		//貌似无需stop可以在发现

		setTimeout(()=> {
			self.start()
		}, 100)


	}

	onFailure(res, t1, t2) {
		let self = this

		console.log(res, t2 - t1)

		setTimeout(()=> {
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

		BpManagerCordova.stopDiscovery(()=> {

			console.log('stopDiscovery success')
		}, ()=> {

			console.log('stopDiscovery failure')

		}, BP3L.appsecret)

	}

}


this.DiscoveryTest = DiscoveryTest