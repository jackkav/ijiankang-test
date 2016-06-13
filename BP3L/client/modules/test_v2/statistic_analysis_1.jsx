BP3L.StatisticTestV2Analysis_1 = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){

        let sub = Meteor.subscribe('test_v2.TestV2001_analyze_1')
        return {
            ready: sub.ready(),
            items: DB.TestV2001_analyze_1.find({}, {}).fetch()
        }
    },

    formatData(items){
        let result = []
        items.forEach(function(item){


            item.s_testTimesAll = item['type'+item.testType+'_testTimesAll']
            item.s_connectTimesSuccessAll = item['type'+item.testType+'_connectTimesSuccessAll']
            item.s_connectTimesAll = item['type'+item.testType+'_connectTimesAll']


            //测试成功率
            item.s_testSuccessPercent =item.s_connectTimesSuccessAll/item.s_testTimesAll
            item.s_testSuccessPercent_comment = '('+item.s_connectTimesSuccessAll +'/'+item.s_testTimesAll+')'

            //连接成功率
            item.s_connectSuccessPercent =item.s_connectTimesSuccessAll/item.s_connectTimesAll
            item.s_connectSuccessPercent_comment ='('+item.s_connectTimesSuccessAll+'/'+item.s_connectTimesAll+')'

            //第n次连接成功率
            item.s_connectTimes = item['type'+item.testType+'_connectTimes']
            item.s_connectTimes.forEach(function(stat,index){
                item['s_'+index+'connectSuccessPercent'] = stat.success/stat.sum
                item['s_'+index+'connectSuccessPercent_comment'] = '('+stat.success+'/'+stat.sum+')'

            })




            result.push(item)

        })

        return result

    },

    render(){
        if (!this.data.ready) return <div>loading</div>


        var Table = Reactable.Table,
            Thead = Reactable.Thead,
            Th = Reactable.Th,
            Tr = Reactable.Tr,
            Td = Reactable.Td;


        let items = this.formatData(this.data.items)


        return <div style={{padding:10}}>

            <a href="/">
                <RB.Button >返回</RB.Button>
            </a>

            <a  style={{float:'right'}}
                href="/statistic/test_v2/connectTime">
                <RB.Button >连接时间统计</RB.Button>
            </a>


                <pre>

                    测试类型<br/>
                    直连: 搜索到指定血压计－连接(若失败则根据id直连,最多10次)-测量-断开 <br/>
                    搜连: (搜索到指定血压计(若失败则重复最多10次)-连接))(失败则重新发现,最多重复10次)-测量-断开<br/>

                    统计点:<br/>
                     测试成功率:测试成功次数/测试次数  (一次测试可能搜索了10次连接了10次才成功)<br/>
                     连接成功率:总连接成功次数/总连接次数<br/>
                     第n次连接成功率:第n次连接成功次数/第n次连接总次数<br/>

                     连接超时率: 连接无回调展连接失败的比重<br/>
                     连接失败率: 连接有回调但失败<br/>


                     发现成功率(针对搜连)<br/>
                     第n次连接成功率(针对搜连)<br/>
                     连接回调时间的分布(可排除超时的case)


                </pre>


            <Table className="table reactable-table"
                   columns={[
                        {key:'mobileString',label:'机型'},
                        {key:'testType',label:'testType'},

                        {key:'s_testSuccessPercent',label:'测试成功率'},
                        {key:'s_connectSuccessPercent',label:'总连接成功率'},

                        {key:'s_0connectSuccessPercent',label:'1st连接成功率'},
                        {key:'s_1connectSuccessPercent',label:'2st连接成功率'},
                        {key:'s_2connectSuccessPercent',label:'3st连接成功率'},
                        {key:'s_3connectSuccessPercent',label:'4st连接成功率'},
                        {key:'s_4connectSuccessPercent',label:'5st连接成功率'},
                        {key:'s_5connectSuccessPercent',label:'6st连接成功率'},
                        {key:'s_6connectSuccessPercent',label:'7st连接成功率'},
                        {key:'s_7connectSuccessPercent',label:'8st连接成功率'},
                        {key:'s_8connectSuccessPercent',label:'9st连接成功率'},
                        {key:'s_9connectSuccessPercent',label:'10st连接成功率'},




                        // {key:'count_type_1',label:'直连Test次数'},
                        // {key:'count_type_1_result_success',label:'直连成功次数'},

                        //搜连
                        // {key:'count_type_2',label:'搜连Test次数'},
                        // {key:'count_type_2_result_success',label:'搜连成功次数'},




                        // {key:'count_type_1_connect1_success',label:'connect-1-success'},
                        //
                        // {key:'count_type_1_connect2_success',label:'connect-2-success'},
                        //
                        // {key:'count_type_1_connect3_success',label:'connect-3-success'},




                        //最大次数
                        {key:'max_type_1_connect_times',label:'max_type_1_connect_times'},
                        {key:'max_type_1_discover_times',label:'max_type_1_discover_times'},





                   ]}

                   sortable={[
                        'testType',
                        's_testSuccessPercent',
                        's_connectSuccessPercent',

                        's_0connectSuccessPercent',
                        's_1connectSuccessPercent',
                        's_2connectSuccessPercent',
                        's_3connectSuccessPercent',
                        's_4connectSuccessPercent',
                        's_5connectSuccessPercent',
                        's_6connectSuccessPercent',
                        's_7connectSuccessPercent',
                        's_8connectSuccessPercent',
                        's_9connectSuccessPercent',


                        // 'count_type_2',
                        // 'count_type_2_result_success',
                    ]}
                   filterable={['mobileString', 'testType']}

                   //data={data}
            >
                {
                    items.map(function(item){
                        return <Tr key={item._id}>
                            <Td column="mobileString">{item.mobileString}</Td>
                            <Td column="testType">
                                {item.testType}
                            </Td>

                            <Td column="s_testSuccessPercent">

                                {item.s_testSuccessPercent}
                                {item.s_testSuccessPercent_comment}

                            </Td>
                            <Td column="s_connectSuccessPercent">

                                {item.s_connectSuccessPercent}
                                {item.s_connectSuccessPercent_comment}

                            </Td>


                                {

                                    item.s_connectTimes.map(function(info,index){

                                        return <Td column={'s_'+index+'connectSuccessPercent'}>

                                            {item['s_'+index+'connectSuccessPercent']}
                                            {item['s_'+index+'connectSuccessPercent_comment']}

                                        </Td>
                                    })
                                }


                        </Tr>
                    })
                }




            </Table>

        </div>
    }
})