var data = { AD: "", DETAY: "", SEVIYE: "", USERNAME: "", HUB_ID: "" }
console.defaultLog = console.log.bind(console);
console.logs = [];
console.log = function () {
    // default &  console.log()
    console.defaultLog.apply(console, arguments);
    // new & array data
    console.logs.push(Array.from(arguments));
}

function logtest() {
    data.AD = "LOG";
    data.DETAY = "";
    for (i = 0; i < console.logs.length; i++) {
        data.DETAY += "\n" + console.logs[i];
    }
    data.SEVIYE = "-1";
    Log_kaydet(data);
}

window.onerror = function (hata, url, hataSatiri) {
    console.logs.push(url + "\n" + hataSatiri + "\n" + hata);
}
function Log_kaydet(data) {
    var url = '@Url.Action("SaveLog")';
    $.post(url, data, function (sonuc) {
        console.log(sonuc);
    }, 'JSON');
}