

/*
    发现设备 然后连接设备  重复10次
    尝试发现设备5次 然后尝试连接设备5次

* */
// class TestV2_B extends EventEmitter {
//
//     constructor(options) {
//
//         super(options)
//
//         this.init(options)
//         this.initEvent()
//     }
//
//     init(options) {
//         let self = this
//
//         // 发现次数
//         self.DISCOVER_MAX_TIMES = options.DISCOVER_MAX_TIMES ||5
//
//         //最多连5次
//         self.CONNECT_MAX_TIMES = options.CONNECT_MAX_TIMES || 5
//
//         //null 代表无限次
//         self.RUN_MAX_TIMES = options.RUN_MAX_TIMES || null
//     }
//
//     initEvent() {
//         let self = this
//
//         this.on('start', self.start)
//         this.on('stop', self.stop)
//
//     }
//
//     log(value) {
//         console.log(value)
//         // this.reactiveInfo.set(value)
//     }
//
//
//     handleResult(resultType, data) {
//         let self = this
//
//         self.data.runResult = resultType
//
//         if (resultType == 'success') {
//             self.runSuccess++
//
//         } else {
//             self.runFailure++
//
//         }
//
//         self.runSum = self.runSuccess + self.runFailure
//
//
//         // self.updateReactiveData()
//         //
//         // self.saveData()
//
//
//         if (!self.RUN_MAX_TIMES || self.runSum < self.RUN_MAX_TIMES) {
//
//             self.restart()
//
//         }
//     }
//
//     discover(deviceId, maxTimes) {
//         let self = this
//
//         let num = 1
//
//
//         let tryDiscover = function () {
//             BP3L.discover(deviceId, function () {
//
//                 self.connect(deviceId, self.CONNECT_MAX_TIMES)
//
//             }, function (errorType, info) {
//                 //统信息
//
//                 if (num < maxTimes) {
//                     num++
//                     tryDiscover()
//
//                 } else {
//                     //failure
//                     alert('discover device failure')
//                 }
//
//
//             })
//         }
//         tryDiscover()
//
//     }
//
//     connect(deviceId, maxTimes) {
//
//         let num = 1
//         let tryConnect = function () {
//             BP3L.connect(deviceId, function (device) {
//
//                 //
//                 self.measure(deviceId)
//
//             }, function (errorType, info) {
//
//                 if (num < maxTimes) {
//                     num++
//                     tryConnect()
//
//                 } else {
//                     //failure
//
//                 }
//
//             })
//         }
//         tryConnect()
//
//     }
//
//     measure(deviceId) {
//         let self = this
//
//         BP3L.measure(deviceId, function (data) {
//             //success
//
//         }, function (errorType, info) {
//
//
//         }, function (processInfo) {
//
//
//         })
//
//     }
//
//
//     run(){
//
//
//
//     }
//
//     start(deviceId) {
//
//         let self = this
//         self.running = true
//
//         self.deviceId = deviceId
//
//         self.data = {
//             macId: self.deviceId,
//             type: 1,
//             deviceInfo: {...window.device},
//             discoverInfo: {},
//             connectInfo: {},    //连接信息
//             measureInfo: {},
//             timeInfo: {
//                 runSartTime: +new Date(),
//             }
//         }
//
//
//         self.discover(deviceId, self.DISCOVER_MAX_TIMES)
//
//     }
//
//     stop() {
//         var self = this
//         this.log('try to stop Test')
//
//         clearTimeout(self.nextStartTimer)
//
//         self.running = false
//
//     }
//
//     restart() {
//         let self = this;
//
//         //开始下一轮
//         if (self.running) {
//             clearTimeout(self.nextStartTimer)
//             self.nextStartTimer = setTimeout(function () {
//
//                 self.start()
//
//             }, 2000)
//         } else {
//             self.log('Test TestV2_A stopped')
//         }
//     }
//
// }
// this.TestV2_B = TestV2_A
