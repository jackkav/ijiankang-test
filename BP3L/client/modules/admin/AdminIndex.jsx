/**
 * Created  on 5/11/16.
 */



App.AdminIndex = React.createClass({


	componentWillMount(){
		this.t1 = new DiscoveryTest()

		this.DiscoverAndConnectTestIns = new DiscoverAndConnectTest()


		this.ConnectDirectly = new ConnectDirectly()

		BP3L.initAppsecret()
		console.log('BP3L.appsecret',BP3L.appsecret)



	},
	componentWillUnmount(){


	},

	discovery(){

		this.t1.emit('start')

	},

	stop(){

		this.t1.emit('stop')

	},

	apitest() {
		FlowRouter.go('/apitest');
	},

	say(){

		let  str = "hello 你好"

		var success = function(message){
			console.log(message);
		}

		var failure = function(message){
			console.log(message);
		}

		SSManagerCordova.startSpeaker(success, failure, str );

	},

	render() {

		const navbarInstance = (
			<RB.Navbar >
				<RB.Navbar.Header>
					<RB.Navbar.Brand>
						BP3L TEST
					</RB.Navbar.Brand>
					<RB.Navbar.Toggle />
				</RB.Navbar.Header>


				<RB.Navbar.Collapse>
					<RB.Nav>
						{
							//<RB.NavItem eventKey={1} href="#">Link</RB.NavItem>
							//<RB.NavItem eventKey={2} href="#">Link</RB.NavItem>
						}


					</RB.Nav>
					<RB.Nav pullRight>
						{
							//<RB.NavItem eventKey={1} href="#">Link Right</RB.NavItem>
						}

						<RB.NavItem eventKey={2} href="/statistic">statistic</RB.NavItem>
						<RB.NavItem eventKey={3} href="/analysis">analysis</RB.NavItem>
					</RB.Nav>
				</RB.Navbar.Collapse>
			</RB.Navbar>
		);

		return <div style={{padding:20}}>

			{
				navbarInstance
			}


			{

				//<BP3L.Discovery />
				//
				//
				//<br/>


				//<RB.ButtonToolbar>
				//	<RB.Button bsStyle="primary" onClick={()=>{
				//			this.DiscoverAndConnectTestIns.emit('start')
				//		}}>
				//		Start DiscoverAndConnect
				//	</RB.Button>
				//
				//
				//
				//	<RB.Button bsStyle="primary" onClick={()=>{
				//			this.DiscoverAndConnectTestIns.emit('stop')
				//		}}>
				//		Stop DiscoverAndConnect
				//	</RB.Button>
				//
				//</RB.ButtonToolbar>
			}

			<br/><br/>

			不停发现,连接,断开一个特定设备<br/>
			<RB.Button bsStyle="primary" onClick={this.apitest} block>
				APItest
			</RB.Button>

			{

			//	<br/><br/><br/><br/><br/><br/><br/>
			//	直连测试 不停直连,断开一个特定设备
			//	(仅发现一次用于确定id)
			//
			//	<br/>
			//
			//	<RB.Button bsStyle="primary" onClick={()=>{
			//	this.ConnectDirectly.emit('startByDiscoveryOne')
			//}}>
			//	Start ConnectDirectly
			//	</RB.Button>
			//
			//	<br/><br/>
			//
			//	<RB.Button bsStyle="primary" onClick={()=>{
			//	this.ConnectDirectly.emit('stop')
			//}}>
			//	Stop ConnectDirectly
			//	</RB.Button>
			//


			}

				<br/>
				<br/>
				<br/>


			直连测试
			<a href="/DiscoverAndConnectAndMeasurePage" >
				<RB.Button bsStyle="primary" block>DiscoverAndConnectAndMeasurePage</RB.Button>

			</a>


			<br/>


			<RB.Button bsStyle="primary"
			           onClick={this.say}
			           block
			>语音测试</RB.Button>


		</div>
	}
});
