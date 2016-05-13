/**
 * Created  on 5/11/16.
 */



App.AdminIndex = React.createClass({


	componentWillMount(){
		this.t1 = new DiscoveryTest()

		this.DiscoverAndConnectTestIns = new DiscoverAndConnectTest()


		this.ConnectDirectly = new ConnectDirectly()


	},
	componentWillUnmount(){


	},

	discovery(){

		this.t1.emit('start')

	},

	stop(){

		this.t1.emit('stop')

	},

	render() {

		const navbarInstance = (
			<RB.Navbar inverse>
				<RB.Navbar.Header>
					<RB.Navbar.Brand>
						<a href="#">iJianKang Test</a>
					</RB.Navbar.Brand>
					<RB.Navbar.Toggle />
				</RB.Navbar.Header>


				<RB.Navbar.Collapse>
					<RB.Nav>
						<RB.NavItem eventKey={1} href="/apitest">apitest</RB.NavItem>
						<RB.NavItem eventKey={2} href="#">Link</RB.NavItem>

					</RB.Nav>
					<RB.Nav pullRight>
						<RB.NavItem eventKey={1} href="#">Link Right</RB.NavItem>
						<RB.NavItem eventKey={2} href="#">Link Right</RB.NavItem>
					</RB.Nav>
				</RB.Navbar.Collapse>
			</RB.Navbar>
		);

		return <div>

			{navbarInstance}



			<BP3L.Discovery />


			<br/>

			<RB.ButtonToolbar>
						<RB.Button bsStyle="primary" onClick={()=>{
							this.DiscoverAndConnectTestIns.emit('start')
						}}>
							Start DiscoverAndConnect
						</RB.Button>



						<RB.Button bsStyle="primary" onClick={()=>{
							this.DiscoverAndConnectTestIns.emit('stop')
						}}>
							Stop DiscoverAndConnect
						</RB.Button>

			</RB.ButtonToolbar>

			<br/>


			<RB.ButtonToolbar>
				<RB.Button bsStyle="primary" onClick={()=>{
							this.ConnectDirectly.emit('start')
						}}>
					Start ConnectDirectly
				</RB.Button>



				<RB.Button bsStyle="primary" onClick={()=>{
							this.ConnectDirectly.emit('stop')
						}}>
					Stop ConnectDirectly
				</RB.Button>

			</RB.ButtonToolbar>



		</div>
	}
});