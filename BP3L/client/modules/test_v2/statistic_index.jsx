/**
 * Created by fanjinhui on 6/2/16.
 */



BP3L.StatisticTestV2Index = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){

        let sub= Meteor.subscribe('test_v2.all')
        return {
            ready:sub.ready(),
            items:DB.TestV2001.find({}, {
                sort: {testType: 1}
            }).fetch()
        }
    },

    formatData(items){
        let result =[]

        items.forEach(function(item){

            let obj={}
            obj.testId = item._id
            obj.mobileString = h.getDeviceString(item.mobileInfo)
            obj.testType = item.testType
            obj.testResult = item.resultInfo.connectStatus
            obj.connectTimes= item.connectInfo.length
            obj.discoverTimes= item.discoverInfo.length

            item.connectInfo.forEach(function(item,index,arr){

                obj['connect_time_'+index] = item.endTime - item.startTime
            })

            if(item.testType==2){
                item.discoverInfo.forEach(function(item,index,arr){

                    obj['discover_time_'+index] = item.endTime - item.startTime
                })
            }





            result.push(obj)
        })


        return result

    },

    render(){
        let self =this;

        if(!this.data.ready) return <div>loading</div>


        var Table = Reactable.Table,
            Thead = Reactable.Thead,
            Th = Reactable.Th,
            Tr = Reactable.Tr,
            Td = Reactable.Td;


        let data = self.formatData(this.data.items)



        return<div style={{padding:10}}>

            <a href="/" >
                <RB.Button block>返回</RB.Button>
            </a>

            <RB.Well>
                测试类型<br/>
                直连: 搜索到指定血压计－连接(若失败则根据id直连,最多10次)-测量-断开 <br/>
                搜连: (搜索到指定血压计(若失败则重复最多10次)-连接))(失败则重新发现,最多重复10次)-测量-断开<br/>

            </RB.Well>




            <Table className="table reactable-table"
                   data={data}
            >


            </Table>

        </div>
    }
})