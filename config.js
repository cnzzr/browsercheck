//检测过程中需要使用到的资源下载地址，如果IE8、自动修复工具等



//检测其他域名的配置情况
var Domains = [];
Domains.push({
    key: "ZZR",
    name:"本机测试 172.22.67.20",//显示的业务系统名称
    checkUrl: "http://172.22.67.20:8044/tools/bc/check.html", //业务系统中部署的代理检查页面
    help:"" //设置帮助地址，一般为Discuz
});

//Domains.push({
//    key: "Portal",
//    name:"应用集成门户",
//    checkUrl: "http://zny.msdi.cn/tools/bc/check.html",
//    help: ""
//});

//Domains.push({
//    key: "Mis",
//    name:"综合管理信息系统",
//    checkUrl: "http://172.22.67.20:8044/tools/bc/check.html",
//    help: ""
//});

