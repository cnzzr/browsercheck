//检测过程中需要使用到的资源下载地址，如果IE8、自动修复工具等
var IeToolDownload = "http://mis.msdi.cn/Portal/install/Download.aspx?Id=MSDI_IETool.exe";

//检查项的中文名称
var CheckItemLang = {};
CheckItemLang["TrustWebsite"] = "可信站点";
CheckItemLang["Popup"] = "弹出窗口";
CheckItemLang["Cookies"] = "Cookies";
CheckItemLang["Javascript"] = "JS脚本";
CheckItemLang["Flash"] = "Flash播放器";
CheckItemLang["Sliverlight"] = "Silverlight插件";

//ActiveX信息
var ActiveX = [];

//受信站点的设置
var ZonesConfig = [];
ZonesConfig.push({ key: "Zones\\2", item: "1001", value: "0" }); //启用
ZonesConfig.push({ key: "Zones\\2", item: "1004", value: "0" });
ZonesConfig.push({ key: "Zones\\2", item: "1200", value: "0" });
ZonesConfig.push({ key: "Zones\\2", item: "1201", value: "0" });
ZonesConfig.push({ key: "Zones\\2", item: "1405", value: "0" });
ZonesConfig.push({ key: "Zones\\2", item: "2201", value: "0" });
ZonesConfig.push({ key: "Zones\\2", item: "1208", value: "0" });
ZonesConfig.push({ key: "Zones\\2", item: "2101", value: "0" });
ZonesConfig.push({ key: "Zones\\2", item: "2102", value: "0" });

ZonesConfig.push({ key: "Zones\\2", item: "1409", value: "3" }); //禁用


//检测其他域名的配置情况
var Domains = [];
//Domains.push({
//    key: "ZZR",
//    name:"本机测试 172.22.67.20",//显示的业务系统名称
//    checkUrl: "http://172.22.67.20:8044/ASM/bc/check.html", //业务系统中部署的代理检查页面
//    helpMsg:"电话技术支持3214",
//    helpUrl:"http://xxsq.msdi.cn/" //设置帮助地址，一般为Discuz
//});

Domains.push({
    key: "Portal",
    name:"应用集成门户",
    checkUrl: "http://zny.msdi.cn/tools/bc/check.html",
    helpMsg: "电话技术支持3214",
    helpUrl: "http://xxsq.msdi.cn/showtopic-784.aspx"
});

Domains.push({
    key: "coa",
    name:"新公文处理系统",
    checkUrl: "http://mis.msdi.cn:8080/coa/axis2-admin/bc/check.html",
    helpUrl: "http://xxsq.msdi.cn/showforum-20.aspx"
});

Domains.push({
    key: "PMIS",
    name: "生产管理信息系统",
    checkUrl: "http://pmis.msdi.cn:8088/CommonWebResource/bc/check.html",
    helpMsg: "电话技术支持3214",
    helpUrl: "http://xxsq.msdi.cn/showforum-18.aspx"
});
