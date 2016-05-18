

let count = 0;

let sldCount = 0;
let sldSuccessCount = 0;
let sessionId;
let testId;

let DEVICE_ID;

let MACID_LIST= [
  '7CEC79E05EFA',
  'D05FB8418966',
  '7CEC794184DB',
  '7CEC793A0306',
  '7CEC7939E9B9',
  'A4D578405B5A',
  'A4D578416D45',
  'A4D5783F5A67',
  'A4D578408246',
  "20C38FECC518",
	"D05FB8418B71",
	"D05FB8418720",
	"D05FB8418B06",
	"D05FB8418903",
	"D05FB841892E"
]

BP3L.APItest = React.createClass({


  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      testId: '',
      macId: ''
    }
  },

  handleChange(e) {
    this.setState({
      testId: e.target.value
    })
  },

  handleChangeMacId(e) {
    this.setState({
      macId: e.target.value
    })
  },

  getMeteorData() {

    const idInfoSub = Meteor.subscribe('bp3l.IDInfo');
    if(!this.SLDTest) {
      this.SLDTest = new SLDTest();
    }
    return {
      idInfos: idInfoSub.ready() ? DB.IDInfo.find({}).fetch() : [],
      aReactiveInfo: this.SLDTest.aReactiveInfo.get()
    }
  },


  renderSelect() {
    return (
      <div style={{margin: '20px'}}>
        <div>选择一个TestId</div>
        <select style={{padding: '5px', fontSize: '12px'}} onChange={this.handleChange} value={this.state.testId}>
          <option value=''></option>;
          {this.data.idInfos.map((item, key)=>{
            let manufacturerVersion = item.deviceInfo ? `${item.deviceInfo.manufacturer} ${item.deviceInfo.version}` : '';
            return <option key={key} value={item.testId}>{manufacturerVersion} {item.testId.substr(-4)} run了{item.sessionIds && item.sessionIds.length}次</option>;
          })}
        </select>
      </div>
    );
  },

  renderMacId() {
    return (
      <div style={{margin: '20px'}}>
        <div>选择一个MacId</div>
        <select style={{padding: '5px', fontSize: '12px'}} onChange={this.handleChangeMacId} value={this.state.macId}>
          <option value=''></option>;
          {MACID_LIST.map((item, key)=>{
            return <option key={key} value={item}>{item}</option>;
          })}
        </select>
      </div>
    );
  },

  renderLogs() {
    let logsStyle = {
      display: 'flex',
      width: '100%',
      minHeight: '100px',
      border: '1px solid gray',
      overflowY: 'auto',
      maxHeight: '400px',
      flexWrap: 'wrap'
    }
    let infologs = this.data.aReactiveInfo && this.data.aReactiveInfo.toJS() && this.data.aReactiveInfo.toJS().runningLog;
    return <div style={logsStyle}>
     {infologs.map((value, key)=>{
       return <div key={key}>{value}</div>
     })}
    </div>
  },

  componentWillMount(){

		this.APItest = new APIDiscovery();

    this.APIConnect = new APIConnect();

    // Meteor.call('idInfo.initIDInfo');

    // Searching for home
    // Meteor.call('bp3l.getAvailableDevice', (err, macId)=>{
    //   console.log(macId);
    //   DEVICE_ID = macId;
    // })
  },

  componentWillUnMount() {

    Meteor.call('bp3l.updateAvailableDeviceStatus', DEVICE_ID);

    count = 0;
    sldCount = 0;
    sldSuccessCount = 0;
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
    DEVICE_ID = 'D05FB8418966';
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


  runSLD20(e, notClickFlag) {

    if(!notClickFlag) {
      sldCount = 0;
      sldSuccessCount = 0;
    }

    if(sldCount === 0) {

      sessionId = `bp3lsn${new Date().getTime()}`;
      testId = this.state.testId;

      if(this.state.testId) {
        Meteor.call('idInfo.update', this.state.testId, sessionId);
      }else {
        testId = `bp3ltt${new Date().getTime()}`;
        let deviceInfo = h.getDeviceInfo();
        Meteor.call('idInfo.insert', testId, [sessionId], deviceInfo);
      }

    }

    if(sldCount >= 20) {

      this.SLDTest.pushInfoToReact('@@@@@@@@ 完成20次测试 @@@@@@@@');
      return;
    }


    let self = this;
    let reRun = ()=>{

    Meteor.setTimeout(()=>{
        self.SLDTest.data = {};
        self.runSLD20(null,true);
      }, 2000)

    }

    // DEVICE_ID = 'D05FB8418966';

    let actualMacId;

    this.SLDTest.discoveryPromise(this.state.macId, sessionId, testId).then((macId)=>{

      actualMacId = macId
      return this.SLDTest.connectPromise(macId, sessionId, testId)

    }).then(()=>{

      return this.SLDTest.tryMeasurePromise(actualMacId, sessionId, testId);

    }).then(()=>{
      // let disconnect = () =>{
      //   self.SLDTest.disconnectPromise(actualMacId, sessionId, testId).then((successMsg)=>{
      //     sldCount++;
      //     sldSuccessCount++;
      //     console.log(`第${sldCount}运行次成功`);
      //     this.SLDTest.pushInfoToReact(`@@@@@@@@ 第${sldCount}次运行成功 @@@@@@@@ `);
      //     reRun();
      //   }, (err)=>{
      //     reRun()
      //   })
      // }
      // disconnect();

      return self.SLDTest.disconnectPromise(actualMacId, sessionId, testId);
    }).then(()=>{

      sldCount++;
      sldSuccessCount++;
      console.log(`第${sldCount}运行次成功`);
      this.SLDTest.pushInfoToReact(`@@@@@@@@ 第${sldCount}次运行成功 @@@@@@@@ `);
      reRun();

    }).catch((err)=>{

      sldCount++;
      console.log(`第${sldCount}次运行失败`);
      this.SLDTest.pushInfoToReact(`@@@@@@@@ 第${sldCount}次运行失败 @@@@@@@@ `);
      reRun();

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
        width: '100%',
        minHeight: '100px',
        border: '1px solid gray',
        flexWrap: 'wrap'
      },
      textArea: {
        width: '100%',
        minHeight: '200px',
        marginLeft: '20px',
        marginRight: '20px'
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

      <div style={{margin:20,textAlign:'center'}} onClick={()=>{
        FlowRouter.go('/');
      }}>返回</div>

      <RB.Button bsStyle="primary" style={styles.button} onClick={this._runAll}>
      	Discover then connect
      </RB.Button>

      <RB.Button bsStyle="primary" style={styles.button} onClick={this.runSLD20}>
      	测试搜连断20次
      </RB.Button>


      {this.renderSelect()}

      <div>当前的testId {testId}</div>

      {this.renderMacId()}

      <div style={{marginLeft: '20px'}}>
        成功运行{sldSuccessCount}次
        <br/><br/>
        失败运行{sldCount-sldSuccessCount}次
      </div>
      {this.renderLogs()}

      {
      //<div style={styles.buttonGroup}>
      //  <RB.Button bsStyle="primary" style={styles.button} onClick={this.discovery}>
  			//	Discovery API
  			//</RB.Button>
  			//<RB.Button bsStyle="primary" style={styles.button} onClick={this.stop}>
  			//	StopDiscovery API
  			//</RB.Button>
      //
      //  <RB.Button bsStyle="primary" style={styles.button} onClick={this.connect}>
  			//	Connect API
  			//</RB.Button>
      //
      //  <RB.Button bsStyle="primary" style={styles.button} onClick={this.disconnect}>
  			//	Disconnect API
  			//</RB.Button>
      //
      //
      //  <RB.Button bsStyle="primary" style={styles.button} onClick={this._runAll}>
  			//	Run ALL
  			//</RB.Button>
      //
      //  <RB.Button bsStyle="primary" style={styles.button} onClick={this.disConnectTest}>
  			//	DisconnectTest
  			//</RB.Button>
      //
      //</div>
      }
		</div>
	}
})
