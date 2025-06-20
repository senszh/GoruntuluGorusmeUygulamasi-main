var RB = RB || {};
var hub;

RB.WebRtc = (function (connectionManager) {
    var _userModel = { id: "", username: "", hubId: "", onCall: false },
        _hubModel,
        _mediaStream,
        _videoTrack,
        _audioTrack,
        _devices,
        _cameras = new Array(),
        _initialize = function (RECEIVER_USER, SENDER_USER) {
            console.info("SIGNALR: initialize()!");
            _connect($.connection.goruntuluGorusmeHub, RECEIVER_USER, SENDER_USER);
        },
        _secondInitialize = function () {
            _setupUICallbacks().initialize();
            _setupStreamCallbacks().initialize();
            _setupHubCallbacks().initialize();
            _setupDevices().initialize();
        }

        _connect = function (hub, RECEIVER_USER, SENDER_USER) {
            console.info("SIGNALR: connect()!");
            // Sayfa yüklendiğinde SignalR bağlantı sorgusuna kullanıcı ID'si ekle
            var currentUserId = $("#currentUserId").val();
            $.connection.hub.qs = { userId: currentUserId };
            _hub().setHub(hub);
            $.connection.hub.start()
                .done(function () {
                    console.log("SIGNALR: connected to SignalR hub...connection id: " + _hub().getHubId());
                    //setuser
                    _setUserInfo(RECEIVER_USER);
                })
                .fail(function (event) {
                    console.log("SIGNALR: HUB CONNECTION ERROR");
                });
        },

        _setupHubCallbacks = function () {
            var
                _initialize = function () {
                    console.info("HUB: HUB CALBACKS IS READY");
                    hub = _hub().getHub();
                    _hasAlreadyRoom();
                    _connectedCall();
                    _reciveSignal();
                },
                _hasAlreadyRoom = function () {
                    console.info("HUB: HAS ALREADY ROOM(" + _user().getUsername() + ":" + _user().getHubId() + ")");
                    hub.on("hasAlreadyRoom", function () {
                        alert(_user().getUsername() + " Zaten senin bir odan var!");
                    });
                },
                _connectedCall = function () {
                    console.info("HUB: CONNECTEDROOM(" + _user().getUsername() + ":" + _user().getHubId() + ")");
                    hub.on("connectedRoom", function (RECEIVER_USER) {
                        connectionManager.initiateOffer(RECEIVER_USER, _mediaStream);
                        console.log('call accepted from: ' + RECEIVER_USER + '.  Initiating WebRTC call and offering my stream up...');
                    });
                },
                _reciveSignal = function () {
                    console.info("HUB: RECIVE SIGNAL(" + _user().getUsername() + ":" + _user().getHubId() + ")");
                    hub.on("receiveSignal", function (SENDER_USER, data) {
                        connectionManager.newSignal(SENDER_USER, data);
                    });
                }
            return {
                initialize: _initialize,
            }
        },

        _setupUICallbacks = function () {
            var mixer,
                a,
                recorder,
                recordedChunks = [],
                _initialize = function () {
                    console.info("UI: UI CALBACKS IS READY");
                    _camOpen();
                    _camClose();
                    _mute();
                },
                _camOpen = function () {
                    console.info("UI: Cam Open(" + _user().getUsername() + ")");
                    document.getElementById("camOpen").onclick = function () {
                        console.log("camOpen button clicked");
                        if (_mediaStream != null) {
                            console.log("Video track enabled");
                            _videoTrack.enabled = true;
                        } else {
                            if (navigator.mediaDevices.getUserMedia) {
                                var selectAudioBox = document.getElementById("audios");
                                var selectedAudioValue = selectAudioBox.options[selectAudioBox.selectedIndex].value;
                                var selectVideoBox = document.getElementById("cameras");
                                var selectedVideoValue = selectVideoBox.options[selectVideoBox.selectedIndex].value;
                                console.log("Requesting user media with audio:", selectedAudioValue, "video:", selectedVideoValue);
                                navigator.mediaDevices.getUserMedia({
                                    audio: { deviceId: selectedAudioValue },
                                    video: { deviceId: selectedVideoValue }
                                }).then(function (stream) {
                                    console.log("getUserMedia success", stream);
                                    _audioTrack = stream.getAudioTracks()[0];
                                    _videoTrack = stream.getVideoTracks()[0];
                                    _mediaStream = stream;

                                    document.getElementById("cam1").srcObject = stream;
                                    _cameras[0] = stream;

                                    // Assign to RB.WebRtc for external access
                                    RB.WebRtc.localStream = stream;

                                }).catch(function (err) {
                                    console.log("HATA!", err);
                                });
                            }
                        }
                    }
                },
                _camClose = function () {
                    console.info("UI: Cam Close(" + _user().getUsername() + ")");
                    document.getElementById("camClose").onclick = function () {
                        console.log("camClose button clicked");
                        if (_videoTrack) {
                            _videoTrack.enabled = false;
                            console.log("Video track disabled");
                        } else {
                            console.log("No video track to disable");
                        }
                    }
                },
                _mute = function () {
                    console.info("UI: Mute(" + _user().getUsername() + ")");
                    document.getElementById("mute").onclick = function () {
                        console.log("mute button clicked");
                        if (_audioTrack == null) {
                            console.log("No audio track to mute/unmute");
                            return;
                        }
                        _audioTrack.enabled = !_audioTrack.enabled;
                        if (_audioTrack.enabled) {
                            document.getElementById("mute").innerText = "Mute";
                            console.log("Audio unmuted");
                        }
                        else {
                            document.getElementById("mute").innerText = "Unmute";
                            console.log("Audio muted");
                        }
                    };
                }
            return {
                initialize: _initialize,
            }
        },

        _setupStreamCallbacks = function () {
            var
                _initialize = function () {
                    console.info("STREAM: STREAM CALBACKS IS READY");
                    connectionManager.initialize(_hub().getHub().server, _onReadyForStream, _onStreamAdded, _onStreamRemoved);
                },
                _onReadyForStream = function (connection) {
                    console.info("STREAM: onReadyForStream(" + _user().getUsername + ")");
                    // The connection manager needs our stream
                    // todo: not sure I like this

                    if (_mediaStream == undefined || _mediaStream == null) {
                        console.log("No media stream available for onReadyForStream");
                        hub.server.sendError(_user().getHubId(), "Karşı taraf kameranızı açmanızı bekliyor.");
                        return;
                    }

                    console.log("Adding local media stream to connection");
                    connection.addStream(_mediaStream);
                },
                _onStreamAdded = function (connection, event) {
                    console.info("STREAM: onStreamAdded(" + _user().getUsername + ")");
                    console.log('binding remote stream to the partner window');
                    if (event.stream.id != _mediaStream.id) {
                        _cameras.push(event.stream);
                        document.querySelector("#cam2").srcObject = event.stream;

                        // Assign to RB.WebRtc for external access
                        RB.WebRtc.remoteStream = event.stream;
                        console.log("Remote stream set on cam2 and RB.WebRtc.remoteStream");
                    }
                },
                _onStreamRemoved = function (connection, streamId) {
                    console.info("STREAM: _onStreamRemoved(" + _user().getUsername + ")");
                    // todo: proper stream removal.  right now we are only set up for one-on-one which is why this works.
                    for (var i = 0; i < _cameras.length; i++) {
                        if (_cameras[i].id === streamId) {
                            console.log("Removing stream with id:", streamId);
                            $("#cam" + (i + 1)).on("srcObject", null);
                            _cameras.splice(i, 1);
                            i--;
                        }
                    }
                }
            return {
                initialize: _initialize,
            };
        },

        _setupDevices = function () {
            var
                _initialize = function () {
                    _addInputDeviceOnOption();
                    //_addVirtualInputDevice();
                },
                _addInputDeviceOnOption = function () {
                    var _originalEnumerateDevices = window.navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                    window.navigator.mediaDevices.enumerateDevices = _originalEnumerateDevices().then(function (devices) {
                        for (var i = 0; i < devices.length; i++) {
                            var device = devices[i];
                            if (device.kind == "audioinput") {
                                var option = $("<option/>");
                                option.text(device.label);
                                option.val(device.deviceId);
                                option.appendTo("#audios");
                            }
                            if (device.kind == "videoinput") {
                                var option = $("<option/>");
                                option.text(device.label);
                                option.val(device.deviceId);
                                option.appendTo("#cameras");
                            }
                        }
                        _devices = devices;
                        return devices;
                    });
                },
                _addVirtualInputDevice = function () {
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
        },

        _setUserInfo = function (RECEIVER_USER) {
            console.info("SIGNALR: setUserInfo()!");
            _user().setId("TEMP");
            _user().setUsername(RECEIVER_USER);
            _user().setHubId(_hub().getHub());
            _user().setOnCall(false);
        },

        _hub = function () {
            var
                _setHub = function (hub) {
                    console.info("SIGNALR: setHub()!");
                    if (hub == null) {
                        console.error("SIGNALR: HUB CAN NOT NULL");
                        debugger;
                    }
                    if (_hubModel == null) {
                        console.log("SIGNALR: HUB IS CONNECTED!");
                    } else if (_hubModel != hub) {
                        console.log("SIGNALR: HUB IS CHANGED!");
                    }
                    _hubModel = hub;
                },
                _getHub = function () {
                    console.info("SIGNALR: getHub()!");
                    if (_hubModel == null) {
                        console.error("SIGNALR: HUB CAN NOT NULL");
                        debugger;
                    }
                    return _hubModel;
                }
            _getHubId = function () {
                console.info("SIGNALR: getHubId()!");
                return _getHub().connection.id;
            }
            return {
                setHub: _setHub,
                getHub: _getHub,
                getHubId: _getHubId,
            };
        },

        _user = function () {
            var
                _setId = function (id) {
                    console.info("MODEL: setId()!");
                    if (id == null) {
                        id = _hub.connection.id;
                    }
                    _userModel.id = id;

                    console.info("MODEL: _userModel.id set " + id + "!");
                },
                _getId = function () {
                    console.info("MODEL: getId()!");
                    return _userModel.id;
                },
                _setUsername = function (username) {
                    console.info("MODEL: setUsername()!");
                    if (username == "" || username == null) {
                        username = 'User ' + Math.floor((Math.random() * 10000) + 1);
                    }
                    _userModel.username = username;

                    console.info("MODEL: _userModel.username set " + username + "!");
                },
                _getUsername = function () {
                    console.info("MODEL: getUsername()!");
                    return _userModel.username;
                },
                _setHubId = function (hub) {
                    console.info("MODEL: setHubId()!");
                    console.info("MODEL: _userModel.hubId set " + hub.connection.id + "!");
                    _userModel.hubId = hub.connection.id;
                },
                _getHubId = function () {
                    console.info("MODEL: getHubId()!");
                    return _userModel.hubId;
                },
                _setOnCall = function (onCall) {
                    console.info("MODEL: setOnCall()!");
                    if (onCall == _userModel.onCall) {
                        console.log("MODEL: _userModel.onCall has not changed!");
                    } else {
                        console.log("MODEL:_userModel.onCall has changed ")
                        _userModel.onCall = onCall;
                    }
                    console.info("MODEL: _userModel.onCall set " + onCall + "!");
                },
                _getOnCall = function () {
                    console.info("MODEL: getOnCall()!");
                    return _userModel.onCall;
                }
            return {
                getUserModel: _userModel,
                setId: _setId,
                getId: _getId,
                setUsername: _setUsername,
                getUsername: _getUsername,
                setHubId: _setHubId,
                getHubId: _getHubId,
                setOnCall: _setOnCall,
                getOnCall: _getOnCall,
            };
        },

        _test = function () {
            return _hub().getHub();
        }
    
    //// Expose localStream and remoteStream for external access
    //RB.WebRtc.localStream = null;
    //RB.WebRtc.remoteStream = null;

    return {
        initialize: _initialize, // Starts the UI process
        secondInitialize: _secondInitialize,
        getStream: function () { // Temp hack for the connection manager to reach back in here for a stream
            return _mediaStream;
        },
        hub: _test,
        setupHubCallbacks: _setupHubCallbacks,
    };
})(RB.ConnectionManager);