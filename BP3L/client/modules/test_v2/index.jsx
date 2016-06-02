/**
 * Created  on 5/11/16.
 */



App.TEST_V2_INDEX = React.createClass({


	componentWillMount(){
		this.t1 = new TestV2_A()

	},
	componentWillUnmount(){

	},

	start(){

		this.t1.emit('start')
	},
	stop(){
		this.t1.emit('stop')
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

						<RB.NavItem eventKey={2} href="/index_v1">index_v1</RB.NavItem>

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


			<br/><br/>


			<RB.Button bsStyle="primary"
					   onClick={this.start}
					   block>
				Start
			</RB.Button>

			<RB.Button bsStyle="primary"
					   onClick={this.stop}

					   block>
				Stop
			</RB.Button>


		</div>
	}
});
