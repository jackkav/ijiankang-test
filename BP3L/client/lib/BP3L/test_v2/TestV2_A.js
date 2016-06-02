//直连

class TestV2_A extends EventEmitter {


    constructor(props) {

        super(props)


        this.initEvent()
    }

    initEvent() {
        let self = this

        this.on('start', self.start)
        this.on('stop', self.stop)

    }

    _run(){
        let  self = this

        
        self.data={
            macId:self.deviceID,
            type: 1,
            deviceInfo: {...window.device},
            discoverInfo:{},
            connectInfo:{},    //连接信息
            measureInfo:{},
            timeInfo:{
                runsSartTime: +new Date(),
            }
        }


    }

    startByDiscoveryOne(deviceID) {

        let self = this

        self.log('startDiscovery'+ deviceID+' BP3L.appsecret:'+BP3L.appsecret)

        BpManagerCordova.startDiscovery((res)=> {
            let device = BP3L.parseJSON(res)

            self.log("startByDiscoveryOne 1st callback "+ res)

            if (device.msg == "Discovery") {

                if (device.address==deviceID && device.name === "BP3L" ) {

                    self.DiscoverySuccess = true

                    self.log("Discovery device success "+ device.address)

                    BpManagerCordova.stopDiscovery((res)=> {

                    })



                }

            } else if (device.msg == "DiscoveryDone") {

                self.log("DiscoveryDone")


                if (!self.DiscoverySuccess) {

                    if(self.discoveryTime > DISCOVERY_TIME){
                        setTimeout(()=> {
                            self.startByDiscoveryOne(deviceID)
                        }, 2000)
                        self.discoveryTime++

                    }else{

                        alert('Discovery Device failure '+ deviceID)

                    }


                }else{//发现设备

                    //开启直连
                    self._run()

                }

            }

        }, (res)=> {
            self.log(res)
        }, BP3L.appsecret)

    }

    connect() {

    }

    measure() {


    }

    start(deviceID) {

        let self = this
        self.deviceID = deviceID



    }

    stop() {

    }


}
this.TestV2_A = TestV2_A
