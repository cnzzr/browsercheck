//输出日志及异常信息
if (!window.Silverlight) {
    window.Silverlight = {};
}

//////////////////////////////////////////////////////////////////
// isInstalled, checks to see if the correct version is installed
//////////////////////////////////////////////////////////////////
Silverlight.isInstalled = function (version) {
    console.log("检测Silverlight");
    var isVersionSupported = false;
    var container = null;

    try {
        var control = null;

        try {
            control = new ActiveXObject('AgControl.AgControl');
            if (version == null) {
                isVersionSupported = true;
            }
            else if (control.IsVersionSupported(version)) {
                isVersionSupported = true;
            }
            control = null;
        }
        catch (e) {
            var plugin = navigator.plugins["Silverlight Plug-In"];
            if (plugin) {
                if (version === null) {
                    isVersionSupported = true;
                }
                else {
                    var actualVer = plugin.description;
                    if (actualVer === "1.0.30226.2")
                        actualVer = "2.0.30226.2";
                    var actualVerArray = actualVer.split(".");
                    while (actualVerArray.length > 3) {
                        actualVerArray.pop();
                    }
                    while (actualVerArray.length < 4) {
                        actualVerArray.push(0);
                    }
                    var reqVerArray = version.split(".");
                    while (reqVerArray.length > 4) {
                        reqVerArray.pop();
                    }

                    var requiredVersionPart;
                    var actualVersionPart;
                    var index = 0;


                    do {
                        requiredVersionPart = parseInt(reqVerArray[index]);
                        actualVersionPart = parseInt(actualVerArray[index]);
                        index++;
                    }
                    while (index < reqVerArray.length && requiredVersionPart === actualVersionPart);

                    if (requiredVersionPart <= actualVersionPart && !isNaN(requiredVersionPart)) {
                        isVersionSupported = true;
                    }
                }
            }
        }
    }
    catch (e) {
        isVersionSupported = false;
        console.log("  异常：" + e);
    }
    if (container) {
        document.body.removeChild(container);
    }
    console.log("  检测结果：" + (isVersionSupported?"支持":"0"));
    return isVersionSupported;
};


function getCookieStatus() {
    console.log("检测Cookies");
    var status = StatusNG;
    var cookieStr = "wb_check=kcehc_bw";
    document.cookie = cookieStr;
    if (document.cookie.indexOf(cookieStr) > -1) {
        status = StatusOK;
        var date = new Date();
        date.setTime(date.getTime() - 1000);
        document.cookie = cookieStr + "; expires=" + date.toGMTString();
    }
    console.log("  检测结果：" + status);
    return status;
}

function getPopupStatus(winUrl) {
    console.log("检测是否允许弹出窗口 " + winUrl);
    var status = StatusNG;
    try {
        var str_feature = 'toolbar=no' + ',menubar=no' + ',scrollbars=no' + ',resizable=no' + ',status=no' + ',width=1' + ',height=1' + ',top=0' + ',left=0' + ',screenX=0' + ',screenY=0';
        var popup_win = window.open(winUrl, "wb_check", str_feature);
        if (popup_win) {
            status = StatusOK;
            Sys.popup = true; //浏览器允许弹窗
            Sys.popupIE = Sys.ie ? true : undefined;
        } else {
            if (Sys.trusted && getIePopup(window.location.hostname) == 2) {
                Sys.popupIE = true;
            }
        }
    } catch (e) { console.log("  异常：" + e); }
    console.log("  检测结果：" + status);
    return status;
}

function getIePopup(hostname) {
    console.log("检测弹出窗口");
    var status = StatusNG;
    try {
        var WshShell = new ActiveXObject("WScript.Shell");
        Sys.trusted = true; //记录“信任站点”检测结果

        var userPopup = WshShell.RegRead("HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Internet Explorer\\New Windows\\PopupMgr");
        if (userPopup == "1") { // 0关闭阻止、1打开
            if (hostname) {
                try {
                    var hostPopup = WshShell.RegRead("HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Internet Explorer\\New Windows\\Allow\\" + hostname);
                    Sys.popupIE = true; //允许指定域名弹出窗口
                    status = StatusOK;
                } catch (eAllow) {
                }
            }
        } else {
            Sys.popupIE = true; //允许弹出
            status = StatusOK;
        }
    }
    catch (e) {
        status = StatusNG;
        console.log("  异常：" + e);
    }
    console.log("  检测结果：" + status);
    return status;
}

