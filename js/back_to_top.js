//判断配置文件是否开启日志调试 是否输出日志 True 输出 False 不输出
var logDebug = false;
console.log = (function (oriLogFunc) {
    return function () {
        if (logDebug) {
            oriLogFunc.apply(this, arguments);
        }
    }
})(console.log);

console.warn = (function (oriLogFunc) {
    return function () {
        if (logDebug) {
            oriLogFunc.apply(this, arguments);
        }
    }
})(console.warn);

console.debug = (function (oriLogFunc) {
    return function () {
        if (logDebug) {
            oriLogFunc.apply(this, arguments);
        }
    }
})(console.debug);


$(document).ready(() => {

    // let zhuo=sessionStorage.getItem("zhuo");
    // if (zhuo!="1") {
        
        // shuzhuo add script
        // music
        // $('body').append($('<script src="https://player.lmih.cn/player/js/player.js" id="myhk" key="158693298216" m="1" defer></script>'));
        // var elem = document.createElement('script');
        // elem.src = "https://player.lmih.cn/player/js/player.js";
        // elem.setAttribute("id","myhk");
        // elem.setAttribute("key","158693298216");
        // elem.setAttribute("m","1");
        // document.querySelector('body').appendChild(elem);


        //shuzhuo add script
        //  雪花特效
        // let windowWidth = $(window).width();
        // if (windowWidth > 480) {
        //     // 原型雪花
        //     // $('body').append($('<script type="text/javascript" src="/js/round_snow.js" defer></script>'));
        //     var elem = document.createElement('script');
        //     elem.src = "/js/round_snow.js";
        //     document.querySelector('body').appendChild(elem);
        // }

        //  点击爱心特效
        // $('body').append($('<script type="text/javascript" src="/js/love.js" defer></script>'));

        // var elem = document.createElement('script');
        //     elem.src = "/js/love.js";
        //     document.querySelector('body').appendChild(elem);

        // 添加鼠标点击显示字体效果
        // $('body').append($('<script type="text/javascript" src="/js/click_show_text.js" defer></script>'));

            var elem = document.createElement('script');
            elem.src = "/js/click_show_text.js";
            // elem.src = "/js/count.js";
            document.querySelector('body').appendChild(elem);

        // sessionStorage.setItem("zhuo", "1"); 
    // }



    const $button = $('#back-to-top');
    const $footer = $('footer.footer');
    const $mainColumn = $('.column-main');
    const $leftSidebar = $('.column-left');
    const $rightSidebar = $('.column-right');
    let lastScrollTop = 0;
    const rightMargin = 20;
    const bottomMargin = 20;
    let lastState = null;
    const state = {
        base: {
            classname: 'card has-text-centered',
            left: '',
            width: 64,
            bottom: bottomMargin
        }
    };
    state['desktop-hidden'] = Object.assign({}, state.base, {
        classname: state.base.classname + ' rise-up'
    });
    state['desktop-visible'] = Object.assign({}, state['desktop-hidden'], {
        classname: state['desktop-hidden'].classname + ' fade-in'
    });
    state['desktop-dock'] = Object.assign({}, state['desktop-visible'], {
        classname: state['desktop-visible'].classname + ' fade-in is-rounded',
        width: 40
    });
    state['mobile-hidden'] = Object.assign({}, state.base, {
        classname: state.base.classname + ' fade-in',
        right: rightMargin
    });
    state['mobile-visible'] = Object.assign({}, state['mobile-hidden'], {
        classname: state['mobile-hidden'].classname + ' rise-up'
    });

    function isStateEquals(prev, next) {
        return ![].concat(Object.keys(prev), Object.keys(next)).some(key => {
            return !Object.prototype.hasOwnProperty.call(prev, key)
                || !Object.prototype.hasOwnProperty.call(next, key)
                || next[key] !== prev[key];
        });
    }

    function applyState(state) {
        if (lastState !== null && isStateEquals(lastState, state)) {
            return;
        }
        $button.attr('class', state.classname);
        for (const prop in state) {
            if (prop === 'classname') {
                continue;
            }
            $button.css(prop, state[prop]);
        }
        lastState = state;
    }

    function isDesktop() {
        return window.innerWidth >= 1078;
    }

    function isTablet() {
        return window.innerWidth >= 768 && !isDesktop();
    }

    function isScrollUp() {
        return $(window).scrollTop() < lastScrollTop && $(window).scrollTop() > 0;
    }

    function hasLeftSidebar() {
        return $leftSidebar.length > 0;
    }

    function hasRightSidebar() {
        return $rightSidebar.length > 0;
    }

    function getRightSidebarBottom() {
        if (!hasRightSidebar()) {
            return 0;
        }
        return Math.max.apply(null, $rightSidebar.find('.widget').map(function () {
            return $(this).offset().top + $(this).outerHeight(true);
        }));
    }

    function getScrollTop() {
        return $(window).scrollTop();
    }

    function getScrollBottom() {
        return $(window).scrollTop() + $(window).height();
    }

    function getButtonWidth() {
        return $button.outerWidth(true);
    }

    function getButtonHeight() {
        return $button.outerHeight(true);
    }

    function updateScrollTop() {
        lastScrollTop = $(window).scrollTop();
    }

    function update() {
        // desktop mode or tablet mode with only right sidebar enabled
        if (isDesktop() || (isTablet() && !hasLeftSidebar() && hasRightSidebar())) {
            let nextState;
            const padding = ($mainColumn.outerWidth() - $mainColumn.width()) / 2;
            const maxLeft = $(window).width() - getButtonWidth() - rightMargin;
            const maxBottom = $footer.offset().top + (getButtonHeight() / 2) + bottomMargin;
            if (getScrollTop() === 0 || getScrollBottom() < getRightSidebarBottom() + padding + getButtonHeight()) {
                nextState = state['desktop-hidden'];
            } else if (getScrollBottom() < maxBottom) {
                nextState = state['desktop-visible'];
            } else {
                nextState = Object.assign({}, state['desktop-dock'], {
                    bottom: getScrollBottom() - maxBottom + bottomMargin
                });
            }

            const left = $mainColumn.offset().left + $mainColumn.outerWidth() + padding;
            nextState = Object.assign({}, nextState, {
                left: Math.min(left, maxLeft)
            });
            applyState(nextState);
        } else {
            // mobile and tablet mode
            if (!isScrollUp()) {
                applyState(state['mobile-hidden']);
            } else {
                applyState(state['mobile-visible']);
            }
            updateScrollTop();
        }
    }

    update();
    $(window).resize(update);
    $(window).scroll(update);

    $('#back-to-top').on('click', () => {
        $('body, html').animate({ scrollTop: 0 }, 400);
    });

    // console.clear();

});
