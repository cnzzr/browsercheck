/*!
 * jquery.ua.js
 * @author 云淡然 http://qianduanblog.com
 * @version 1.2
 */

/**
 * 1.0
 * 2013年10月9日22:22:40
 * 构建
 *
 * 1.1
 * 2013年11月20日10:43:16
 * 更新检测360浏览器规则
 *
 * 1.2
 * 2013年12月23日11:10:48
 * 更新到检测ie10+及兼容到ie6，更新检测chrome内核系列
 * 2014年3月12日20:36:17
 * 更新到检测360
 * 2014年3月15日20:14:08
 * 更加全面的特征检测浏览器
 * 2014年3月17日15:46:19
 * 修正了未判断 _mime 在ie8下的报错（海绵丢了宝贝  961862568）
 *
 * TODO：
 * 增加检测ie浏览器的兼容模式
 * 简化判断流程
 */


/**
 * 1. 获取ua字符串
 * $.ua().ua;
 *
 * 2. 设置ua字符串
 * $.ua("string");
 *
 * 3. 获取参数
 * $.ua().platform;
 * $.ua().browser;
 * $.ua().engine;
 *
 * 4. 内核判断
 * $.ua().isWebkit;
 * $.ua().isGecko;
 * $.ua().isTrident;
 *
 * 4. 外壳判断
 * $.ua().isChrome;
 * $.ua().isFirefox;
 * $.ua().is360se;
 * $.ua().is360ee;
 * $.ua().isLiebao;
 * $.ua().isSougou;
 * $.ua().ie;
 * $.ua().isIe;
 * $.ua().isIe6;
 * $.ua().isIe7;
 * $.ua().isIe8;
 * $.ua().isIe9;
 * $.ua().isIe10;
 * $.ua().isIe11;
 */