function getFlashStatus() {
    console.log("检测Flash");
    var status = StatusNG;
    try {
        var MinVer = parseInt(FLASHMINVER);
        var UNDEF = "undefined",
                    OBJECT = "object",
                    SHOCKWAVE_FLASH = "Shockwave Flash",
                    SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
                    FLASH_MIME_TYPE = "application/x-shockwave-flash",
        //                EXPRESS_INSTALL_ID = "SWFObjectExprInst",
        //                ON_READY_STATE_CHANGE = "onreadystatechange",doc = document,
                    win = window,
                    nav = navigator,
                    plugin = false,
                    playerVersion = [0, 0, 0],
                    d = null,
                    ie = ! +"\v1" // feature detection based on Andrea Giammarchi's solution: http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
                    ;

        if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
            d = nav.plugins[SHOCKWAVE_FLASH].description;
            if (d && !(typeof nav.mimeTypes != UNDEF && nav.mimeTypes[FLASH_MIME_TYPE] && !nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)) { // navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin indicates whether plug-ins are enabled or disabled in Safari 3+
                plugin = true;
                ie = false; // cascaded feature detection for Internet Explorer
                d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                playerVersion[2] = /[a-zA-Z]/.test(d) ? parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
            }
        } else if (typeof win.ActiveXObject != UNDEF) {
            try {
                var a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                if (a) { // a will return null when ActiveX is disabled
                    d = a.GetVariable("$version");
                    if (d) {
                        ie = true; // cascaded feature detection for Internet Explorer
                        d = d.split(" ")[1].split(",");
                        playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                }
            } catch (e) {
            }
        }
        if (playerVersion[0] > 0 && playerVersion[0] < MinVer) {
            status = StatusNG;
        } else if (playerVersion[0] > 0 && playerVersion[0] >= MinVer) {
            status = StatusOK;
        }
    } catch (e) {
        console.log("  异常：" + e);
    }
    console.log("  检测结果：" + status);
    return status;
}

//需要在网页放置Applet（<applet codebase="../applet" name="JREDetect" id="JREDetect" width="0" height="0" code="JREDetect.class">）
function getJreStatus() {
    console.log("检测JRE");
    var status = StatusNG;
    try {
        status = JREDetect.getStatus();
    } catch (e) {
        status = StatusNG;
        console.log("  异常：" + e);
    }
    console.log("  检测结果：" + status);
    return status;
}

//检查信任站点
function getTrustWebsiteStatus() {
    console.log("检测可信站点");
    var status = StatusNG;
    try {
        var WshShell = new ActiveXObject("WScript.Shell");
        status = StatusOK;
        Sys.trusted = true; //记录“信任站点”检测结果
        try {
            //对于已经设置“受信站点”的环境，执行自动修复
            for (var ic = 0; ic < ZonesConfig.length; ic++) {
                var config = ZonesConfig[ic];
                var regPath = "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" +
                            "\\" + config.key + "\\" + config.item;
                var value = WshShell.RegRead(regPath);
                if (value != config.value) {
                    WshShell.RegWrite(regPath, config.value, "REG_DWORD");
                }
            }

        } catch (re) {
            console.log("  异常：" + re);
        }
    }
    catch (e) {
        status = StatusNG;
        console.log("  异常：" + e);
    }
    console.log("  检测结果：" + status);
    return status;
}

//检查选项 "允许由脚本初始化的窗口，没有大小和位置限制"
function getAllowFullSizeWindowStatus() {
    console.log("检测 允许由脚本初始化的窗口，没有大小和位置限制");
    var status = StatusNG;
    try {
        var WshShell = new ActiveXObject("WScript.Shell");
        var userMaxWin = WshShell.RegRead("HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\2102");
        var machineMaxWin = WshShell.RegRead("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Internet Settings\\Zones\\2\\2102");
        if (userMaxWin == "0" || machineMaxWin == "0") {
            status = StatusOK;
        }
    }
    catch (e) { console.log("  异常：" + e); }
    console.log("  检测结果：" + status);
    return status;
}

//检查IE7中 把弹出窗口设置为"由Internet Exporer决定如何打开弹出窗口"
function getDecidePopupByIEStatus() {
    console.log("检查IE7中 把弹出窗口设置为 由Internet Exporer决定如何打开弹出窗口");
    var status = StatusNG;
    var regPath = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\TabbedBrowsing\\PopupsUseNewWindow";
    try {
        var WshShell = new ActiveXObject("WScript.Shell");
        var userPopupUseNewWindow = WshShell.RegRead(regPath);
        try {
            if (userPopupUseNewWindow != "0") {
                WshShell.RegWrite(regPath, "0", "REG_DWORD");
                userPopupUseNewWindow = "0";
            }
        } catch (re) { }
        if (userPopupUseNewWindow == "0") {
            status = StatusOK;
        }
        else {
            status = StatusNG;
        }
    }
    catch (e) {
        status = StatusUP; //不是IE7不需检验
        console.log("  异常：" + e);
    }
    console.log("  检测结果：" + status);
    return status;
}

function getUrlDomain() {
    var arydomain = new Array(".com.cn", ".net.cn", ".org.cn", ".gov.cn", ".com", ".cn", ".net", ".cc", ".org", ".info", ".biz", ".tv");
    var domain = document.domain;
    var tmpdomain = "";
    for (var i = 0; i < arydomain.length; i++) {
        tmpdomain = arydomain[i];
        if (domain.indexOf(tmpdomain) != -1) {
            domain = domain.replace(tmpdomain, "");
            domain = domain.substring(domain.lastIndexOf(".") + 1, domain.length);
            domain = domain + tmpdomain;
            break;
        }
    }
    return domain;
}