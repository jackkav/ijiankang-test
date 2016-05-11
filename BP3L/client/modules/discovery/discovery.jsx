/**
 * Created  on 5/11/16.
 */

BP3L.Discovery = React.createClass({

	discovery(){

		BpManagerCordova.startDiscovery((res)=>{
			console.log('startDiscovery Success', res)
		}, (res)=>{
			console.log('startDiscovery Fail', res)
		}, BP3L.appsecret)


	},
	render() {
		return <div>


			<RB.Button bsStyle="primary" onClick={this.discovery}>
				Discovery
			</RB.Button>

		</div>
	}
});