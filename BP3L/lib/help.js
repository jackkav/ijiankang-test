h.getDeviceInfo = ()=> {

    if (!window.device) return {} //浏览器 暂不考虑

    // let platform = window.device.platform
    // let model = window.device.model
    // let version = window.device.version
    //
    // let stringFiy = `设备型号 ${platform}; 设备品牌${model}; 设备版本${version}`

    return {...window.device}

}


h.getDeviceString = function (deviceInfo) {
    let str = deviceInfo.platform
        + '|' + deviceInfo.version
        + '|' + deviceInfo.manufacturer
        + '|' + deviceInfo.model
        + '|' + deviceInfo.serial
    return str
}
