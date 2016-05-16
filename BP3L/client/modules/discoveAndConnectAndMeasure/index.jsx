/**
 * Created on 5/16/16.
 */

BP3L.DiscoveAndConnectAndMeasurePage = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData(){

		if(!this.t1){
			this.t1 = new DiscoveAndConnectAndMeasureTest()
		}


		return {
			info:this.t1.reactiveInfo.get()
		}
	},

	componentWillMount(){



	},
	componentWillUnmount(){


	},



	getInitialState: function() {
		return {
			testID: 'TEST_ID_'+(+new Date),
			deviceID: ''
		};
	},

	start(){

		if(!this.state.deviceID) {
			alert('please select one device id')
			return;
		}
		if(!this.state.testID) {
			alert('please provide testID')
			return;
		}


		this.t1.emit('start',this.state.testID, this.state.deviceID )




	},

	stop(){

		this.t1.emit('stop',this.state.testID, this.state.deviceID )

	},

	startByDiscoveryOne(){
		this.t1.emit('startByDiscoveryOne')
	},

	goHome() {
		FlowRouter.go('/');
	},

	select(event){

		let id = event.target.value
		console.log(id)


		this.deviceID = id

		this.setState({deviceID:id})

		//BP3L.deviceID = event.target.value
	},

	testIDChange(event){
		let id = event.target.value
		console.log(id)


		this.testID = id

		this.setState({testID:id})

	},

	render() {
		return <div style={{padding:20}}>

			<title>DiscoveAndConnectAndMeasureTest</title>


			<RB.Button bsStyle="primary" onClick={this.goHome}>
				Home
			</RB.Button>

			<hr/>

			Select a device ID

			<select value={this.state.deviceID} onChange ={ this.select}>

				<option value=""></option>
				<option value="7CEC793A0306">7CEC793A0306</option>
				<option value="7CEC793A0306">7CEC793A0309</option>
			</select>


			<hr/>

			Input testID or using provided
			<input type="text" name="TEST_ID"
			       value={this.state.testID}
			       onChange ={ this.testIDChange}
			       size="50"/>


			<hr/>





				<RB.Button bsStyle="primary" onClick={this.start}>
					Start
				</RB.Button>

				<br/><br/>

				<RB.Button bsStyle="primary" onClick={this.stop}>
					Stop
				</RB.Button>

				<br/><br/>

				<RB.Button bsStyle="primary" onClick={this.startByDiscoveryOne}>
					startByDiscoveryOne
				</RB.Button>



			<hr/>
			info
			<div>
				testID:{this.state.testID}<br/>
				deviceID: {this.state.deviceID} <br/>

				{this.data.info}

			</div>



		</div>
	}
});
