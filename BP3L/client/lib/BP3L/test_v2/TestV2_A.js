//直连


/*
 发现一次设备后 连接失败后继续直连
 * */


class TestV2_A extends EventEmitter {

    constructor(options) {

        super(options)

        this.init(options || {})
        this.initEvent()
    }

    init(options) {
        console.log('>>init')

        let self = this

        // 发现次数
        self.DISCOVER_MAX_TIMES = options.DISCOVER_MAX_TIMES || 5

        //最多连5次
        self.CONNECT_MAX_TIMES = options.CONNECT_MAX_TIMES || 10

        //null 代表无限次
        self.RUN_MAX_TIMES = options.RUN_MAX_TIMES || null


        self.DISCOVER_AND_CONNECT_TIMES = options.DISCOVER_AND_CONNECT_TIMES || 10


        self.runSuccess = 0
        self.runFailure = 0
        self.runSum = 0


        self.rCommonLog = new ReactiveVar('')
        self.rCommonInfo = new ReactiveVar({})

    }

    resetRData() {
        let self = this
        self.runSum = 0

        self.rCommonLog.set('')
        self.rCommonInfo.set({})
    }

    log(info) {

        // let arr=[]
        // if(arguments.length>1){
        //   for(let i=0;i<arguments.length;i++){
        //     arr[i] =arguments[i]
        //   }
        // }
        // let info = arr.join(' ')

        let args = [].slice.apply(arguments)
        console.log(info, args)

        this.rCommonLog.set(info)

        // let self =this;
        //
        // let logArr = self.rCommonLog.get()
        // logArr.unshift(info)
        //
        // logArr = logArr.slice(0,10)
        //
        // self.rCommonLog.set(logArr)
    }

    updateCommonInfo(setObj) {
        let self = this
        let info = self.rCommonInfo.get()
        let newInfo = {}
        info = Object.assign(newInfo, info, setObj)

        self.rCommonInfo.set(newInfo)
    }


    initEvent() {
        this.log('>>initEvent', 'fassfas ===', 'fasdfa')

        let self = this

        this.on('start', self.start)
        this.on('stop', self.stop)

    }

    // log(value,value2,value3,value4) {
    //
    //     console.log(value,value2,value3,value4)
    //     // this.reactiveInfo.set(value)
    // }


    discover(deviceId, maxTimes) {
        this.log('>>discover: ' + deviceId + ' try maxTimes: ' + maxTimes)

        let self = this

        let num = 1

        let tryDiscover = function () {
            self.data.timeInfo['discoveryStartTime_' + num] = +new Date()


            BP3L.discover(deviceId, function (data) {
                self.data.discoverInfo.push({
                    type: 'success',
                    data: data
                })

                self.data.timeInfo['discoverSuccessTime_' + num] = +new Date()

                self.connect(deviceId, self.CONNECT_MAX_TIMES)

            }, function (errorType, info) {
                self.data.discoverInfo.push({
                    type: 'failure',
                    errorType: errorType,
                    info: info
                })

                //统信息
                if (errorType == 'discover_failure') {
                    self.data.timeInfo['discoveryFailureTime_' + num] = +new Date()

                } else if (errorType == 'discover_error') {
                    self.data.timeInfo['discoverErrorTime_' + num] = +new Date()

                }

                if (num < maxTimes) {
                    num++
                    tryDiscover()

                } else {
                    //failure
                    BP3L.say('直连测试 未发现设备')
                    alert('discover device failure')

                    //重置？todo
                    self.resetRData()
                }


            })
        }
        tryDiscover()

    }

