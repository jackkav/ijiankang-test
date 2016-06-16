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
        console.log('loading time '+(t2 - t)/1000+' seconds')
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
            <RB.Button >Connect Time</RB.Button>
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
                      <li>CTR - Connection Test Runs, each run can attempt to connect up to ten times, excludes runs after discovery because discovery could fail</li>
                      <li>SC1 - Connection Success On First Attempt</li>
                      <li>SC2 - Connection Success On Second Attempt</li>
                      <li>PSC1=SC1/CTR - Proportion Of First Connection Attempt Success</li>
                      <li>PSC12=SC1+SC2/CTR - Proportion Of First And Second Connection Attempt Success</li>

                      <li>DTR - Discover Test Runs, </li>
                      <li>SD1 - Discover Success On First Attempt</li>
                      <li>SD2 - Discover Success On Second Attempt</li>
                      <li>PSD1=SD1/CTR - Proportion Of First Discovery Attempt Success</li>
                    <li>PSD12=SD1+SD2/CTR - Proportion Of First And Second Discovery Attempt Success</li>
                      </ul>

                    </RB.Panel>
      <Table className="table reactable-table"
        columns={[
         {key:'model',label:'Device Models'},
          {key:'CTR',label:'CTR'},
           {key:'Success',label:'Success'},
            {key:'Fail',label:'Fail'},
             {key:'SC1',label:'SC1'},
              {key:'SC2',label:'SC2'},
             {key:'PSC1',label:'PSC1'},
              {key:'PSC12',label:'PSC12'},
               {key:'SD1',label:'SD1'},
                {key:'SD2',label:'SD2'},
                 {key:'PSD1',label:'PSD1'},
                  {key:'PSD12',label:'PSD12'},
        ]}
        sortable={[
             'model',
             'CTR',
             'SC1',
             'SC2',
             'PSC1',
             'PSC12',
             'DTR',
             'SD1',
             'SD2',
             'PSD1',
             'PSD12',
         ]}
        >
        {
          this.state.items.map(function(item){
            return    <Tr key={item['mobileInfo.model']}>
              <Td column="model">
                  <RB.OverlayTrigger trigger="hover" placement="bottom" overlay={<RB.Popover title="Popover bottom"><strong>Holy guacamole!</strong> Check this info.</RB.Popover>}>
                        <RB.Button bsStyle="default">{item['mobileInfo.model']}</RB.Button>
                      </RB.OverlayTrigger>
                </Td>
            <Td column="CTR">
            {
              item.totalAttemptsToConnect
            }
            </Td>
            <Td column="Success">
            {
              item.totalSuccessfulConnections
            }
            </Td>
            <Td column="Fail">
            {
              item.totalFailedConnections
            }
            </Td>
            <Td column="SC1">
            {
              item.totalSuccessfulFirstConnections
            }
            </Td>
            <Td column="SC2">
            {
              item.totalSuccessfulSecondConnections
            }
            </Td>
            <Td column="PSC1">
            {
              h.roundToPercentage(item.totalSuccessfulFirstConnections,item.totalAttemptsToConnect)
            }
            </Td>
            <Td column="PSC12">
            {
              h.roundToPercentage((item.totalSuccessfulFirstConnections+item.totalSuccessfulSecondConnections),item.totalAttemptsToConnect)
            }
            </Td>
            <Td column="DTR">
            {
              item.totalAttemptsToDiscover
            }
            </Td>
            <Td column="SD1">
            {
              item.totalSuccessfulFirstDiscoveries
            }
            </Td>
            <Td column="SD2">
            {
              item.totalSuccessfulSecondDiscoveries
            }
            </Td>
            <Td column="PSD1">
            {
              h.roundToPercentage(item.totalSuccessfulFirstDiscoveries,item.totalAttemptsToDiscover)
            }
            </Td>
            <Td column="PSD12">
            {
              h.roundToPercentage((item.totalSuccessfulFirstDiscoveries+item.totalSuccessfulSecondDiscoveries),item.totalAttemptsToDiscover)
            }
            </Td>
</Tr>




          })

        }
    </Table>

</div>
  }
})
