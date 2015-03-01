window.smoothScroll = function () {

    var getTop = function (element) {
        if (element.nodeName === 'HTML') return -getScrollOffsets().y;
        return element.getBoundingClientRect().top + getScrollOffsets().y;
    };

    var position = function (start, end, elapsed, duration, easing) {
        if (elapsed > duration) return end;
        return start + (end - start) * eval(easing+'(elapsed / duration)');
    };

    var smoothScroll = function (el, duration, offset, easing, callback) {
        duration = duration || 500;
        easing = easing ||'linear';
        var start = getScrollOffsets().y;
        var end;
        if (typeof el === 'number') {
            end = parseInt(el) + offset;
        } else {
            end = getTop(el) + offset;
        }
        var clock = +new Date;
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
            function (fn) {
                window.setTimeout(fn, 15);
            };

        var step = function () {
            var elapsed = +new Date - clock;
            window.scrollTo(0, position(start, end, elapsed, duration, easing));
            if (elapsed > duration) {
                if (typeof callback === 'function') {
                    callback(el);
                }
            } else {
                requestAnimationFrame(step);
            }
        };
        step();
    };

    var getScrollOffsets = function() {
        if ( window.pageXOffset != null )
            return {
                x: window.pageXOffset,
                y: window.pageYOffset
            };
        var doc = window.document;
        if ( document.compatMode === "CSS1Compat" ) {
            return {
                x: doc.documentElement.scrollLeft,
                y: doc.documentElement.scrollTop
            };
        }
        return {
            x: doc.body.scrollLeft,
            y: doc.body.scrollTop
        };
    };

    var linkHandler = function (ev) {
        try {
            ev.preventDefault();
            if (location.hash !== this.hash) window.history.pushState(null, null, this.hash);
            smoothScroll(document.getElementById(this.hash.substring(1)), 500, function (el) {
                location.replace('#' + el.id)
            });

        }catch (e){}
    };

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            var internal = document.querySelectorAll('a[href^="#"]'), a;
        for (var i = internal.length; a = internal[--i];) {
            onePageLoader.bind(a, 'click', linkHandler, false);
        }
        }
    };
    return smoothScroll;
}();
