var RB = RB || {};

RB.dev = (function () {
    var _devConsoleLogMode,
        _devFileLogMode,
        _initialize = function (devConsoleLogMode, devFileLogMode) {
            _devConsoleLogMode = devConsoleLogMode;
            _devFileLogMode = devFileLogMode;
            _console().settings().setMode(devConsoleLogMode);
            _file().settings().setMode(devFileLogMode);
            _console().setDevLog();
            if (_devFileLogMode) _file().saveLog();
        },
        _console = function () {
            var
                _settings = function () {
                    var
                        _setMode = function (mode) {
                            _devConsoleLogMode = mode;
                        }
                    return {
                        setMode: _setMode,
                    };
                },
                _setDevLog = function () {
                    console.defaultInfo = console.info.bind(console);
                    console.info = function () {
                        if (_devConsoleLogMode) {
                            arguments[0] = "[DEV]" + arguments[0];
                            console.defaultInfo.apply(console, arguments);
                        }
                    }
                },
                _log = function (msg) {
                    console.info(msg);
                }
            return {
                settings: _settings,
                setDevLog: _setDevLog,
                log: _log,
            };
        },
        _file = function () {
            var
                _saveLog = function (data) {
                    alert("KODLANMADI DETAY _DE.JS");
                    var url = '@Url.Action("SaveLog")';
                    $.post(url, data, function (sonuc) {
                        console.log(sonuc);
                    }, 'JSON');
                },
                _settings = function () {
                    var
                        _setMode = function (mode) {
                            _devFileLogMode = mode;
                        }
                    return {
                        setMode: _setMode,
                    };
                }
            return {
                saveLog: _saveLog,
                settings: _settings,
            };
        }
    return {
        initialize : _initialize,
        console: _console,
        file: _file,
    };
});
