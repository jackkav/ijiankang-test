/**
 * Created on 5/11/16.
 */





//1000次 按时间 不限制

class DiscoveryTest extends EventEmitter {
	constructor(props) {
		super(props)

	  this.initEvent()
	}

	initEvent(){

		this.on('bp-discover-success',this.onSuccess)
		this.on('bp-discover-failure',this.onFailure)


		this.on('start',this.discovery)
		this.on('stop',this.stop)

	}

	onSuccess(res,t1 , t2){
		let self =this
		console.log(res, t2 - t1)
		//insert DB


		//无超时会中断
		//貌似无需stop可以在发现

		window.setTimeout(function(){
			self.emit('start')
		},100)


	}
	onFailure(res,t1 , t2){

		console.log(res, t2 - t1)

		this.emit('start')

	}




	discovery(number){
		let self = this

		let t1,t2

		t1 = +new Date()

		BpManagerCordova.startDiscovery((res)=>{
			t2 = +new Date()

			self.emit('bp-discover-success',res,t1 , t2);

		}, (res)=>{

			self.emit('bp-discover-failure',res,t1 , t2);

		}, BP3L.appsecret)
	}


	stop(){

		BpManagerCordova.stopDiscovery(()=>{

			console.log('stopDiscovery success')
		},()=>{

			console.log('stopDiscovery failure')

		}, BP3L.appsecret)

	}

}


this.DiscoveryTest = DiscoveryTest