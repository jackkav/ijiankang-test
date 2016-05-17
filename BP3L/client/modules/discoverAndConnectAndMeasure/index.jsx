/**
 * Created on 5/16/16.
 */

BP3L.DiscoverAndConnectAndMeasurePage = React.createClass({
	mixins: [ReactMeteorData],

	getMeteorData(){

		if(!this.t1){
			this.t1 = new DiscoverAndConnectAndMeasureTest()
		}

		const idInfoSub = Meteor.subscribe('bp3l.IDInfo');

		return {
			idInfos: idInfoSub.ready() ? DB.IDInfo.find({testType:'DiscoverAndConnectAndMeasureTest'}).fetch() : [],  //test id
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
			testId:'',
			sessionId: 'sessionId_'+(+new Date),
			deviceId: ''
		};
	},

	start(){

		if(!this.state.testId) {
			alert('please select a testID')
			return;
		}
		if(!this.state.deviceId) {
			alert('please select one device id')
			return;
		}

		Meteor.call('idInfo.update', this.state.testId, this.state.sessionId);


		this.t1.emit('start',this.state.testId,this.state.sessionId, this.state.deviceId )

	},

	newTestId(){

		let deviceInfo = h.getDeviceInfo();
		Meteor.call('idInfo.createTestId',
			'connectDirectly'+(+new Date()),
			'DiscoverAndConnectAndMeasureTest',
			deviceInfo);

	},

	stop(){

		this.t1.emit('stop',this.state.testId, this.state.deviceId )

	},

	startByDiscoveryOne(){
		this.t1.emit('startByDiscoveryOne')
	},

	goHome() {
		FlowRouter.go('/');
	},





	selectTestId(event){

		let id = event.target.value
		this.setState({testId:id})
	},


	selectDevice(event){

		let id = event.target.value
		console.log(id)


		this.deviceId = id

		this.setState({deviceId:id})

		//BP3L.deviceID = event.target.value
	},

	sessionIdChange(event){
		let id = event.target.value
		console.log(id)


		this.sessionId = id

		this.setState({sessionId:id})

	},

	render() {
		return <div style={{padding:20}}>

			<title>DiscoverAndConnectAndMeasureTest</title>


			<div style={{margin:20,textAlign:'center'}} onClick={()=>{
        FlowRouter.go('/');
      }}>返回</div>

			<hr/>

			<div  style={{margin: '20px'}}>
				<div>选择/创建一个TestId</div>

				<div style={{display:'flex',alignItems:'center'}}>
					<select style={{padding: '5px'}} onChange={this.selectTestId} value={this.state.testId} >
						<option value=''></option>
						{this.data.idInfos.map((item, key)=>{
							let manufacturerVersion = item.deviceInfo ? `${item.deviceInfo.manufacturer} ${item.deviceInfo.version}` : '';

							return <option key={key} value={item.testId}>
								 {manufacturerVersion} {item.testId.substr(-4)} run了{item.sessionIds && item.sessionIds.length}次
							</option>;
						})}
					</select>

					<RB.Button bsStyle="primary"  onClick={this.newTestId}>
						create
					</RB.Button>
				</div>


			</div>

			<hr/>

			<div style={{margin: '20px'}} >

				<div>Select a device ID</div>

				<select value={this.state.deviceId} onChange ={ this.selectDevice}>

					<option value=""></option>
					<option value="7CEC793A0306">7CEC793A0306-0306</option>
					<option value="7CEC79E05EFA">7CEC79E05EFA-5EFA</option>
					<option value="7CEC7939E9B9">7CEC7939E9B9-E9B9</option>
					<option value="7CEC794184DB">7CEC794184DB-84DB</option>
					<option value="D05FB8418966">D05FB8418966-8966</option>
					<option value="7CEC79E06244">7CEC79E06244-6244</option>




				</select>
			</div>


			{
				//<hr/>
				//<div style={{margin: '20px'}} >
				//<div>sessionId</div>
				//<input type="text" readOnly
				//value={this.state.sessionId}
				//size="50"/>
				//</div>
			}


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
				testID:{this.state.testId}<br/>
				sessionId:{this.state.sessionId}<br/>
				deviceID: {this.state.deviceId} <br/>

				{this.data.info}

			</div>



		</div>
	}
});
