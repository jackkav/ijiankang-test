

BP3L.APItest = React.createClass({

  componentWillMount(){
		this.APItest = new APIDiscovery();

    this.APIConnect = new APIConnect();
	},

  discovery() {
    this.APItest.discovery();
  },

  stop() {
    this.APItest.stop();
  },

  connect() {
    this.APIConnect.connect();
  },

  render() {
		return <div>

			<RB.Button bsStyle="primary" onClick={this.discovery}>
				Discovery API
			</RB.Button>
			<RB.Button bsStyle="primary" onClick={this.stop}>
				StopDiscovery API
			</RB.Button>

      <RB.Button bsStyle="primary" onClick={this.connect}>
				Connect API
			</RB.Button>


		</div>
	}
})
