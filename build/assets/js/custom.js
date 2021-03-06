'use strict';

ready(function () {

    checkedInput();

    //http://github.hubspot.com/select/
    Select.init();

    //scroll to catalog
    document.getElementById('js-to-catalog').addEventListener('click', function () {
        EPPZScrollTo.scrollVerticalToElementById('catalog', 0);
    });

    //checked all checkbox in filter
    document.getElementById('js-check-all').addEventListener('click', function () {
        var inputs = document.querySelectorAll('.filter-inner input[type="checkbox"]'),
            i = void 0;

        for (i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
        }

        inspectionInputs(inputs);
    });
});

/**
 * $(document).ready(function(){}); for JS
 * @param fn - function(){our functions}
 */
function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * inputs have to parent element label
 *
 * custom view for input:checkbox and input:radio
 */
function checkedInput() {
    var reset = document.querySelectorAll('input[type="reset"]');

    inspectionInputs(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'));

    document.addEventListener('change', function (e) {
        var target = e.target;

        if (target.closest('.checkbox') && !target.hasAttribute('disabled')) {
            target.closest('.checkbox').classList.toggle('active');
        }

        if (e.target.closest('.radio')) {
            inspectionInputs(document.querySelectorAll('input[type="radio"]'));
        }
    });

    document.addEventListener('click', function (e) {
        var i = void 0;

        for (i = 0; i < reset.length; i++) {
            if (e.target === reset[i]) {
                setTimeout(function () {
                    inspectionInputs(document.querySelectorAll('input[type="checkbox"], input[type="radio"]'));
                }, 0);
            }
        }
    });
}

/**
 *
 * @param arr - array inputs for inspection
 */
function inspectionInputs(arr) {
    var i = void 0,
        elem = void 0;

    for (i = 0; i < arr.length; i++) {
        elem = arr[i];

        if (elem.checked) {
            elem.parentElement.classList.add('active');
        } else {
            elem.parentElement.classList.remove('active');
        }

        if (elem.hasAttribute('disabled')) {
            elem.parentElement.classList.add('disabled');
        }
    }
}

/**
 *
 * Created by Borbás Geri on 12/17/13
 * Copyright (c) 2013 eppz! development, LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
var EPPZScrollTo = {
    /**
     * Helpers.
     */
    documentVerticalScrollPosition: function documentVerticalScrollPosition() {
        if (self.pageYOffset) return self.pageYOffset; // Firefox, Chrome, Opera, Safari.
        if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6 (standards mode).
        if (document.body.scrollTop) return document.body.scrollTop; // Internet Explorer 6, 7 and 8.
        return 0; // None of the above.
    },

    viewportHeight: function viewportHeight() {
        return document.compatMode === "CSS1Compat" ? document.documentElement.clientHeight : document.body.clientHeight;
    },

    documentHeight: function documentHeight() {
        return document.height !== undefined ? document.height : document.body.offsetHeight;
    },

    documentMaximumScrollPosition: function documentMaximumScrollPosition() {
        return this.documentHeight() - this.viewportHeight();
    },

    elementVerticalClientPositionById: function elementVerticalClientPositionById(id) {
        var element = document.getElementById(id);
        var rectangle = element.getBoundingClientRect();
        return rectangle.top;
    },

    /**
     * Animation tick.
     */
    scrollVerticalTickToPosition: function scrollVerticalTickToPosition(currentPosition, targetPosition) {
        var filter = 0.2;
        var fps = 40;
        var difference = parseFloat(targetPosition) - parseFloat(currentPosition);

        // Snap, then stop if arrived.
        var arrived = Math.abs(difference) <= 0.5;
        if (arrived) {
            // Apply target.
            scrollTo(0.0, targetPosition);
            return;
        }

        // Filtered position.
        currentPosition = parseFloat(currentPosition) * (1.0 - filter) + parseFloat(targetPosition) * filter;

        // Apply target.
        scrollTo(0.0, Math.round(currentPosition));

        // Schedule next tick.
        setTimeout("EPPZScrollTo.scrollVerticalTickToPosition(" + currentPosition + ", " + targetPosition + ")", 1000 / fps);
    },

    /**
     * For public use.
     *
     * @param id The id of the element to scroll to.
     * @param padding Top padding to apply above element.
     */
    scrollVerticalToElementById: function scrollVerticalToElementById(id, padding) {
        var element = document.getElementById(id);
        if (element == null) {
            console.warn('Cannot find element with id \'' + id + '\'.');
            return;
        }

        var targetPosition = this.documentVerticalScrollPosition() + this.elementVerticalClientPositionById(id) - padding;
        var currentPosition = this.documentVerticalScrollPosition();

        // Clamp.
        var maximumScrollPosition = this.documentMaximumScrollPosition();
        if (targetPosition > maximumScrollPosition) targetPosition = maximumScrollPosition;

        // Start animation.
        this.scrollVerticalTickToPosition(currentPosition, targetPosition);
    }
};

/**
 * polyfill for closest IE11-
 * MDN
 */
(function (ELEMENT) {
    ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;
    ELEMENT.closest = ELEMENT.closest || function closest(selector) {
        if (!this) return null;
        if (this.matches(selector)) return this;
        if (!this.parentElement) {
            return null;
        } else return this.parentElement.closest(selector);
    };
})(Element.prototype);

/**
 *  Up-Down button
 * */
(function () {

    var upDownBtn = document.getElementById('toUp');
    var check;

    function trackScroll() {
        var scrolled = window.pageYOffset;
        var topPosition = 800;

        if (scrolled > topPosition) {
            upDownBtn.classList.add('js-visible');
            check = false;
        }

        if (scrolled > 0 && scrolled < topPosition) {
            upDownBtn.classList.remove('js-visible');
        }

        if (scrolled === 0) {
            check = true;
        }
    }

    function backToTop() {
        upDownBtn.classList.add('js-visible');
        if (!check) {
            (function goTop() {

                if (window.pageYOffset !== 0) {
                    window.scrollBy(0, -80);
                    setTimeout(goTop, 20);
                } else {
                    upDownBtn.classList.remove('js-visible');
                }
            })();
            return;
        } else if (check) {
            (function goBottom() {
                var match = Math.ceil(window.pageYOffset + document.documentElement.clientHeight);

                if (match != document.documentElement.scrollHeight) {
                    window.scrollBy(0, 80);
                    setTimeout(goBottom, 0);
                } else {
                    upDownBtn.classList.remove('js-visible');
                }
            })();
            return;
        }
    }

    window.addEventListener('scroll', trackScroll);
    upDownBtn.addEventListener('click', backToTop);
})();