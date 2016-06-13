

BP3L.StatisticTestV2ConnectTime = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData(){

        // let sub= Meteor.subscribe('test_v2.all')
        return {
            // ready:sub.ready(),
            // items:DB.TestV2001.find({}, {
            //     sort: {testType: 1}
            // }).fetch()
        }
    },

    getinitialstate(){


        return{
            loading:true,
            data:{}
        }
    },

    fetchData(cb){
        let self =this;
        self.setState({
            loading:true
        })

        Meteor.call('test_v2/connectTime',function(err,data){
            console.log(data)
            self.setState({
                loading:false,
                data:data
            })

            cb &&  cb(data)
        })
    },

    componentWillMount(){

        let self =this;





    },


    componentDidUpdate(nextProps, nextState){

    },
    componentDidMount(){
        this.initChart1()

        this.initChart2()

    },

    initChart1(){

        var self =this
        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);

        self.chart1 = myChart


        let  option = null;
        var xData = [];
        var yData = [];

        self.fetchData(function(data){

            xData = data.x
            yData = data.y

            option = {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                title: {
                    left: 'center',
                    text: '连接时间概率分布',
                },
                legend: {
                    top: 'bottom',
                    data:['时间']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xData
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
                },
                // dataZoom: [{
                //     type: 'inside',
                //     start: 0,
                //     end: 10
                // }, {
                //     start: 0,
                //     end: 10
                // }],
                series: [
                    {
                        name:'成功概率',
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            normal: {
                                color: 'rgb(255, 70, 131)'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }])
                            }
                        },
                        data: yData
                    }
                ]
            };
            ;

            myChart.setOption(option, true);


        })

    },


    initChart2(){//概率密度

        var self =this
        var dom = document.getElementById("container2");
        var myChart = echarts.init(dom);

        self.chart2 = myChart

        let  option = null;
        // var xData = [];
        // var yData = [];

        xBarData=[]
        yBarData=[]

        self.fetchData(function(data){

            // xData = data.x
            // yData = data.y

            for(let i=1;i<data.x.length;i++){
                xBarData.push(data.x[i-1]+'-'+data.x[i])
                yBarData.push(data.y[i]-data.y[i-1])
            }



            option = {
                tooltip: {
                    trigger: 'axis',
                    position: function (pt) {
                        return [pt[0], '10%'];
                    }
                },
                title: {
                    left: 'center',
                    text: '连接时间概率分布密度',
                },
                legend: {
                    top: 'bottom',
                    data:['时间']
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xBarData
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%']
                },
                // dataZoom: [{
                //     type: 'inside',
                //     start: 0,
                //     end: 10
                // }, {
                //     start: 0,
                //     end: 10
                // }],
                series: [
                    {
                        name:'成功概率',
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            normal: {
                                color: 'rgb(255, 70, 131)'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }])
                            }
                        },
                        data: yBarData
                    }
                ]
            };
            ;

            myChart.setOption(option, true);


        })



    },

    render(){
        let self =this;


        return<div style={{padding:10}}>

            <a href="/statistic/test_v2/index" block>
                <RB.Button >返回</RB.Button>
            </a>

            <RB.Button >更新数据</RB.Button> <span>最后更新于:</span>



            <div id="container" style={{width: 600,height:400,margin:'0 auto'}}>


            </div>

            <hr/>



            <div id="container2" style={{width: 600,height:400,margin:'0 auto'}}>


            </div>







        </div>
    }
})