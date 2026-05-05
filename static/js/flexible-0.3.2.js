/*
** 移动端自适应方案  FROM 手淘
** Update【2016年01月13日】
*/

// ;(function(win, lib) {
//     var doc = win.document;
//     var docEl = doc.documentElement;
//     var metaEl = doc.querySelector('meta[name="viewport"]');
//     var flexibleEl = doc.querySelector('meta[name="flexible"]');
//     var dpr = 0;
//     var scale = 0;
//     var tid;
//     var flexible = lib.flexible || (lib.flexible = {});
    
//     if (metaEl) {
//         //console.warn('将根据已有的meta标签来设置缩放比例');
//         var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
//         if (match) {
//             scale = parseFloat(match[1]);
//             dpr = parseInt(1 / scale);
//         }
//     } else if (flexibleEl) {
//         var content = flexibleEl.getAttribute('content');
//         if (content) {
//             var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
//             var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
//             if (initialDpr) {
//                 dpr = parseFloat(initialDpr[1]);
//                 scale = parseFloat((1 / dpr).toFixed(2));
//             }
//             if (maximumDpr) {
//                 dpr = parseFloat(maximumDpr[1]);
//                 scale = parseFloat((1 / dpr).toFixed(2));
//             }
//         }
//     }

//     if (!dpr && !scale) {
//         //var isAndroid = win.navigator.appVersion.match(/android/gi);
//         var isIPhone = win.navigator.appVersion.match(/iphone/gi);
//         var devicePixelRatio = win.devicePixelRatio;
//         if (isIPhone) {
//             // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
//             if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {                
//                 dpr = 3;
//             } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
//                 dpr = 2;
//             } else {
//                 dpr = 1;
//             }
//         } else {
//             // 其他设备下，仍旧使用1倍的方案
//             dpr = 1;
//         }
//         scale = 1 / dpr;
//     }

//     docEl.setAttribute('data-dpr', dpr);
//     if (!metaEl) {
//         metaEl = doc.createElement('meta');
//         metaEl.setAttribute('name', 'viewport');
//         metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
//         if (docEl.firstElementChild) {
//             docEl.firstElementChild.appendChild(metaEl);
//         } else {
//             var wrap = doc.createElement('div');
//             wrap.appendChild(metaEl);
//             doc.write(wrap.innerHTML);
//         }
//     }

//     function refreshRem(){
//         var width = docEl.getBoundingClientRect().width;
//         if (width / dpr > 540) {
//             width = 540 * dpr;
//         }
//         var rem = width / 10;
//         docEl.style.fontSize = rem + 'px';
//         flexible.rem = win.rem = rem;
//     }

//     // win.addEventListener('resize', function() {
//     //     clearTimeout(tid);
//     //     tid = setTimeout(refreshRem, 300);
//     // }, false);
//     win.addEventListener('pageshow', function(e) {
//         if (e.persisted) {
//             clearTimeout(tid);
//             tid = setTimeout(refreshRem, 300);
//         }
//     }, false);

//     if (doc.readyState === 'complete') {
//         doc.body.style.fontSize = 14 * dpr + 'px';
//     } else {
//         doc.addEventListener('DOMContentLoaded', function() {
//             doc.body.style.fontSize = 14 * dpr + 'px';
//         }, false);
//     }

//     refreshRem();

//     flexible.dpr = win.dpr = dpr;
//     flexible.refreshRem = refreshRem;
//     flexible.rem2px = function(d) {
//         var val = parseFloat(d) * this.rem;
//         if (typeof d === 'string' && d.match(/rem$/)) {
//             val += 'px';
//         }
//         return val;
//     };
//     flexible.px2rem = function(d) {
//         var val = parseFloat(d) / this.rem;
//         if (typeof d === 'string' && d.match(/px$/)) {
//             val += 'rem';
//         }
//         return val;
//     };

// })(window, window.lib || (window.lib = {}));
if(window.innerWidth <= 1023){
    !function(e, t) {
        function n() {
            t.body ? t.body.style.fontSize = 14 + "px" : t.addEventListener("DOMContentLoaded", n)
            // t.body ? t.body.style.fontSize = 7 * o + "px" : t.addEventListener("DOMContentLoaded", n)
        }
        function d() {
            // 与手淘方案一致：根字号按宽度换算，但限制最大逻辑宽度，避免 768~1023px 平板 rem 过大导致 index.css 等处 9.7333rem 等样式高度爆炸
            var w = i.clientWidth;
            if (w > 540) {
                w = 540;
            }
            var e = w / 10;
            i.style.fontSize = e + "px";
        }
        var i = t.documentElement, o = e.devicePixelRatio || 1;
        if (n(),d(),e.addEventListener("resize", d),
        e.addEventListener("pageshow", function(e) {
            e.persisted && d()
        }),
        o >= 2) {
            var a = t.createElement("body")
              , s1 = t.createElement("div")
            s1.style.border = ".5px solid transparent",
            a.appendChild(s1),
            i.appendChild(a),
            1 === s1.offsetHeight && i.classList.add("hairlines"),
            i.removeChild(a)
        }
    }(window, document);
}