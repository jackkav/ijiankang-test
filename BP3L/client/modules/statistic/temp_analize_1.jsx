

BP3L.TempAnalize1 = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){
        let sub= Meteor.subscribe('temp_analize_1')
        return {
          ready:sub.ready(),
          items:DB.TempAnalize1.find({}, {
            sort: {testType: 1}
          }).fetch()
        }
    },

    appendData(items){

        //discover1
        items.forEach(function(item){

          if(item.testType =='DiscoverAndConnectAndMeasureTest'){
              item.discover_1 = item.discover_2= ''
          }else{
            item.discover_1 = item.discover_1_count +'/'+item.discover_1_count_success+'/'+item.discover_1_count_failure
            item.discover_2 = item.discover_2_count +'/'+item.discover_2_count_success+'/'+item.discover_2_count_failure
          }

            item.connect_1 = item.connect_1_count +'/'+item.connect_1_count_success+'/'+item.connect_1_count_failure
            item.connect_2 = item.connect_2_count +'/'+item.connect_2_count_success+'/'+item.connect_2_count_failure


            item.a_connect_success_1_percent = item.connect_1_count_success/item.connect_1_count
            item.a_connect_success_2_percent = item.connect_2_count_success/item.connect_2_count
            item.a_connect_success_percent = (item.connect_1_count_success+item.connect_2_count_success)/(item.connect_1_count+item.connect_2_count)


        })

    },

    render(){
        if(!this.data.ready) return <div>loading</div>

          this.appendData(this.data.items)

          var Table = Reactable.Table,
            Thead = Reactable.Thead,
            Th = Reactable.Th,
            Tr = Reactable.Tr,
            Td = Reactable.Td;

        return <div style={{padding:10}}>

        <a href="/" >
  				<RB.Button block>返回</RB.Button>
  			</a>

  			<RB.Well>
        测试类型<br/>
        直连directly: (搜索到指定血压计－（连接－断开）重复20次－重启应用)重复10次<br/>
        搜连断SLDtest:((搜索到指定血压计-连接－断开）重复20次－重启应用)重复10次<br/>

        </RB.Well>

        <hr/>


          <Table className="table reactable-table"
            columns={[
              {key:'testId',label:'testId'},
              {key:'device',label:'device'},
              {key:'testType',label:'testType'},


              {key:'discover_1',label:'discover_1'},
              {key:'discover_2',label:'discover_2'},
              {key:'connect_1',label:'connect_1'},
              {key:'connect_2',label:'connect_2'},



              {key:'a_connect_success_1_percent',label:'第1次连接成功率'},
              {key:'a_connect_success_2_percent',label:'第2次连接成功率'},
              {key:'a_connect_success_percent',label:'总连接成功率'},




            ]}

            sortable={[
                'testType',
                'device',
                'a_connect_success_1_percent',
                'a_connect_success_2_percent',
                'a_connect_success_percent'
            ]}
            filterable={['device', 'testType']}
            >
            

              {
                this.data.items.map(function(item){
                  return <Tr key={item._id}>
                    <Td column="testId">{item.testId}</Td>
                    <Td column="device">{item.device}</Td>
                    <Td column="testType">
                      {
                        item.testType=='DiscoverAndConnectAndMeasureTest'?'directly':item.testType
                      }
                    </Td>

                    <Td column="discover_1">{item.discover_1}</Td>
                    <Td column="discover_2">{item.discover_2}</Td>
                    <Td column="connect_1">{item.connect_1}</Td>
                    <Td column="connect_2">{item.connect_2}</Td>


                    <Td column="a_connect_success_1_percent">{item.a_connect_success_1_percent}</Td>
                    <Td column="a_connect_success_2_percent">{item.a_connect_success_2_percent}</Td>
                    <Td column="a_connect_success_percent">{item.a_connect_success_percent}</Td>



                  </Tr>
                })
              }
      		</Table>


        </div>
    }
})
