/**
 * Created  on 5/11/16.
 */

BP3L.Discovery = React.createClass({


	componentWillMount(){
		this.t1 = new DiscoveryTest()


	},
	componentWillUnmount(){


	},

	discovery(){

		//BpManagerCordova.startDiscovery((res)=>{
		//	console.log('startDiscovery Success', res)
		//}, (res)=>{
		//	console.log('startDiscovery Fail', res)
		//}, BP3L.appsecret)


		this.t1.emit('start')

	},

	stop(){

		this.t1.emit('stop')

	},

	render() {
		return <div>


			<RB.Button bsStyle="primary" onClick={this.discovery}>
				Discovery
			</RB.Button>
			<RB.Button bsStyle="primary" onClick={this.stop}>
				Stop
			</RB.Button>

		</div>
	}
});