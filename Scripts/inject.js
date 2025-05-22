var RB = RB || {};

RB.inject = (function () {
    var
        _initialize = function () {
            var _originalEnumerateDevices = window.navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);

            window.navigator.mediaDevices.enumerateDevices = _originalEnumerateDevices().then(function (devices) {

                

                if (devices.filter(d => d.label !== "").length === 0) {
                    return devices;
                }

                var
                    videoDevice = {
                        __proto__: InputDeviceInfo.prototype,
                        deviceId: "rtc-camera",
                        kind: "videoinput",
                        label: "RTC Camera",
                        groupId: "rtc-camera",
                        getCapabilities: function () {
                            return {
                                aspectRatio: { max: 2, min: 0.00001 },
                                deviceId: "rtc-camera",
                                facingMode: [],
                                frameRate: { max: 30, min: 1 },
                                groupId: "rtc-camera",
                                height: { max: 1080, min: 1 },
                                resizeMode: ["none", "crop-and-scale"],
                                width: { max: 1920, min: 1 }
                            };
                        },
                        toJSON: function () {
                            return {
                                __proto__: InputDeviceInfo.prototype,
                                deviceId: "rtc-camera",
                                kind: "videoinput",
                                label: "RTC Camera",
                                groupId: "rtc-camera",
                            }
                        }
                    };
                devices.push(videoDevice);
                return devices;
            });
        }
    return {
        initialize: _initialize,
    }
});