    //直连
    connect(deviceId, maxTimes) {
        let self = this
        this.log('>>connect', deviceId, maxTimes)

        let num = 1
        let tryConnect = function () {
            self.data.timeInfo['connectStartTime_' + num] = +new Date()
            BP3L.connect(deviceId, function (device) {
                self.data.timeInfo['connectSuccessTime_' + num] = +new Date()

                self.data.connectInfo.push({
                    type: 'success',
                    device: device,
                    startTime: self.data.timeInfo['connectStartTime_' + num],
                    endTime: self.data.timeInfo['connectSuccessTime_' + num]
                })

                self.data.resultInfo.connectStatus = 'success'


                //添加连接成功时所花费的时间 connectSuccessTime 方便查询
                self.data.resultInfo.connectSuccessTime = self.data.timeInfo['connectSuccessTime_' + num]- self.data.timeInfo['connectStartTime_' + num]


                self.detectDisconnect(deviceId)

                //
                self.measure(deviceId)

            }, function (errorType, info) {


                let endTime = +new Date()
                if (errorType == 'connect_timeout') {
                    self.data.timeInfo['connectTimeout_' + num] = endTime

                } else if (errorType == 'connect_failure') {
                    self.data.timeInfo['connectFailureTime_' + num] = endTime

                } else if (errorType == 'connect_error') {
                    self.data.timeInfo['connectErrorTime_' + num] = endTime

                }

                self.log('connect failure ' + num + 'times, errorType:' + errorType)
                self.data.connectInfo.push({
                    type: 'failure',
                    errorType: errorType,
                    info: info,
                    startTime: self.data.timeInfo['connectStartTime_' + num],
                    endTime: endTime
                })

                if (num < maxTimes) {
                    num++

                    setTimeout(()=> {
                        tryConnect()  //连接失败后 直连
                    }, 2000)


                } else {
                    //failure
                    self.onTestEnd('connectFailure')
                }

            })
        }
        tryConnect()

    }

    //发现－连
    discoverAndConnect(deviceId, maxTimes) {
        this.log('>>discoverAndConnect')
        let self = this
        let num = 1
        let discoverFailureTimes = 0
        let connectFailureTimes = 0

        let tryDiscoverAndConnect = function () {
            self.data.timeInfo['discoveryStartTime_' + num] = +new Date()
            BP3L.discover(deviceId, function (data) {

                let endTime = +new Date()
                self.data.timeInfo['discoverSuccessTime_' + num] = endTime

                self.data.timeInfo['connectStartTime_' + num] = endTime

                self.data.discoverInfo.push({
                    type: 'success',
                    data: data,
                    startTime: self.data.timeInfo['discoveryStartTime_' + num],
                    endTime: endTime
                })

                BP3L.connect(deviceId, function (device) {
                    let endTime = +new Date()
                    self.data.timeInfo['connectSuccessTime_' + num] = endTime

                    self.data.connectInfo.push({
                        type: 'success',
                        device: device,
                        startTime: self.data.timeInfo['connectStartTime_' + num],
                        endTime: endTime
                    })

                    self.data.resultInfo.connectStatus = 'success'

                    self.detectDisconnect(deviceId)
                    //
                    self.measure(deviceId)

                }, function (errorType, info) {
                    connectFailureTimes++

                    let endTime = +new Date()

                    if (errorType == 'connect_timeout') {
                        self.data.timeInfo['connectTimeout_' + num] = endTime

                    } else if (errorType == 'connect_failure') {
                        self.data.timeInfo['connectFailureTime_' + num] = endTime

                    } else if (errorType == 'connect_error') {
                        self.data.timeInfo['connectErrorTime_' + num] = endTime
                    }

                    self.data.connectInfo.push({
                        type: 'failure',
                        errorType: errorType,
                        info: info,
                        startTime: self.data.timeInfo['connectStartTime_' + num],
                        endTime: endTime
                    })

                    if (num < maxTimes) {
                        num++

                        setTimeout(()=> {
                            tryDiscoverAndConnect()  //连接失败后 直连
                        }, 2000)


                    } else {
                        //failure
                        self.onTestEnd('discoverFailure', {
                            discoverFailureTimes: discoverFailureTimes,
                            connectFailureTimes: connectFailureTimes
                        })
                    }

                })

            }, function (errorType, info) {

                let endTime = +new Date()
                self.data.discoverInfo.push({
                    type: 'failure',
                    errorType: errorType,
                    info: info,
                    startTime: self.data.timeInfo['discoveryStartTime_' + num],
                    endTime: endTime
                })

                discoverFailureTimes++
                if (errorType == 'discover_failure') {
                    self.data.timeInfo['discoveryFailureTime_' + num] = +new Date()

                } else if (errorType == 'discover_error') {
                    self.data.timeInfo['discoverErrorTime_' + num] = +new Date()

                }
                if (num < maxTimes) {
                    num++

                    setTimeout(()=> {
                        tryDiscoverAndConnect()  //连接失败后 直连
                    }, 2000)


                } else {
                    //failure
                    self.onTestEnd('connectFailure', {
                        discoverFailureTimes: discoverFailureTimes,
                        connectFailureTimes: connectFailureTimes
                    })
                }


            })

        }
        tryDiscoverAndConnect()


    }

