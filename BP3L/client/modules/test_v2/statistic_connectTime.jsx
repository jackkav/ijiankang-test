BP3L.StatisticTestV2ConnectTime = React.createClass({
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

    fetchDataV2(query, cb) {
        let self = this;

        let paramsOrder = ['testType', 'deviceModel']

        let params = _.map(paramsOrder, function(value, index) {

            return query[value] || ''

        })

        console.log('params', params)

        Meteor.apply('test_v2/getConnectTimeData', params, function(err, data) {

            if (err) {
                console.error(err)
                return
            }

            console.log(data)

            self.setState({data: data})

            cb && cb(data)
        })

    },

    fetchOptionsData(cb) {

        let self = this
        Meteor.call('test_v2/getSearchOptionsData', function(err, data) {

            if (err) {
                console.error(err)
                return
            }

            console.log('getSearchOptionsData', data)

            self.setState({optionsData: data})

            cb && cb(data)

        })

    },

    componentWillMount() {

        let self = this;
        self.fetchDataV2({}, function() {

            self.chart1.hideLoading()
            self.chart2.hideLoading()

        })

        //////
        self.fetchOptionsData()

    },

    getOptions(optionType) {
        let ret = []
        if (optionType == 'deviceModel') {

            ret = this.state.optionsData.map(function(item) {
                return item.deviceModel
            })

        }

        return ret

    },

    getDataForChart(oriData) {
        let self = this

        let sum = _.reduce(oriData, function(emo, item) {
            return emo + item.count
        }, 0)

        console.log(sum)

        let dataMap = {}
        _.each(oriData, function(item) {

            dataMap[item.x] = item

        })

        console.log(dataMap)

        let test = {
            count: 0,
            p: 0
        }

        var data = {
            x: [],
            y: []
        }
        for (let i = 0; i <= 250; i++) {
            let index = i
            let item = dataMap[index]

            data.x.push(i)

            if (item) {

                item.y = item.count / sum
                data.y.push(item.y)

                test.y += item.y
                test.count += item.count
            } else {
                data.y.push(0)
            }

        }

        console.log(data, test)

        self.chart2.setOption({
            xAxis: {
                // type: 'category',
                // boundaryGap: false,
                data: data.x
            },
            series: [
                {
                    data: data.y
                }
            ]
        })

        console.log(oriData)

        //////chart1
        let dataChart1 = {
            x: [0],
            y: [0]
        }
        for (let i = 1; i <= 250; i++) {

            dataChart1.x.push(i)
            dataChart1.y.push(dataChart1.y[i - 1] + (dataMap[i]
                ? dataMap[i].y
                : 0))

        }

        console.log(dataChart1)
        self.chart1.setOption({
            xAxis: {
                // type: 'category',
                // boundaryGap: false,
                data: dataChart1.x
            },
            series: [
                {
                    data: dataChart1.y
                }
            ]
        })

    },

    componentDidUpdate(nextProps, nextState) {

        this.getDataForChart(this.state.data)

    },
    componentDidMount() {

        this.initChart2V2()

        this.initChart1V2()

    },

    initChart2V2() {

        var self = this
        var dom = document.getElementById("container2");
        var myChart = echarts.init(dom);

        self.chart2 = myChart

        let option = null;
        // var xData = [];
        // var yData = [];

        xBarData = []
        yBarData = []

        //this.getDataForChart(this.state.data)

        option = {
            tooltip: {
                trigger: 'axis',
                position: function(pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: '连接时间概率分布密度'
            },
            legend: {
                top: 'bottom',
                data: ['时间']
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
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
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 250
                }, {
                    start: 0,
                    end: 10
                }
            ],
            series: [
                {
                    name: '成功概率',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }
                            ])
                        }
                    },
                    data: yBarData
                }
            ]
        };;

        myChart.setOption(option, true);

        self.chart2.showLoading()

    },

    initChart1V2() {

        var self = this
        var dom = document.getElementById("container");
        var myChart = echarts.init(dom);

        self.chart1 = myChart

        let option = null;
        var xData = [];
        var yData = [];

        option = {
            tooltip: {
                trigger: 'axis',
                position: function(pt) {
                    return [pt[0], '10%'];
                }
            },
            title: {
                left: 'center',
                text: '连接时间概率分布'
            },
            legend: {
                top: 'bottom',
                data: ['时间']
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar', 'stack', 'tiled']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true
                    }
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
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }, {
                    start: 0,
                    end: 10
                }
            ],
            series: [
                {
                    name: '成功概率',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        normal: {
                            color: 'rgb(255, 70, 131)'
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: 'rgb(255, 158, 68)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 70, 131)'
                                }
                            ])
                        }
                    },
                    data: yData
                }
            ]
        };;

        myChart.setOption(option, true);

        self.chart1.showLoading()

    },

    formChange(e) {
        let self = this
        let changeType = e.target.id
        let value = e.target.value
        console.log(changeType, value)

        if (changeType == 'deviceModel') {
            self.fetchDataV2({deviceModel: value})
        }

    },

    render() {
        let self = this;

        let models = this.getOptions('deviceModel')

        return <div style={{
            padding: 10
        }}>

            <a href="/statistic/test_v2/index" block>
                <RB.Button >返回</RB.Button>
            </a>
            <RB.Col xs={6} md={4} >
            <RB.Panel header="Filter" style={{
                width: '80%',
                margin: '10px auto'
            }}>

                <RB.Form vertical>
                    <RB.FormGroup controlId="testType">
                        <RB.ControlLabel>Test Type</RB.ControlLabel>
                            <RB.FormControl onChange={this.formChange} componentClass="select" placeholder="select">
                                <option value="1">connnectDirectly</option>
                                <option value="2">discoverAndConnnect</option>
                            </RB.FormControl>

                    </RB.FormGroup>

                    <RB.FormGroup controlId="deviceModel">
                        <RB.ControlLabel>Device Model</RB.ControlLabel>
                            <RB.FormControl onChange={this.formChange} componentClass="select" placeholder="select">

                                <option value="">All</option>

                                {models.map(function(model) {
                                    return <option value={model}>{model}</option>
                                })}
                            </RB.FormControl>
                    </RB.FormGroup>
                </RB.Form>

            </RB.Panel>
        </RB.Col>
        <RB.Col xs={12} md={8}>
            <div id="container" style={{ width: 600, height: 400, margin: '0 auto'}}></div>
            <hr/>
            <div id="container2" style={{ width: 600, height: 400, margin: '0 auto'}}></div>
          </RB.Col>
        </div>
}
})
