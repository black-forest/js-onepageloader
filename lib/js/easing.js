/**
 * This file is part of black-forest/js-onepageloader.
 *
 * (c) 2013-2017 Black Forest.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * This project is provided in good faith and hope to be usable by anyone.
 *
 * @package    black-forest/js-onepageloader
 * @author     Sven Baumann <baumann.sv@gmail.com>
 * @copyright  2013-2017 Black Forest.
 * @license    https://github.com/black-forest/js-onepageloader/blob/master/LICENSE LGPL-3.0
 * @filesource
 */

function linear(t) {
    return t;
}
function easeInQuad(t) {
    return t * t;
}
function easeOutQuad(t) {
    return t * (2 - t);
}
function easeInOutQuad(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function easeInCubic(t) {
    return t * t * t;
}
function easeOutCubic(t) {
    return (--t) * t * t + 1;
}
function easeInOutCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
function easeInQuart(t) {
    return t * t * t * t;
}
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}
function easeInOutQuart(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
}
function easeInQuint(t) {
    return t * t * t * t * t;
}
function easeOutQuint(t) {
    return 1 + (--t) * t * t * t * t;
}
function easeInOutQuint(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
}