    measure(deviceId) {
        this.log('>>measure')
        let self = this

        self.data.timeInfo['measureStartTime'] = +new Date()

        BP3L.measure(deviceId, function (data) {
            self.data.timeInfo['measureDoneTime'] = +new Date()

            self.data.measureInfo = data
            //success
            BP3L.disconnectDevice(deviceId)


        }, function (errorType, info) {

            self.data.measureInfo = info

            BP3L.disconnectDevice(deviceId)

            if (errorType == 'measure_failure') {
                self.data.timeInfo['measureFailureTime'] = +new Date()

            } else if (errorType == 'measure_error') {
                self.data.timeInfo['measureErrorTime'] = +new Date()

            }

        }, function (processInfo) {
            console.log(processInfo)

        })

    }

    detectDisconnect(deviceId) {
        this.log('>>detectDisconnect')

        let self = this;
        BP3L.detectDisconnect(deviceId, function (data) {
            //disconnect happen
            self.data.timeInfo['disconnectSuccessTime'] = +new Date()

            self.data.disconnectInfo.push(data)
            //连接断开 测量过程断开 或测量结束断开

            self.onTestEnd('disconnectSuccess')

        }, function (errorType, info) {

            if (errorType == 'disconnectCallback_failure') {
                self.data.timeInfo['disconenctFailureTime'] = +new Date()

            }
            self.onTestEnd('disconenctFailure')

        })
    }


    //////////////////////////////////
    start(deviceId, testType) {
        this.log('>>start', deviceId, testType)

        let self = this
        self.running = true
        self.DEVICE_ID = deviceId
        self.TEST_TYPE = testType

        self.data = {
            macId: self.DEVICE_ID,
            testType: self.TEST_TYPE,
            mobileInfo: {...window.device},
            //status:'uncompleted',
            timeInfo: {
                runSartTime: +new Date(),
            },
            discoverInfo: [],
            connectInfo: [],    //连接信息
            disconnectInfo: [],
            measureInfo: {},
            resultInfo: {
                //endType
                //connectStatus
            }

        }

        self.runSum++
        self.updateCommonInfo({'runSum': self.runSum})

        //记录测试次数

        if (self.TEST_TYPE == 1) {
            //直连需 先发现一台设备
            self.discover(deviceId, self.DISCOVER_MAX_TIMES)
        } else if (self.TEST_TYPE == 2) {
            self.discoverAndConnect(deviceId, self.DISCOVER_AND_CONNECT_TIMES)
        }


    }

    stop() {
        var self = this
        this.log('>>stop: try to stop Test')

        clearTimeout(self.nextStartTimer)

        self.running = false

    }

    onTestEnd(endType, detail) {
        this.log('>>onTestEnd')

        let self = this;
        self.data.timeInfo['runEndTime'] = +new Date()

        self.data.resultInfo.endType = endType
        self.data.resultInfo.endDetail = detail


        console.log(self.data)
        //save data

        DB.TestV2001.insert(self.data, function (error, id) {
            if (error) {
                console.error(error)
            }

            //开始下一轮
            if (self.running) {
                clearTimeout(self.nextStartTimer)
                self.nextStartTimer = setTimeout(function () {

                    self.start(self.DEVICE_ID, self.TEST_TYPE)

                }, 5000)
            } else {
                self.log('Test TestV2_A stopped')
            }

        })


    }

}
this.TestV2_A = TestV2_A
