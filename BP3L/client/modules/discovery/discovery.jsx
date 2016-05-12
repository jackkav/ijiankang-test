/**
 * Created  on 5/11/16.
 */

BP3L.Discovery = React.createClass({


	componentWillMount(){

		this.t1 = new DiscoveryTest()

	},
	componentWillUnmount(){


	},

	start(){

		this.t1.start()

	},

	stop(){

		this.t1.stop()
	},

	apitest() {
		FlowRouter.go('/apitest');
	},

	render() {
		return <div>


			<RB.ButtonToolbar>

				<RB.Button bsStyle="primary" onClick={this.start}>
					Start Discovery
				</RB.Button>


				<RB.Button bsStyle="primary" onClick={this.stop}>
					Stop Discovery
				</RB.Button>

			</RB.ButtonToolbar>


			<RB.Button bsStyle="primary" onClick={this.apitest}>
				APItest
			</RB.Button>

		</div>
	}
});
