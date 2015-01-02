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
		mainSites: '', /** add main Sites **/
		sitesBefore: '', /** add Sites before **/ /** TODO: add Sites Before **/
		sitesAfter: '', /** add Sites after **/ /** TODO: add Sites After **/
		inViewSection: '', /** TODO: inView Section **/
		outViewSection: '', /** TODO: outView Section **/
		watchOffsetY: 0,
		minHeightLastSection: true,
		scrollToAcivePage: true,
		complete: function () {
		}
	};


	var requests = 1,
		scrollToSpan,
		move;


	function _setDefaultOption() {
		return _option;
	}


	function _setOption(option) {
		for (var prop in option) {
			_option[prop] = option[prop];
		}

		onePageLoader.scripts ? true : onePageLoader.scripts = [];
		onePageLoader.css ? true : onePageLoader.css = [];

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
			if (!name || name == '#document') break;

			name = name.toLowerCase();

			if (realNode.id) {

				// As soon as an id is found, there's no need to specify more.
				return name + '#' + realNode.id + (path ? '>' + path : '');
			}

			var parent = realNode.parentNode;
			var siblings = [];
			_each(parent.children, function (i, element) {
				if (element.tagName == name) {
					siblings.push(element);
				}
			});

			if (siblings.length > 1) name += ':eq(' + siblings.index(node) + ')';

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
				onePageLoader.mainSites = _parseSites(obj.querySelectorAll('a, span'));
		}
		return false;
	}


	function _parseSites(obj) {
		var sites = [];
		onePageLoader.each(obj, function (i, el) {
			if (el.href && !el.hash) {
				sites.push(el);
			}
			if (el.tagName === 'SPAN' && el.className.search('active') > -1) {
				sites.push(el);
			}
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
		if (arr = onePageLoader.mainSites) {
			onePageLoader.each(arr, function (i, el) {
				obj.push(el);
			});
		}
		/** TODO: Sites after **/
		/*if (onePageLoader.option.sitesAfter) {
		 for (var i = 0; i <= onePageLoader.option.sitesAfter.length - 1; i++) {
		 _setSites(onePageLoader.option.sitesBefore, 'after');
		 obj.push(onePageLoader.sitesAfter[i]);
		 }
		 }*/
		onePageLoader.sites = obj;
	}


	function _addContainer(i, el) {
		if (!el.hash) {
			el.onePage = {
				href: '#' + _resolveString(_option.siteName + '_' + el.innerHTML.replace(' ', '_').toLowerCase()),
				section: document.createElement(_option.siteElement)
			};
			el.onePage.section.id = el.onePage.href.replace('#', '');
			el.onePage.section.className = _option.siteName + '_container';

			el.hash = el.onePage.href;
			_option.body[0].appendChild(el.onePage.section);
			switch (el.tagName) {
				case 'SPAN':
					_handleByTagSpan(el);
					break;
				case 'A':
					_handleByTagA(el);
					break;
				default :
					break;
			}
			if (i == onePageLoader.sites.length - 1 && typeof move != 'object') {
				//_handleDisplayBefore(_option.body[0], site, siteId);
			}
		} else {
			//onePageLoader.sites.splice(i, 1);
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
			string = string.replace(areaReplace[prop][0], areaReplace[prop][1]);
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


	function _handleByTagA(el) {
		_loadSite(el, function (el, content, complete) {
			if (complete) _loadScripts();
			(_option.smoothScroll ? _initSmoothScroll(el) : false);
			el.onePage.section.appendChild(content);
		});
	}


	function _handleByTagSpan(el) {
		el.href = location.href;

		var move = _option.body[0].children[0];
		move.parentNode.removeChild(move);

		el.onePage.section.appendChild(move);

		_option.smoothScroll ? _initSmoothScroll(el) : '';

		_option.smoothScroll ? scrollToSpan = el : '';
	}


	function _addClass(el, string) {
		el.classList != undefined ? el.classList.add(string) : fallback();

		function fallback() {
			var classList = el.className.split(' ');

			var isSet = false;

			if (classList.length > 0) {
				_each(classList, function (i, el) {
					if (el === string) isSet = true;
				});
			}

			if (isSet === false) classList.push(string);

			el.className = classList.join(' ');
		}
	}


	function _removeClass(el, string) {
		el.classList != undefined ? el.classList.remove(string) : fallback();

		function fallback() {
			var classList = el.className.split(' ');

			if (classList.length > 0) {
				_each(classList, function (i, el) {
					if (el === string) classList.splice(i);
				});
			}

			el.className = classList.join(' ');
		}
	}


	function _viewInSection() {
		var lastView = location.href;

		_each(onePageLoader.sites, function (i, el) {
			if (el.href === location.href) {
				_addClass(el.onePage.section, 'active');
			}
		});

		var control = function () {
			_each(onePageLoader.sites, function (i, el) {
				if (el.href != lastView) {
					switch (_isView(el.onePage.section)) {
						case true:
							_addClass(el, 'active');
							_addClass(el.parentNode, 'active');
							_addClass(el.onePage.section, 'active');

							lastView = el.href;
							break;
						case false:
							_removeClass(el, 'active');
							_removeClass(el.parentNode, 'active');
							_removeClass(el.onePage.section, 'active');
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


	function _isView(el) {
		var windowScrollY = document.documentElement.scrollTop || window.pageYOffset || window.scrollY || 0,
			elHeight = el.offsetHeight,
			elTop = el.offsetTop,
			elBottom = elHeight + elTop;

		windowScrollY -= _option.scrollOffset - _option.watchOffsetY;

		return elTop <= windowScrollY && elBottom >= windowScrollY;
	}


	function _loadScripts() {
		var scriptsLength = onePageLoader.scripts.length;
		var head = document.getElementsByTagName('head')[0];
		_each(onePageLoader.scripts, function (i, el) {
			if (el.src) {
				var script = document.createElement('script');
				script.src = el.src;
				head.appendChild(script);
			}
			if (i == scriptsLength - 1 || scriptsLength == 0) {
				window.setTimeout(function () {
					_each(onePageLoader.scripts, function (i, el) {
						if (el.innerHTML) {
							try {
								eval(el.innerHTML);
							}
							catch (e) {
								console.error('Javascript function eval() ERROR');
								console.error(el.innerHTML);
							}
							if (i == scriptsLength - 1 || scriptsLength == 0) {
								if (_option.minHeightLastSection) {
									_lastSectionMinHeight();
									_bind(window, 'resize', function () {
										_lastSectionMinHeight();
									})
								}
								window.setTimeout(function () {
									_viewInSection();
									if (_option.scrollToAcivePage) _scrollToActivePage();
									onePageLoader.complete();
									if (onePageLoader.css.length > 0) {
										_each(onePageLoader.css, function (i, el) {
											if (document.querySelectorAll('link[href="' + el.href + '"]').length == 0) {
												var css = document.createElement('link');
												css.rel = el.rel;
												css.href = el.href;
												head.appendChild(css);
											}
										});
									}
								}, 200);
							}
						}
					});
				}, 500);
			}
		});
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
		_bind(el, 'click', function (event) {
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
				el.handler[event].events.forEach(function (event) {
					if (event.erase === false) {
						ev.preventDefault();
						ev.returnValue = false;
					}

					event.function(ev);
				});
			};
			if (el[event] && el[event] != null) {
				push = {
					function: el[event]
				};
				el.handler[event].events.push(push);
			}
			el[event] = function () {
				el.handler[event].fireEvent(arguments[0]);
			};
		}

		push = {
			function: callback,
			erase: erase
		};
		el.handler[event].events.push(push);
	}


	function _loadSite(el, callback) {
		var request;
		var complete = false;
		if (window.ActiveXObject) {
			request = new ActiveXObject('Microsoft.XMLHTTP');
		} else {
			request = new XMLHttpRequest();
		}
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				var html = document.createElement('div');
				html.innerHTML = request.responseText;
				_each(html.getElementsByTagName('script'), function (i, script) {
					if (_parseScript(script) == true) {
						onePageLoader.scripts.push(script);
					}
				});
				_each(html.getElementsByTagName('link'), function (i, css) {
					if (_parseScript(css) == true) {
						onePageLoader.css.push(css);
					}
				});
				requests++;
				(onePageLoader.sites.length == requests ? complete = true : false);
				callback.call(html.querySelector(_option.body.selector).children[0], el, html.querySelector(_option.body.selector).children[0], complete);
			}
		};
		request.open('GET', el.href.replace(el.hash, ''));
		request.send();
	}


	function _parseScript(obj) {
		var loaded = false,
			type;
		(obj.src ? type = 'src' : false);
		(obj.href ? type = 'href' : false);
		(obj.innerHTML ? type = 'innerHTML' : false);
		_each(onePageLoader.scripts, function (i, el) {
			(obj[type] == el[type] ? loaded = true : false);
		});
		if (loaded == false) {
			if (type == 'src' || type == 'href') {
				loaded = true;
				_each(document.querySelectorAll(obj.tagName), function (iHTML, elHTML) {
					(elHTML[type] == obj[type] ? loaded = false : true);
				});
				return loaded != false;
			}
			return true;
		}
		return false;
	}


	function _load() {
		_each(onePageLoader.sites, function (i, el) {
			if (!el.loaded) {
				el.loaded = true;
				_addContainer(i, el);
			}
		});
	}


	function _init() {
		if (!onePageLoader.sites) _getSites();
		_load();
	}


	return {
		option: _setDefaultOption(),
		init: function (obj, option) {
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
