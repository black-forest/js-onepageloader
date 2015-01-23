var onePageLoader = function () {
	var _option = {
		siteName: 'site',
		siteElement: 'section',
		smoothScroll: true,
		scrollDuration: 2000,
		scrollOffset: 0,
		body: '#main',
		displayBefore: true, /** display Sites before if this without Sites **/
		activePage: '', /** active Page prop **/
		scrollEasing: 'easeInOutQuint', /** easing for Smooth Scroll **/
		sitesBefore: '', /** add Sites before **/ /** TODO: add Sites Before **/
		sitesAfter: '', /** add Sites after **/ /** TODO: add Sites After **/
		inViewSection: '', /** TODO: inView Section **/
		outViewSection: '', /** TODO: outView Section **/
		watchOffsetY: 0,
		minHeightLastSection: true,
		scrollToActivePage: true,
		activateAnalytics: false,
		analyticMethods: {
			pushPageAs: 'href', /** or hash **/
			timeOut: 1500, /** the time the user in the parting guests want to push the analysis code **/
			ga: {
				name: 'Google Analytics',
				object: '_gaq',
				track: function (page) {
					if (window[_option.analyticMethods.ga.object] != undefined) {
						window[_option.analyticMethods.ga.object].push(['_trackPageview', page]);
					}
				}

			},
			piwik: {
				name: 'PIWIK Analytics',
				object: 'piwikTracker',
				track: function (page) {
					if (window[_option.analyticMethods.piwik.object] != undefined) {
						window[_option.analyticMethods.piwik.object].trackPageView(page);
					}
				}
			}
		},
		complete: function () {
		}
	};


	var requests = 1,
		scrollToSpan,
		_cache = [];


	function _setOption(option) {
		for (var prop in option) {
			_option[prop] = option[prop];
		}

		typeof _option.body === 'string' ? _option.body = document.body.querySelectorAll(_option.body) : '';

		_option.body.selector === undefined ? _option.body.selector = _getSelector(_option.body) : '';
	}


	function _each(obj, callback) {
		if (!obj.length) {
			for (var prop in obj) {
				callback.call(obj[prop], prop, obj[prop]);
			}
		} else {
			for (var i = 0; i <= obj.length - 1; i++) {
				callback.call(obj[i], i, obj[i]);
			}
		}
		return obj;
	}


	function _getSelector(node) {

		var path;

		while (node.length) {


			var realNode = node[0],
				name = (

					// IE9 and non-IE
				realNode.localName ||

					// IE <= 8
				realNode.tagName || realNode.nodeName

				);

			// on IE8, nodeName is '#document' at the top level, but we don't need that
			if (!name || name === '#document') break;

			name = name.toLowerCase();

			if (realNode.id) {

				// As soon as an id is found, there's no need to specify more.
				return name + '#' + realNode.id + (path ? '>' + path : '');
			}

			var parent = realNode.parentNode;
			var siblings = [];
			_each(parent.children, function () {
				this.tagName == name ? siblings.push(this) : '';
			});

			siblings.length > 1 ? name += ':eq(' + siblings.index(node) + ')' : '';

			path = name + (path ? '>' + path : '');

			node = parent;
		}

		return path;
	}


	function _setSites(obj, pos) {
		if (!pos) pos = 'main';
		var items = [],
			item,
			key,
			i;
		switch (pos) {
			case 'before':
				if (obj[0].tagName != 'a') {
					for (i = 0; i <= obj.length - 1; i++) {
						item = obj[i].querySelectorAll('a');
						for (key in item) {
							items.push(item[key]);
						}
					}
					obj = items
				}
				return _parseSites(obj);
				break;
			case 'after':
				if (obj[0].tagName != 'a') {
					for (i = 0; i <= obj.length - 1; i++) {
						item = obj[i].querySelectorAll('a');
						for (key in item) {
							items.push(item[key]);
						}
					}
					obj = items
				}
				onePageLoader.sitesAfter = _parseSites(obj);
				break;
			default :
				_cache.mainSites = _parseSites(obj.querySelectorAll('a, span'));
		}
		return false;
	}


	function _parseSites(obj) {
		var sites = [];
		_each(obj, function () {
			this.href && !this.hash ? sites.push(this) : '';

			this.tagName === 'SPAN' && this.className.search('active') > -1 ? sites.push(this) : '';
		});
		return sites;
	}


	function _getSites() {
		var arr,
			obj = [];
		/** TODO: Sites before **/
		/*if (onePageLoader.option.sitesBefore) {
		 for (var i = 0; i <= onePageLoader.option.sitesBefore.length - 1; i++) {
		 var items = _setSites(onePageLoader.option.sitesBefore, 'before');
		 for (var item in items) obj.push(items[item]);
		 }
		 }*/
		if (arr = _cache.mainSites) {
			_each(arr, function () {
				obj.push(addOnePage(this));
			});
		}
		/** TODO: Sites after **/
		/*if (onePageLoader.option.sitesAfter) {
		 for (var i = 0; i <= onePageLoader.option.sitesAfter.length - 1; i++) {
		 _setSites(onePageLoader.option.sitesBefore, 'after');
		 obj.push(onePageLoader.sitesAfter[i]);
		 }
		 }*/
		_cache.sites = obj;


		function addOnePage(el) {
			el.onePage = {
				href: '#' + _resolveString(_option.siteName + '_' + el.innerHTML.replace(' ', '_').toLowerCase()),
				section: document.createElement(_option.siteElement)
			};
			el.onePage.section.id = el.onePage.href.replace('#', '');
			el.onePage.section.className = _option.siteName + '_container';

			el.tagName === 'SPAN' ? entryPage(el) : '';

			return el;
		}

		function entryPage(el) {
			var move = _option.body[0].children[0];
			move.parentNode.removeChild(move);

			el.onePage.section.appendChild(move);

			_option.smoothScroll ? _initSmoothScroll(el) : '';

			_option.smoothScroll ? scrollToSpan = el : '';
		}
	}


	function _addContainer(i, el) {
		if (!el.hash) {
			el.hash = el.onePage.href;
			_option.body[0].appendChild(el.onePage.section);

			el.tagName === 'A' ? control() : '';

			if (i === _cache.sites.length - 1 && typeof move != 'object') {
				//_handleDisplayBefore(_option.body[0], site, siteId);
			}
		} else {
			//onePageLoader.sites.splice(i, 1);
		}


		function control() {
			_loadSite(el, function (el, html, complete) {
				_each(html.getElementsByTagName('script'), function () {
					this ? _parseSources(this) : '';
				});

				_each(html.getElementsByTagName('style'), function () {
					this ? _parseSources(this) : '';
				});

				_each(html.getElementsByTagName('link'), function () {
					this ? _parseSources(this) : '';
				});

				_option.smoothScroll ? _initSmoothScroll(el) : false;

				el.onePage.section.appendChild(html.querySelector(_option.body.selector).children[0]);

				complete === true ? _loadSources() : '';
			});
		}
	}


	function _resolveString(string) {
		var areaReplace = {
			0: [/Ü/g, 'Ue'],
			1: [/ü/g, 'ue'],
			2: [/Ö/g, 'Oe'],
			3: [/ö/g, 'oe'],
			4: [/Ä/g, 'Ae'],
			5: [/ä/g, 'ae'],
			6: [/ß/g, 'ss']
		};

		for (var prop in areaReplace) {
			var row = areaReplace[prop];
			string = string.replace(row[0], row[1]);
		}

		return string;
	}


	function _handleDisplayBefore(body, site, siteId) {
		if (_option.displayBefore) {
			var firstEl = document.querySelector(_option.body.selector + ' ' + _option.siteElement),
				parentEL = firstEl.parentNode;
			move = body.children[0];
			move.parentNode.removeChild(move);
			site = document.createElement(_option.siteElement);
			siteId = location.href.split('/');
			siteId = siteId[siteId.length - 1];
			if (siteId.search('\/?') > -1) siteId = siteId.split('?')[0];
			if (siteId.search('.') > -1) siteId = siteId.split('.')[0];
			site.id = _option.siteName + '_' + siteId.replace('-', '_');
			site.className = _option.siteName + '_container';
			site.appendChild(move);
			parentEL.insertBefore(site, firstEl);
		} else {
			var remove = body.children[0];
			remove.parentNode.removeChild(remove);
		}
	}


	function _loadSources() {
		var head,
			body;

		_cache.loadSources && _cache.loadSources.script ? control(_cache.loadSources.script) : '';
		_cache.loadSources && _cache.loadSources.style ? control(_cache.loadSources.style) : '';
		_cache.loadSources && _cache.loadSources.link ? control(_cache.loadSources.link) : '';

		interval();


		function control(sources) {

			if (sources.length > 0) {
				for (var source in sources) {
					var row;

					row = clone(sources[source]);

					row.src || row.href ? insertHead(row) : '';
					!row.src && !row.href ? collectBody(row) : '';
				}
			}
		}


		function insertHead(insert) {
			head = head || document.getElementsByTagName('head')[0];

			head.appendChild(insert);
		}


		function collectBody(insert) {
			body = body || document.getElementsByTagName('body')[0];
			var type = insert.tagName.toLowerCase();

			_cache.insert = _cache.insert || {};
			_cache.insert.body = _cache.insert.body || {};
			_cache.insert.body[type] = _cache.insert.body[type] || [];
			_cache.insert.body[type].push(insert);
		}


		function insertBody() {
			if (_cache.insert && _cache.insert.body) {
				_cache.insert.body.style && _cache.insert.body.style.length > 0 ? control(_cache.insert.body.style) : '';
				_cache.insert.body.link && _cache.insert.body.link.length > 0 ? control(_cache.insert.body.link) : '';
				_cache.insert.body.script && _cache.insert.body.script.length > 0 ? control(_cache.insert.body.script) : '';

				onePageLoader.complete();
			} else {
				onePageLoader.complete();
			}


			function control(elements) {
				_each(elements, function (i, el) {
					el.tagName === 'STYLE' || el.tagName === 'LINK' ? insertHead(el) : '';
					el.tagName === 'SCRIPT' ? eval(el.text) : '';
				});
			}
		}


		function interval() {
			isNaN(loadDurration().returnTime()) ? loop() : stop();


			function loop() {
				setTimeout(function () {
					interval();
				}, 500);
			}


			function stop() {
				var time = loadDurration().returnTime();

				time > 19999 ? time /= 10 : '';
				time > 9999 ? time /= 10 : '';
				time > 7999 ? time /= 4 : '';

				setTimeout(function () {
					insertBody();
				}, time);
			}
		}


		function clone(el) {
			var element = document.createElement(el.tagName);

			el.src ? element.src = el.src : '';
			el.href ? element.href = el.href : '';
			el.text ? element.text = el.text : '';

			element.async ? element.async = true : '';

			return element;
		}
	}


	function _parseSources(source) {
		if (!source.tagName) return false;

		var type = source.tagName.toLowerCase();
		if (!_cache.document || !_cache.document[type]) {
			_cache.document = _cache.document || {};

			if (!_cache.document[type]) {
				_cache.document[type] = [];
				_each(document.getElementsByTagName(type), function () {
					var prop = this.href || this.src || this.innerHTML;
					var hash = _md5(prop);

					_cache.document[type][hash] = this;
					_cache.document[type].length++;
				});
			}
		}

		if (!_cache.loadSources || !_cache.loadSources[type]) {
			_cache.loadSources = _cache.loadSources || [];
			_cache.loadSources[type] = [];
		}

		var search = source.href || source.src || source.innerHTML;
		var hash = _md5(search);


		if (!_cache.document[type][hash] && !_cache.loadSources[type][hash]) {
			_cache.loadSources[type][hash] = source;
			_cache.loadSources[type].length++;
		}
	}


	function _md5(string) {
		function RotateLeft(lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		}

		function AddUnsigned(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x, y, z) {
			return (x & y) | ((~x) & z);
		}

		function G(x, y, z) {
			return (x & z) | (y & (~z));
		}

		function H(x, y, z) {
			return (x ^ y ^ z);
		}

		function I(x, y, z) {
			return (y ^ (x | (~z)));
		}

		function FF(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function GG(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function HH(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function II(a, b, c, d, x, s, ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		}

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		}

		function WordToHex(lValue) {
			var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
			}
			return WordToHexValue;
		}

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}

			return utftext;
		}

		var x = Array();
		var k, AA, BB, CC, DD, a, b, c, d;
		var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
		var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
		var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
		var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301;
		b = 0xEFCDAB89;
		c = 0x98BADCFE;
		d = 0x10325476;

		for (k = 0; k < x.length; k += 16) {
			AA = a;
			BB = b;
			CC = c;
			DD = d;
			a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = AddUnsigned(a, AA);
			b = AddUnsigned(b, BB);
			c = AddUnsigned(c, CC);
			d = AddUnsigned(d, DD);
		}

		var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);

		return temp.toLowerCase();
	}


	function _addClass(el, string) {
		el.classList != undefined ? el.classList.add(string) : fallback();

		function fallback() {
			var classList = el.className.split(' ');
			var isSet = false;

			_each(classList, function () {
				if (this === string) isSet = true;
			});

			isSet === false ? classList.push(string) : '';

			el.className = classList.join(' ');
		}
	}


	function _removeClass(el, string) {
		el.classList != undefined ? el.classList.remove(string) : fallback();

		function fallback() {
			var classList = el.className.split(' ');
			var newClassList = [];

			_each(classList, function () {
				this != string ? newClassList.push(this) : '';
			});

			el.className = newClassList.join(' ');
		}
	}


	function _viewInSection() {
		var lastView = location.href;

		_each(_cache.sites, function () {
			this.href === location.href ? _addClass(this.onePage.section, 'active') : '';
		});

		var control = function () {
			_each(_cache.sites, function () {
				if (this.href != lastView) {
					switch (_isView(this.onePage.section)) {
						case true:
							_addClass(this, 'active');
							_addClass(this.parentNode, 'active');
							_addClass(this.onePage.section, 'active');

							lastView = this.href;
							break;
						case false:
							_removeClass(this, 'active');
							_removeClass(this.parentNode, 'active');
							_removeClass(this.onePage.section, 'active');
							break;
						default:
							break;
					}
				}
			});
		};

		_bind(window, 'scroll', function () {
			control();
		});
	}


	function _pushAnalytics() {
		var lastPush = location.href;

		var track = function (page) {
			for (var method in _option.analyticMethods) {
				if (_option.analyticMethods[method].object != undefined && _option.analyticMethods[method].track != undefined) {
					_option.analyticMethods[method].track(page);
				}
			}
		};

		var getPage = function (el) {

			if (_option.analyticMethods.pushPageAs == 'hash') {
				return el.onePage.href;
			}

			var page = el.href || location.href;
			page = page.split('/').slice(3, page.length).join('/');

			return page;
		};

		var control = function () {
			_each(_cache.sites, function (i, el) {
				if (_isView(el.onePage.section) && el.href != lastPush) {
					window.setTimeout(function () {
						if (_isView(el.onePage.section) && el.href != lastPush) {
							lastPush = el.href;
							track(getPage(el));
						}
					}, _option.analyticMethods.timeOut);
				}
			})
		};

		_bind(window, 'scroll', function () {
			control()
		});
	}



	function _isView(el) {
		var windowScrollY = document.documentElement.scrollTop || window.pageYOffset || window.scrollY || 0,
			elHeight = el.offsetHeight,
			elTop = el.offsetTop,
			elBottom = elHeight + elTop;

		windowScrollY -= _option.scrollOffset - _option.watchOffsetY;

		return elTop <= windowScrollY && elBottom >= windowScrollY;
	}


	function _lastSectionMinHeight() {
		var el = document.querySelectorAll('.' + _option.siteName + '_container');
		var height = window.innerHeight || window.screen.availHeight;

		el[el.length - 1].style.minHeight = height + _option.scrollOffset + 'px';
	}


	function _scrollToActivePage() {
		if (scrollToSpan) {
			window.smoothScroll(
				document.querySelector(scrollToSpan.onePage.href),
				_speed(_option.scrollDuration),
				_option.scrollOffset,
				_option.scrollEasing
			);
		}
	}


	function _initSmoothScroll(el) {
		_bind(el, 'click', function () {
			window.smoothScroll(
				document.querySelector(el.onePage.href),
				_speed(_option.scrollDuration),
				_option.scrollOffset,
				_option.scrollEasing);
		}, false);
	}


	function _speed(duration) {
		switch (duration) {
			case 'slow':
				duration = 600;
				break;
			case 'fast':
				duration = 200;
				break;
			default :
				(isNaN(duration) ? duration = 400 : true);
				break;
		}
		return duration;
	}


	function _bind(el, event, callback, erase) {
		event = 'on' + event;

		var push = {};

		if (!el.handler) {
			el.handler = {};
		}

		if (!el.handler[event]) {
			el.handler[event] = {};
			el.handler[event].events = [];
			el.handler[event].fireEvent = function (ev) {
				_each(el.handler[event].events, function (i, event) {
					if (event.erase === false) {
						ev.preventDefault();
						ev.returnValue = false;
					}

					event.method(ev);
				});
			};
			if (el[event] && el[event] != null) {
				push = {
					method: el[event]
				};
				el.handler[event].events.push(push);
			}
			el[event] = function () {
				el.handler[event].fireEvent(arguments[0]);
			};
		}

		push = {
			method: callback,
			erase: erase
		};
		el.handler[event].events.push(push);
	}


	function _loadSite(el, callback) {
		var request;
		var complete = false;

		request = makeHttpObject();

		request.async = true;

		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				function create() {
					html = document.createElement('div');
					html.innerHTML = request.responseText;
				}

				var html;
				request.response && request.response.childNodes ? html = request.response : create();

				requests++;

				_cache.sites.length === requests ? complete = true : false;
				callback.call(html, el, html, complete);
			}
		};

		request.responseType ? request.responseType = "document" : '';

		request.open('GET', parseUrl(el));
		request.send();


		function parseUrl(el) {
			el.href = el.href.replace(el.hash, '');

			return el.href;
		}


		function makeHttpObject() {
			try {
				return new XMLHttpRequest();
			}
			catch (error) {
			}
			try {
				return new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch (error) {
			}
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (error) {
			}

			throw new Error("Could not create HTTP request object.");
		}
	}


	function _load() {
		_each(_cache.sites, function (i, el) {
			if (!el.loaded) {
				el.loaded = true;
				_addContainer(i, el);
			}
		});
	}


	function _init() {
		_getSites();
		_load();
	}


	function _complete() {
		_bind(window, 'load', function () {

			if (_option.minHeightLastSection) {
				_lastSectionMinHeight();

				_bind(window, 'resize', function () {
					_lastSectionMinHeight();
				})
			}

			_viewInSection();
			_pushAnalytics();

			_option.scrollToActivePage ? _scrollToActivePage() : '';
		});
	}


	return {
		init: function (obj, option) {
			_complete();
			_setOption(option);
			_setSites(obj);
			_init();
		},


		each: function (obj, callback) {
			_each(obj, function (i, el) {
				callback.call(el, i, el);
			});
			return obj;
		},


		complete: function () {
			_option.complete();
		},


		bind: function (el, type, callback, erase) {
			_bind(el, type, callback, erase);
			callback.call(callback, callback)
		}
	}
}();


var loadDurration = function () {
	function _startTime() {
		loadDurration.start = new Date().getTime();
	}


	function _endTime() {
		loadDurration.end = new Date().getTime();
	}


	function _returnDuration() {
		return loadDurration.end - loadDurration.start;
	}


	return {
		init: function () {
			_startTime();
			window.onload = function () {
				loadDurration().endTime();
			}
		},


		endTime: function () {
			_endTime();
		},


		returnTime: function () {
			return _returnDuration();
		}
	}
};

loadDurration().init();
