/**
 * Created on 5/16/16.
 */

BP3L.DiscoverAndConnectAndMeasurePage = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData(){

		if(!this.t1){
			this.t1 = new DiscoverAndConnectAndMeasureTest()
		}


		return {
			info:this.t1.reactiveInfo.get(),
			reactiveData:this.t1.reactiveData.get()
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

			<title>DiscoverAndConnectAndMeasureTest</title>


			<RB.Button bsStyle="primary" block onClick={this.goHome}>
				Home
			</RB.Button>

			<hr/>

			Select a device ID

			<select value={this.state.deviceID} onChange ={ this.select}>

				<option value=""></option>
				<option value="7CEC793A0306">7CEC793A0306-0306</option>
				<option value="7CEC79E05EFA">7CEC79E05EFA-5EFA</option>
				<option value="7CEC7939E9B9">7CEC7939E9B9-E9B9</option>
				<option value="7CEC794184DB">7CEC794184DB-84DB</option>
				<option value="D05FB8418966">D05FB8418966-8966</option>


			</select>


			<hr/>

			Input testID or using provided
			<input type="text"
			       value={this.state.testID}
			       onChange ={ this.testIDChange}
			       size="50"/>


			<hr/>





				<RB.Button bsStyle="primary" block onClick={this.start} >
					Start
				</RB.Button>

				<br/><br/>

			{
				//<RB.Button bsStyle="primary" block onClick={this.stop} >
				//	Stop
				//</RB.Button>

			}


				<br/><br/>

			{
				//<RB.Button bsStyle="primary" block onClick={this.startByDiscoveryOne}>
				//	startByDiscoveryOne
				//</RB.Button>
			}




			<hr/>

			运行:   {this.data.reactiveData.runOrder}
			已成功: {this.data.reactiveData.runSuccess}
			已失败: {this.data.reactiveData.runFailure}
			<div>
				testID:{this.state.testID}<br/>
				deviceID: {this.state.deviceID} <br/>

				{this.data.info}

			</div>



		</div>
	}
});
