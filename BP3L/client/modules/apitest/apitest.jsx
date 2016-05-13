

let count = 0;

let DEVICE_ID;

BP3L.APItest = React.createClass({

  componentWillMount(){

		this.APItest = new APIDiscovery();

    this.APIConnect = new APIConnect();

    Meteor.call('bp3l.getAvailableDevice', (err, macId)=>{
      console.log(macId);
      DEVICE_ID = macId;
    })
	},

  componentWillUnMount() {

    Meteor.call('bp3l.updateAvailableDeviceStatus', DEVICE_ID);

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
    // let macId = 'D05FB8418966';
    this.APIConnect.disConnect(DEVICE_ID);
  },

  disConnectTest() {
    // let macId = 'D05FB8418966';
    this.APIConnect.disConnectTest(DEVICE_ID);
  },

  _runAll() {

    let self = this;
    let reRun = ()=>{

      Meteor.setTimeout(()=>{
        self._runAll();
      }, 2000)

    }

    this.APIConnect.connectPromise(DEVICE_ID).then((actualMacId)=>{

      let disconnect = () =>{
        self.APIConnect.disconnectPromise(actualMacId).then((successMsg)=>{
          count++;
          console.log(`成功运行${count}次`);
          reRun();
        }, (err)=>{
          reRun()
        })
      }
      disconnect();

    }, (err)=>{
      reRun()
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

        <RB.Button bsStyle="primary" style={styles.button} onClick={this.disConnectTest}>
  				DisconnectTest
  			</RB.Button>

      </div>

		</div>
	}
})
