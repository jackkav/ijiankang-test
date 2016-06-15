BP3L.StatisticTestV2ModelComparison = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {

      // let sub= Meteor.subscribe('test_v2.all')
      return {
          // ready:sub.ready(),
          // items:DB.TestV2001.find({}, {
          //     sort: {testType: 1}
          // }).fetch()
      }
  },

  getInitialState() {
      return {data: {}, optionsData: []}
  },
  render() {
    // if (!this.state.ready) return <div>loading</div>
    var Table = Reactable.Table,
        Thead = Reactable.Thead,
        Th = Reactable.Th,
        Tr = Reactable.Tr,
        Td = Reactable.Td;
    return <div>
    <RB.Col xs={6} md={6} >
      <Table className="table reactable-table"
        columns={[
         {key:'mobileString',label:'机型'},
        ]}>
        <Tr key="1"><Td column="mobileString">OPPO</Td></Tr>
        <Tr key="1"><Td column="mobileString">OPPO</Td></Tr>
        <Tr key="1"><Td column="mobileString">OPPO</Td></Tr>
    </Table>
    </RB.Col>
    <RB.Col xs={6} md={6} >
    <div>chart goes here</div>
    </RB.Col>
</div>
  }
})