(function ($, win, undefined) {
	var UA = win.navigator.userAgent,
		doc = win.document,
		parseRule = _getRules(),
		// [10,)版本就无法判断
		ieVer = _getIeVersion(),
		ieAX = win.ActiveXObject,
		ieMode = doc.documentMode,
		isIe = ieAX || ieMode,
		isIe6 = (ieAX && ieVer == 6) || (ieMode == 6),
		isIe7 = (ieAX && ieVer == 7) || (ieMode == 7),
		isIe8 = (ieAX && ieVer == 8) || (ieMode == 8),
		isIe9 = (ieAX && ieVer == 9) || (ieMode == 9),
		isIe10 = ieMode === 10,
		isIe11 = ieMode === 11;

	if (isIe6) {
		ieVer = 6;
	} else if (isIe7) {
		ieVer = 7;
	} else if (isIe8) {
		ieVer = 8;
	} else if (isIe9) {
		ieVer = 9;
	} else if (isIe10) {
		ieVer = 10;
	} else if (isIe11) {
		ieVer = 11;
	}

	$.extend({
		ua: function () {
			var args = arguments,
				argL = args.length,
				ua = (argL == 1 && $.type(args[0]) == "string" ? args[0] : UA).toLowerCase(),
				objPlatform = _parse(parseRule.platforms, ua),
				objBrowser = _parse(parseRule.browsers, ua, true),
				objEngine = _parse(parseRule.engines, ua);

			return {
				// 返回ua字符串
				ua: ua,
				// 操作平台
				platform: $.extend({}, objPlatform, {
					os: win.navigator.platform.toLowerCase(),
					plugins: win.navigator.plugins
				}),
				// 浏览器外壳
				browser: objBrowser,
				// 浏览器内核
				engine: objEngine,
				// 内核
				isWebkit: !! objEngine.isWebkit,
				isGecko: !! objEngine.isGecko,
				isTrident: !! objEngine.isTrident,
				// 类型
				isMobile: objPlatform.isMobile,
				isTablet: objPlatform.isTablet,
				isDesktop: objPlatform.isDesktop,
				// chrome
				chromiumType: _getChromiumType(),
				isChrome: _getChromiumType() === 'chrome',
				is360ee: _getChromiumType() === '360ee',
				is360se: _getChromiumType() === '360se',
				isSougou: _getChromiumType() === 'sougou',
				isLiebao: _getChromiumType() === 'liebao',
				isFirefox: win.scrollMaxX !== undefined,
				// ie浏览器
				isIe: !! ieVer,
				isIe6: isIe6,
				isIe7: isIe7,
				isIe8: isIe8,
				isIe9: isIe9,
				isIe10: isIe10,
				isIe11: isIe11,
				ie: ieVer

			};
		}
	});



	/**
	 * 解析
	 * 参考：https://github.com/terkel/jquery-ua
	 * @param  {Array} 需要解析的数据
	 * @param  {String} 需要解析的ua字符串
	 * @param  {Boolean} 是否为解析浏览器数据
	 * @return {Object} 解析后的对象
	 * @version 1.0
	 * 2013年9月27日13:36:47
	 */

	function _parse(rule, ua, isBrowser) {
		var item = {},
			name,
			versionSearch,
			flags,
			versionNames,
			i,
			is,
			ic,
			j,
			js,
			jc;

		if (isBrowser && ieVer) {
			return {
				name: "ie",
				ie: true,
				version: ieVer,
				isIe: true
			}
		}

		for (i = 0, is = rule.length; i < is; i++) {
			ic = rule[i];
			name = ic.name;
			versionSearch = ic.versionSearch;
			flags = ic.flags;
			versionNames = ic.versionNames;
			if (ua.indexOf(name) !== -1) {
				item.name = name.replace(/\s/g, '');
				if (ic.slugName) {
					item.name = ic.slugName;
				}
				item["is" + _upperCase1st(item.name)] = true;
				item.version = ('' + (new RegExp(versionSearch + '(\\d+((\\.|_)\\d+)*)').exec(ua) || [, 0])[1]).replace(/_/g, '.');
				if (flags) {
					for (j = 0, js = flags.length; j < js; j++) {
						item["is" + _upperCase1st(flags[j])] = true;
					}
				}
				if (versionNames) {
					for (j = 0, js = versionNames.length; j < js; j++) {
						jc = versionNames[j];
						if (item.version.indexOf(jc.number) === 0) {
							item.fullname = jc.name;
							item["is" + _upperCase1st(item.fullname)] = true;
							break;
						}
					}
				}
				if (rule === parseRule.platforms) {
					item.isMobile = /mobile|phone/.test(ua) || item.isBlackberry;
					item.isMobile = item.isMobile === undefined ? false : true;

					item.isTablet = /tablet/.test(ua) || item.isIpad || (item.isAndroid && !/mobile/.test(ua));
					item.isTablet = item.isTablet === undefined ? false : true;

					if (item.isTablet) item.isMobile = false;

					item.isDesktop = !item.isMobile && !item.isTablet ? true : false;

					if (item.ios) {
						item.fullname = 'ios' + parseInt(item.version, 10);
						item["is" + _upperCase1st(item.fullname)] = true;
					}
				}
				break;
			}
		}
		if (!item.name) {
			item['isUnknown'] = true;
			item.name = '';
			item.version = '';
		}
		return item;
	}



	// 大写第一个字母

	function _upperCase1st(string) {
		return string.replace(/^(\w)/, function (w) {
			return w.toUpperCase()
		});
	}



	// 测试mime

	function _mime(where, value, name, nameReg) {
		var mimeTypes = win.navigator.mimeTypes,
			i;

		for (i in mimeTypes) {
			if (mimeTypes[i][where] == value) {
				if (name !== undefined && nameReg.test(mimeTypes[i][name])) return true;
				else if (name === undefined) return true;
			}
		}
		return false;
	}



	/**
	 * 获取 Chromium 内核浏览器类型
	 * @link http://www.adtchrome.com/js/help.js
	 * @link https://ext.chrome.360.cn/webstore
	 * @link https://ext.se.360.cn
	 * @return {String}
	 *         360ee 360极速浏览器
	 *         360se 360安全浏览器
	 *         sougou 搜狗浏览器
	 *         liebao 猎豹浏览器
	 *         chrome 谷歌浏览器
	 *         ""    无法判断
	 * @version 1.0
	 * 2014年3月12日20:39:55
	 */

	function _getChromiumType() {
		if (isIe || win.scrollMaxX !== undefined) return '';

		var isOriginalChrome = _mime("type", "application/vnd.chromium.remoting-viewer");

		// 原始 chrome
		if (isOriginalChrome) {
			return 'chrome';
		}
		// 谷歌、火狐、ie的某些版本也有 window.chrome 属性
		// 需先排除
		else if ( !! win.chrome) {
			var _track = "track" in doc.createElement("track"),
				_style = "scoped" in doc.createElement("style"),
				_v8locale = "v8Locale" in win;

			// 搜狗浏览器
			if ( !! win.external && !! win.external.SEVersion && !! win.external.Sogou404) return 'sougou';

			// 猎豹浏览器
			if ( !! win.external && !! win.external.LiebaoAutoFill_CopyToClipboard) return 'liebao';

			// 360极速浏览器
			if (_track && !_style && !_v8locale) return '360ee';

			// 360安全浏览器
			if (_track && _style && _v8locale) return '360se';

			return 'other chrome';
		}
		return '';
	}



	// 获得ie浏览器版本

	function _getIeVersion() {
		var v = 3,
			p = doc.createElement('p'),
			all = p.getElementsByTagName('i');
		while (
			p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]);
		return v > 4 ? v : 0;
	}




	// 解析规则

	function _getRules() {
		return {
			platforms: [
				// windows phone
				{
					name: 'windows phone',
					versionSearch: 'windows phone os ',
					versionNames: [ // windows phone must be tested before win
						{
							number: '7.5',
							name: 'mango'
						}
					]
				},
				// windows
				{
					name: 'win',
					slugName: 'windows',
					versionSearch: 'windows(?: nt)? ',
					versionNames: [{
						number: '6.2',
						name: 'windows 8'
					}, {
						number: '6.1',
						name: 'windows 7'
					}, {
						number: '6.0',
						name: 'windows vista'
					}, {
						number: '5.2',
						name: 'windows xp'
					}, {
						number: '5.1',
						name: 'windows xp'
					}, {
						number: '5.0',
						name: 'windows 2000'
					}]
				},
				// ipad
				{
					name: 'ipad',
					versionSearch: 'cpu os ',
					flags: ['ios']
				},
				// ipad and ipod must be tested before iphone
				{
					name: 'ipod',
					versionSearch: 'iphone os ',
					flags: ['ios']
				},
				// iphone
				{
					name: 'iphone',
					versionSearch: 'iphone os ',
					flags: ['ios']
				},
				// iphone must be tested before mac
				{
					name: 'mac',
					versionSearch: 'os x ',
					versionNames: [{
						number: '10.8',
						name: 'mountainlion'
					}, {
						number: '10.7',
						name: 'lion'
					}, {
						number: '10.6',
						name: 'snowleopard'
					}, {
						number: '10.5',
						name: 'leopard'
					}, {
						number: '10.4',
						name: 'tiger'
					}, {
						number: '10.3',
						name: 'panther'
					}, {
						number: '10.2',
						name: 'jaguar'
					}, {
						number: '10.1',
						name: 'puma'
					}, {
						number: '10.0',
						name: 'cheetah'
					}]
				},
				// android
				{
					name: 'android',
					versionSearch: 'android ',
					versionNames: [
						// android must be tested before linux
						{
							number: '4.1',
							name: 'jellybean'
						}, {
							number: '4.0',
							name: 'icecream sandwich'
						}, {
							number: '3.',
							name: 'honey comb'
						}, {
							number: '2.3',
							name: 'ginger bread'
						}, {
							number: '2.2',
							name: 'froyo'
						}, {
							number: '2.',
							name: 'eclair'
						}, {
							number: '1.6',
							name: 'donut'
						}, {
							number: '1.5',
							name: 'cupcake'
						}
					]
				},
				// blackberry
				{
					name: 'blackberry',
					versionSearch: '(?:blackberry\\d{4}[a-z]?|version)/'
				},
				// blackberry
				{
					name: 'bb',
					slugName: 'blackberry',
					versionSearch: '(?:version)/'
				},
				// blackberry
				{
					name: 'playbook',
					slugName: 'blackberry',
					versionSearch: '(?:version)/'
				},
				// linux
				{
					name: 'linux'
				},
				// nokia
				{
					name: 'nokia'
				}
			],
			browsers: [{
					name: 'iemobile',
					versionSearch: 'iemobile/'
				}, // iemobile must be tested before msie
				{
					name: 'msie',
					slugName: 'ie',
					versionSearch: 'msie '
				}, {
					name: 'firefox',
					versionSearch: 'firefox/'
				}, {
					name: 'chrome',
					versionSearch: 'chrome/'
				}, // chrome must be tested before safari
				{
					name: 'safari',
					versionSearch: '(?:browser|version)/'
				}, {
					name: 'opera',
					versionSearch: 'version/'
				}
			],
			engines: [{
					name: 'trident',
					versionSearch: 'trident/'
				}, {
					name: 'webkit',
					versionSearch: 'webkit/'
				}, // webkit must be tested before gecko
				{
					name: 'gecko',
					versionSearch: 'rv:'
				}, {
					name: 'presto',
					versionSearch: 'presto/'
				}
			]
		};
	}

})(jQuery, this);
