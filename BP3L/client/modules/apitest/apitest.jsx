

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

  disconnect() {
    let macId = 'D05FB8418966';
    this.APIConnect.disConnect(macId);
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

      <RB.Button bsStyle="primary" onClick={this.disconnect}>
				Disconnect API
			</RB.Button>


		</div>
	}
})
