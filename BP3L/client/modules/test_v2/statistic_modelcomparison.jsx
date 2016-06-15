BP3L.StatisticTestV2ModelComparison = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {

      // let sub= Meteor.subscribe('test_v2.all')
      return {
          // ready:sub.ready(),
          // items:DB.TestV2001.find({}, {
          //     sort: {testType: 1}
          // }).fetch()
          // Meteor.call("test_v2/model_list",function(e,r){console.log(r)})
      }
  },

  getInitialState() {
      return {items: [], ready: false}
  },
  componentWillMount(){
      let self =this
      let t = +new Date()
      Meteor.call("test_v2/model_list_group",function(e,r){
        let t2= +new Date()
        console.log(t2 - t)
        self.setState({items:r,ready:true})
      })

  },
  render() {
     if (!this.state.ready) return <div>loading</div>
    //this.state
    var Table = Reactable.Table,
        Thead = Reactable.Thead,
        Th = Reactable.Th,
        Tr = Reactable.Tr,
        Td = Reactable.Td;





    return <div style={{padding:10}}>
        <RB.ButtonToolbar>

        <a href="/">
            <RB.Button >返回</RB.Button>
        </a>

        <a  style={{float:'right'}}
            href="/statistic/test_v2/connectTime">
            <RB.Button >Configuration</RB.Button>
        </a>
            <RB.Button  onClick={ ()=> this.setState({ showComment: !this.state.showComment })}>
                {this.state.showComment?'close Config':'open Config'}
            </RB.Button>

        </RB.ButtonToolbar>

                    <br/>


                    <RB.Panel collapsible expanded={this.state.showComment}>

                      Configuration
                      <ol>
                      <li>
                      Percentage of successful connections against total connections should be higher than <b>98%</b> AND Percentage of successful connections plus against total connections should be higher than <b>95%</b>
                      </li>
                      <li>
                      Percentage of successful discoveries against total discoveries should be higher than <b>98%</b> AND Percentage of successful discoveries plus against total discoveries should be higher than <b>95%</b>
                      </li>
                      <li>
                        Over <b>90%</b> of successful connections should occur in less than or equal to <b>8 seconds</b>
                      </li>
                      </ol>
                      <ul>
                      <li>CTR - Connection Test Run</li>
                      <li>SC1 - Connection Success On First Attempt</li>
                      <li>SC2 - Connection Success On Second Attempt</li>
                    <li>DTR - Discover Test Run</li>
                    <li>SD1 - Discover Success On First Attempt</li>
                    <li>SD2 - Discover Success On Second Attempt</li>
                      </ul>

                    </RB.Panel>

      <Table className="table reactable-table"
        columns={[
         {key:'mobileString',label:'Device Models'},
        ]}>
        {
          this.state.items.map(function(item){
            return    <Tr key={item['mobileInfo.model']}><Td column="mobileString">

            {

              item['mobileInfo.model'] + '   '+
              ' / CTR: '+item.totalAttemptsToConnect
              // +' / Success: '+item.totalSuccessfulConnections
              // +' / Fail: '+item.totalFailedConnections
              +' / SC1: '+item.totalSuccessfulFirstConnections
              +' / SC2: '+item.totalSuccessfulSecondConnections

              + ' / SC1/CTR= '+ h.roundToPercentage(item.totalSuccessfulFirstConnections,item.totalAttemptsToConnect)
              + ' / SC1+SC2/CTR= '+ h.roundToPercentage((item.totalSuccessfulFirstConnections+item.totalSuccessfulSecondConnections),item.totalAttemptsToConnect)

              +' / DTR: '+item.totalAttemptsToDiscover
              +' / SD1: '+item.totalSuccessfulFirstDiscoveries
              +' / SD2: '+item.totalSuccessfulSecondDiscoveries
              + ' / SD1/DTR= '+ h.roundToPercentage(item.totalSuccessfulFirstDiscoveries,item.totalAttemptsToDiscover)
              + ' / SD1+SD2/DTR= '+ h.roundToPercentage((item.totalSuccessfulFirstDiscoveries+item.totalSuccessfulSecondDiscoveries),item.totalAttemptsToDiscover)
            }



            </Td></Tr>

          })

        }
    </Table>

</div>
  }
})
