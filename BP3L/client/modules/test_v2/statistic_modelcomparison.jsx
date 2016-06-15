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





    return <div>
    <a href="/statistic/test_v2/index" block>
        <RB.Button >返回</RB.Button>
    </a>
      <Table className="table reactable-table"
        columns={[
         {key:'mobileString',label:'Device Models'},
        ]}>
        {
          this.state.items.map(function(item){
            return    <Tr key={item['mobileInfo.model']}><Td column="mobileString">

            {

              item['mobileInfo.model'] + '   '+
              ' / Runs: '+item.totalAttemptsToConnect
              +' / Success: '+item.totalSuccessfulConnections
              +' / Fail: '+item.totalFailedConnections
              +' / SC1: '+item.totalSuccessfulFirstConnections
              +' / SC2: '+item.totalSuccessfulSecondConnections

              + ' SC1/TR= '+ h.roundToPercentage(item.totalSuccessfulFirstConnections,item.totalAttemptsToConnect)
              + ' SC1+SC2/TR= '+ h.roundToPercentage((item.totalSuccessfulFirstConnections+item.totalSuccessfulSecondConnections),item.totalAttemptsToConnect)

              + ' SD1/TR= '+ h.roundToPercentage(item.totalSuccessfulFirstDiscoveries,item.totalAttemptsToDiscover)
              + ' SD1+SD2/TR= '+ h.roundToPercentage((item.totalSuccessfulFirstDiscoveries+item.totalSuccessfulSecondDiscoveries),item.totalAttemptsToDiscover)
            }



            </Td></Tr>

          })

        }
    </Table>

</div>
  }
})
