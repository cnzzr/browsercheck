var StatusNG = 0;
var StatusUP = 1;
var StatusOK = 2;

var IdxBrowser = 0;
var IdxJs      = 1;
var IdxCookie  = 2;
var IdxPopup   = 3;
var IdxFlash   = 4;
var IdxJre     = 5;

function showEachClientCheckResult() {
    browser_check.innerHTML = Msg[IdxBrowser][getBrowserStatus()];
    js_check.innerHTML      = Msg[IdxJs][StatusOK];
    cookie_check.innerHTML  = Msg[IdxCookie][getCookieStatus()];
    popup_check.innerHTML   = Msg[IdxPopup][getPopupStatus("../close_window.htm")];
    flash_check.innerHTML   = Msg[IdxFlash][getFlashStatus()];
    jre_check.innerHTML     = Msg[IdxJre][getJreStatus()];
}

function showOverallClientCheckResult(inMsg) {
    if (getBrowserStatus() < StatusOK
     || getCookieStatus()  < StatusOK
     || getPopupStatus("../htm/close_window.htm") < StatusOK
     || getFlashStatus()   < StatusOK
     || getJreStatus()     < StatusOK
    ) {
        client_check_link.innerHTML = inMsg;
        client_check_td_above.height = 20;
        client_check_td_below.height = 20;
    }
}

function getBrowserStatus() {
    var status = StatusNG;
    if (!checkBrowserName(" MSIE ") || !checkBrowserName("MSIE ") || !checkBrowserName("MSIE")) {
        status = StatusNG;
    } else {
        status = StatusOK;
    }
    return status;
}

function checkBrowserName(name) {
    var verStr = navigator.appVersion;
    var verNo = 0;
    var result = false;
    if (verStr.indexOf(name) != -1) {
        tempStr = verStr.split(name);
        verNo = parseFloat(tempStr[1]);
        if (verNo >= 6) {
            result = true;
        }
    }
    return result;
}

function getCookieStatus() {
    var status = StatusNG;
    var cookieStr = "wb_check=kcehc_bw";
    document.cookie = cookieStr;
    if (document.cookie.indexOf(cookieStr) > -1) {
        status = StatusOK;
        var date = new Date();
        date.setTime(date.getTime() - 1000);
        document.cookie = cookieStr + "; expires=" + date.toGMTString();
    }
    return status;
}

function getPopupStatus(winUrl) {
    var status = StatusNG;
    var str_feature = 'toolbar=no'
    + ',menubar=no'
    + ',scrollbars=no'
    + ',resizable=no'
    + ',status=no'
    + ',width=1'
    + ',height=1'
    + ',top=0'
    + ',left=0'
    + ',screenX=0'
    + ',screenY=0';
    var popup_win = window.open(winUrl, "wb_check", str_feature);
    if (popup_win) {
        status = StatusOK;
    }
    return status;
}

function getFlashStatus() {
    var MinVer = 7;
    var status = StatusNG;
    if (navigator.plugins && navigator.plugins.length && navigator.plugins.length > 0) {
        var flashObj = navigator.plugins["Shockwave Flash"];
        if (flashObj && flashObj.length && flashObj.length > 0) {
            var flashMimeObj = flashObj["application/x-shockwave-flash"];
            if (flashMimeObj) {
                var tempStr = flashObj.description.split(" Flash ");
                var verNo = parseFloat(tempStr[1]);
                if (verNo >= MinVer) {
                    status = StatusOK;
                } else {
                    status = StatusUP;
                }
            }
        }
    }
    if (status == StatusNG) {
        for (var i = MinVer; i > 0; i--) {
            try {
                var flashObj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                if (i == MinVer) {
                    status = StatusOK;
                } else {
                    status = StatusUP;
                }
                break;
            } catch(e) {
                status = StatusNG;
            }
        }
    }
    return status;
}

function getJreStatus() {
    var status = StatusNG;
    try {
        status = JREDetect.getStatus();
    } catch(e) {
        status = StatusNG;
    }
    return status;
}