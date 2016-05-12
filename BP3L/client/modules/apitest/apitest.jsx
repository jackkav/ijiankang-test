

let count = 0;

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

  _runAll() {
    let macId = 'D05FB8418966';
    let self = this;
    if(count > 1000) {
      return;
    }
    this.APIConnect.connectPromise(macId).then((actualMacId)=>{

      let disconnect = () =>{
        self.APIConnect.disconnectPromise(actualMacId).then((successMsg)=>{
          console.log(successMsg);

          console.log(count);
          count++;
          self._runAll();
        }, (err)=>{
          self._runAll();
          console.log(err);
        })
      }

      disconnect();
    }, (err)=>{
      console.log(err);
      self._runAll();
    })
  },

  getCssStyle() {

    return {
      buttonGroup: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
      },
      logArea: {
        display: 'flex',
        width: '100%'
      },
      textArea: {
        width: '100%',
        minHeight: '200px'
      },
      button: {
        margin: '5px 5px',
        minWidth: '150px'
      }
    }


  },

  render() {
    let styles = this.getCssStyle();
		return <div>

      <div style={styles.logArea}>
        <textarea style={styles.textArea}>

        </textarea>
      </div>
      <div style={styles.buttonGroup}>
        <RB.Button bsStyle="primary" style={styles.button} onClick={this.discovery}>
  				Discovery API
  			</RB.Button>
  			<RB.Button bsStyle="primary" style={styles.button} onClick={this.stop}>
  				StopDiscovery API
  			</RB.Button>

        <RB.Button bsStyle="primary" style={styles.button} onClick={this.connect}>
  				Connect API
  			</RB.Button>

        <RB.Button bsStyle="primary" style={styles.button} onClick={this.disconnect}>
  				Disconnect API
  			</RB.Button>


        <RB.Button bsStyle="primary" style={styles.button} onClick={this._runAll}>
  				Run ALL
  			</RB.Button>

      </div>

		</div>
	}
})
