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
		activateAnalytics: false,
		analyticMethods: {
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
		move;


	function _setDefaultOption() {
		return _option;
	}


	function _setOption(option) {
		for (var prop in option) {
			onePageLoader.option[prop] = option[prop];
		}
		onePageLoader.scripts ? true : onePageLoader.scripts = [];
		onePageLoader.css ? true : onePageLoader.css = [];
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
			var body = document.querySelector(onePageLoader.option.body),
				siteId = _resolveString(onePageLoader.option.siteName + '_' + el.innerHTML.replace(' ', '_').toLowerCase()),
				site = document.createElement(onePageLoader.option.siteElement);
			el.siteId = siteId;
			site.id = siteId;
			site.className = onePageLoader.option.siteName + '_container';
			body.appendChild(site);
			switch (el.tagName) {
				case 'SPAN':
					el.onePage = {};
					_handleByTagSpan(el, siteId, body);
					break;
				case 'A':
					el.onePage = {};
					_handleByTagA(el);
					break;
				default :
					break;
			}
			if (i == onePageLoader.sites.length - 1 && typeof move != 'object') {
				_handleDisplayBefore(body, site, siteId);
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
		if (onePageLoader.option.displayBefore) {
			var firstEl = document.querySelector(onePageLoader.option.body + ' ' + onePageLoader.option.siteElement),
				parentEL = firstEl.parentNode;
			move = body.children[0];
			move.parentNode.removeChild(move);
			site = document.createElement(onePageLoader.option.siteElement);
			siteId = location.href.split('/');
			siteId = siteId[siteId.length - 1];
			if (siteId.search('\/?') > -1) siteId = siteId.split('?')[0];
			if (siteId.search('.') > -1) siteId = siteId.split('.')[0];
			site.id = onePageLoader.option.siteName + '_' + siteId.replace('-', '_');
			site.className = onePageLoader.option.siteName + '_container';
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
			el.onePage.href = '#' + el.siteId;
			var append = document.querySelector(el.onePage.href);
			(onePageLoader.option.smoothScroll ? _initSmoothScroll(el) : false);
			append.appendChild(content);
			el.onePage.section = append;
		});
	}


	function _handleByTagSpan(el, siteId, body) {
		el.href = location.href;
		el.onePage.href = '#' + siteId;
		el.hash = '#' + siteId;
		(onePageLoader.option.smoothScroll ? _initSmoothScroll(el) : false);
		var insert = document.getElementById(siteId);
		move = body.children[0];
		move.parentNode.removeChild(move);
		insert.appendChild(move);
		el.onePage.section = insert;
		if (onePageLoader.smoothScroll) scrollToSpan = el;
	}


	function _viewInSection() {
		/** TODO: ie 8 event fix **/
		_bind(window, 'scroll', function () {
			_setActive(window, document.querySelectorAll('.' + onePageLoader.option.siteName + '_container'));
		});
	}


	function _setActive(watch, elements) {
		/** TODO: ie 8 active fix **/
		var links = onePageLoader.sites;
		_each(elements, function (i, el) {
			_each(links, function (iLink, link) {
				if (link.onePage.href.search(el.id) > -1) {
					if (_isView(watch, el)) {
						if (el.className.search('active') < 0) {
							el.className += ' active';
							if (link.className.search('active') < 0) {
								link.className += ' active';
								link.parentNode.className += ' active';
							}
						}
					} else {
						if (el.className.search('active') > -1) {
							el.className = el.className.replace(' active', '');
							el.className = el.className.replace('active ', '');
							el.className = el.className.replace('active', '');
							if (link.className.search('active') > -1) {
								link.className = link.className.replace('active', '');
								link.parentNode.className = link.parentNode.className.replace(' active', '');
								link.parentNode.className = link.parentNode.className.replace('active ', '');
								link.parentNode.className = link.parentNode.className.replace('active', '');
							}
						}
					}
				}
			});
		});
	}


	function _isView(watch, el) {
		/** TODO: fix FF 3.6 **/
		var waScY = watch.scrollY || watch.screenTop,
			waHeight = watch.innerHeight || watch.screen.availHeight,
			elHeight = el.offsetHeight,
			elScY = el.offsetTop;

		waScY = waScY || 0;

		waScY += onePageLoader.option.watchOffsetY;

		return elScY <= waScY && elHeight + elScY >= waScY;
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
								if (onePageLoader.option.minHeightLastSection) {
									_lastSectionMinHeight();
									_bind(window, 'resize', function () {
										_lastSectionMinHeight();
									})
								}
								window.setTimeout(function () {
									_viewInSection();
									if (onePageLoader.option.scrollToAcivePage) _scrollToActivePage();
									onePageLoader.complete();
									if (onePageLoader.css.length > 0) {
										_each(onePageLoader.css, function (i, el) {
											if (document.querySelectorAll('link[href="'+el.href+'"]').length == 0) {
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
		var el = document.querySelectorAll('.' + onePageLoader.option.siteName + '_container');
		var height = window.innerHeight || window.screen.availHeight;
		el[el.length - 1].style.minHeight = height + onePageLoader.option.scrollOffset + 'px';
	}


	function _scrollToActivePage() {
		if (scrollToSpan) {
			window.smoothScroll(
				document.querySelector(scrollToSpan.onePage.href),
				_speed(onePageLoader.option.scrollDuration),
				onePageLoader.option.scrollOffset,
				onePageLoader.option.scrollEasing
			);
		}
	}


	function _initSmoothScroll(el) {
		_bind(el, 'click', function (event) {
			window.smoothScroll(
				document.querySelector(el.onePage.href),
				_speed(onePageLoader.option.scrollDuration),
				onePageLoader.option.scrollOffset,
				onePageLoader.option.scrollEasing);
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
				callback.call(html.querySelector(onePageLoader.option.body).children[0], el, html.querySelector(onePageLoader.option.body).children[0], complete);
			}
		};
		request.open('GET', el.href);
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
			onePageLoader.option.complete();
		},


		bind: function (el, type, callback, erase) {
			_bind(el, type, callback, erase);
			callback.call(callback, callback)
		}
	}
}();
