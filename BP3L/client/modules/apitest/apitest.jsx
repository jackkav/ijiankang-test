

BP3L.APItest = React.createClass({

  componentWillMount(){
		this.APItest = new APIDiscovery();
	},

  discovery() {
    this.APItest.discovery();
  },

  stop() {
    this.APItest.stop();
  },

  render() {
		return <div>

			<RB.Button bsStyle="primary" onClick={this.discovery}>
				Discovery API
			</RB.Button>
			<RB.Button bsStyle="primary" onClick={this.stop}>
				StopDiscovery API
			</RB.Button>

		</div>
	}
})
