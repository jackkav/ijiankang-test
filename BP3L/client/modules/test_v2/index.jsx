/**
 * Created  on 5/11/16.
 */


App.TestV2Index = React.createClass({

    mixins: [ReactMeteorData],

    getMeteorData(){
        if(!this.t1){
          this.t1 = new TestV2_A()
        }

        this.bp3lInfoSub = Meteor.subscribe('bp3l.macIds');

        return{

            macIds: this.bp3lInfoSub.ready() ? DB.BP3LInfo.find({}).fetch() : [],
            commonLog:this.t1.rCommonLog.get(),
            commonInfo:this.t1.rCommonInfo.get()
        }
    },

    getInitialState: function() {
        return {
            deviceId: '',
            testType:''
        };
    },

    componentWillMount(){

    },
    componentWillUnmount(){

    },

    start(){
      if(!this.state.testType || !this.state.deviceId){
        alert('Please select options')
        return
      }

      this.t1.emit('start',this.state.deviceId, this.state.testType)
    },
    stop(){
        this.t1.emit('stop')
    },

    selectDevice(event){

        let id = event.target.value
        this.setState({deviceId:id})
    },

    selectTestType(event){
      let id = event.target.value
      console.log('selectTestType',id)
      this.setState({testType:id})
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

                        <RB.NavItem eventKey={1} href="/statistic/test_v2/index">test_v2 statistic</RB.NavItem>


                        <RB.NavItem eventKey={2} href="/statistic/TempAnalize1">analysis-1</RB.NavItem>

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
            <span>
              {
                this.data.commonInfo.runSum
              }
            </span>


            <RB.Button bsStyle="primary"
                       onClick={this.stop}
                       style={{float:'right'}}
                       >
                Stop
            </RB.Button>


            <br/><br/>

            <div >

                <div>Select a device ID</div>

                <select
                style={{width:'100%',height:'25px'}}
                value={this.state.deviceId} onChange={ this.selectDevice}>

                    <option value=""></option>

                    {
                        this.data.macIds.map(function (item) {
                            let mac = item.macId
                            return <option key={mac} value={mac}>{mac}-{mac.slice(-4)}</option>

                        })
                    }


                </select>
            </div>

            <br/><br/>

            <div >

                <div>Select a test type</div>

                <select style={{width:'100%',height:'25px'}}
                value={this.state.testType} onChange={ this.selectTestType}>

                    <option value=""></option>
                    <option value={1}>connect directly</option>
                    <option value={2}>discoverAndConnect connect</option>

                </select>
            </div>


            <br/><br/>

            <RB.Button bsStyle="primary"
                       onClick={this.start}
                       block>
                Start
            </RB.Button>


            <hr/>
            <pre>

              {
                this.data.commonLog
              }

            </pre>




        </div>
    }
});
