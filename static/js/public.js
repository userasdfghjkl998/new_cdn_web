$(function () {
  var is_close_browser_tips = $("#is_close_browser_tips").val();
  /*控制显示兼容提示*/
  if (Browser.client.isIE && Browser.client.version < 9) {
    if (!is_close_browser_tips) $(".version-tips").show();
  } else if (
    Browser.client.type == "Chrome" &&
    Browser.client.name == "Chrome" &&
    Browser.client.version < 31
  ) {
    if (!is_close_browser_tips) $(".version-tips").show();
  } else if (Browser.client.type == "Firefox" && Browser.client.version < 30) {
    if (!is_close_browser_tips) $(".version-tips").show();
  }
  $(".version-tips .close").click(function () {
    $(this).parent().remove();
    $.get("/index/setBrowserCache.html");
  });

  // 导航描述
  var event = $(window) <= 1023 ? "touchstart" : "mouseenter";

  $(".sub dd").on(event, function () {
    var id = $(this).data("id");
    $(this)
      .closest(".sub")
      .find(".nav-desc-item")
      .each(function () {
        $(this).hide();
        if ($(this).data("item") === id) {
          $(this).show();
        }
      });
  });

  // 导航滚动
  setNav();

    $().ready(function () {
    setNavScroll();
    });
    $(window).resize(function () {
        setNavScroll();
    });
  // 设置导航栏适配滚动条
  function setNavScroll() {
    var $ul = $('.nav>ul');
    var $nav = $('.nav');
    if ($ul.width() + 5 < $ul[0].scrollWidth) {
      if ($ul[0].scrollLeft) {
        $nav.addClass('scroll-left');
      } else {
        $nav.addClass('scroll-right');
      }
    } else {
      $nav.removeClass('scroll-left').removeClass('scroll-right');
    }
  }
  // 导航栏适配滚动条翻页按钮
  $('.scroll-left-arrow, .scroll-right-arrow').on('click', function() {
    var $nav = $('.nav');
    var $ul = $('.nav>ul');
    $nav.removeClass('scroll-left').removeClass('scroll-right');
    $ul[0].scrollLeft ? $nav.addClass('scroll-right') : $nav.addClass('scroll-left');

    $ul.animate({
      scrollLeft: $ul[0].scrollLeft ? 0 : ($ul[0].scrollWidth - $ul.width()) + 'px'
    })
  })

  setSearch();

  function setSearch() {

    // 获取初始搜索标签
    function getSearchTags() {
      var tagsHtmlStr = '';
      var searchTags = localStorage.getItem('searchTags') || '';
      searchTags.split(',').forEach(function(item) {
        if (item) {
          kword = encodeURIComponent(item)
          tagsHtmlStr += `<li class="p-1"><a href="/search/index?keywords=${kword}">${item}</a></li>`;
        }
      })
      $('.nav-search-tags').html(tagsHtmlStr);
    }
    getSearchTags();

    // 搜索
    function openSearch(keyword) {
      var searchTags = localStorage.getItem('searchTags') || '';
      keyword = HtmlUtil.htmlEncodeByRegExp(keyword)
      kword = encodeURIComponent(keyword)
      if (keyword && !searchTags.split(',').includes(keyword)) {
        if ($('.nav-search-tags li').length >= 10) {
          $('.nav-search-tags li').eq(8).nextAll().remove();
        }
        $('.nav-search-tags').prepend(`<li class="p-1"><a href="/search/index?keywords=${kword}">${keyword}</a></li>`);
        var newSearchTags = searchTags ? searchTags.split(',') : [];
        newSearchTags.unshift(keyword);
        localStorage.setItem('searchTags', newSearchTags.slice(0, 10).join(','));
        // $('.nav-search-result').addClass('has-tags');
      }
      $('.nav-search-input').val('');
      location.href = "/search/index?keywords=" + kword ;
    }

    // 搜索回车事件
    $('.nav-search-input').on('focus', function() {
      $('.nav-search').addClass('is-open');
    })

    // 搜索失去焦点
    $(document).on('click', (function (e) {
        if(!$('.nav-search').has($(e.target)).length){
          $('.nav-search').removeClass('is-open');
        }
    }));

    // 搜索回车事件
    $('.nav-search-input').on('keydown', function(event) {
      var keyCode = event.keyCode;
      var value = this.value;
      if (keyCode === 13) {
        openSearch(value)
      }
    })

    // 清空搜索记录
    $('.nav-search-result-btn.delete').on('click', function() {
      $('.nav-search').addClass('is-open');
      $('.nav-search-tags').empty();
      localStorage.removeItem('searchTags');
    })

    // 搜索添加焦点
    $('.nav-search').on('click', function() {
        var searchTags = localStorage.getItem('searchTags');
        var inputtext = $(".nav-search-input").val();
      if (searchTags && !inputtext) {
        $(".nav-search-result").addClass("has-tags");
      } else {
        $(".nav-search-result").removeClass("has-tags");
      }
      $('.nav-search-input').focus();
    })

    // 输入是隐藏历史
    $(document).ready(function () {
        $(".nav-search-input").on("input", function () {
            var inputtext = $(this).val();
            if (!inputtext) {
                $(".nav-search-result").addClass("has-tags");
            } else {
                $(".nav-search-result").removeClass("has-tags");
            }
        })
    })

    // 点击历史搜索标签
    $('.nav-search-result').on('click', 'li', function() {
      var value = $(this).text();
      openSearch(value);
    })
  }

//   var _isPC = $(document).width() >= 1024;
//   var reflashFlag = false;
//   $(window).resize(function () {
//     var width = $(document).width();
//     setNavScroll();
//     var isPC = width >= 1024;
//     if (isPC != _isPC && !reflashFlag) {
//       reflashFlag = true;
//       location.reload();
//     }
//   });

  if ($("#skip-box").length) {
    var block_name = $("#skip-nav").attr("data-block-name");
    var li_num = $(".animate-skip li").length;
    var skip_nav_position = $("#skip-nav").offset().top;
    var skip_nav_height = $("#skip-box").height();
    //滚动条事件
    $(window).scroll(function () {
      $("#skip-nav").css({ position: "fixed" });
      if ($(window).scrollTop() < skip_nav_position) {
        $(".skip-item").css({ position: "relative" });
      } else {
        for (var i = 0; i < li_num; i++) {
          var $block = $(
            "." + block_name + "-" + $(".animate-skip li").eq(i).data("nav")
          );
          if (!$block.length) continue;
          if ($(window).scrollTop() >= $block.offset().top - skip_nav_height) {
            $(".animate-skip li").removeClass("on");
            $(".animate-skip li").eq(i).addClass("on");
          }
        }
      }
    });
    $(window).scroll();

    //点击滚动条跳转
    $(".animate-skip li").click(function () {
      if ($("#skip-nav").data("type") == "0") {
        var block_name = $(this).parents("#skip-nav").attr("data-block-name");
        $("html, body").animate({
          scrollTop:
            $("." + block_name + "-" + $(this).data("nav")).offset().top -
            skip_nav_height +
            1,
        });
      }
    });
  }

  var slidesPerView = 7;
  if ($(window).width() <= 1023) {
    slidesPerView = 4;

    $("[data-toggle]").click(function () {
      $(this).parent().toggleClass("open");
    });

    $(".left-nav .nav-top").click(function () {
      $(this).siblings("ul").toggle();
    });

    document.body.addEventListener("touchstart", function () {});
  }
  new Swiper(".swiper-category", {
    slidesPerView: slidesPerView,
    initialSlide:
      $(".skip-item .on").index() >= 0
        ? $(".skip-item .on").index()
        : $(".tab-nav01 .on").index(),
    navigation: {
      nextEl: ".skip-next",
      prevEl: ".skip-prev",
    },
  });

  // $(window).resize(function () {
  //     setNav();
  // });

    /* banner */

    if ($(".banner").length) {
        if ($(".banner > ul > li").length > 2) {
        var banner = new Swiper(".banner", {
          loop: true,
          effect: "fade",
          autoplay: {
            //   disableOnInteraction: false,
            delay: 5000,
          },
          preloadImages: false, // 是否预载 slide 的图片
          updateOnImagesReady: true, // 当图片都加载完毕是否更新 swiper
          preload: "nearby",
          preloadSlides: 2, // 附近的 slide 数量
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
            // renderBullet: function (index, className) {
            //   // return '<span class="' + className + '"><samp>' + (index + 1) + '</samp></span>';
            //   return '<span class="' + className + '"></span>';
            // }
          },
        });
        if (banner.slides.length - 2 < 2) {
            $(".swiper-pagination").hide();
        }
        }
    }


  if (isInclude("wow.min.js")) {
    if (!/msie [6|7|8|9]/i.test(navigator.userAgent)) {
      new WOW().init();
    }
  }

  $("#menu-btn").click(function () {
    if ($(this).hasClass("menu-btn-close")) {
      $(this).removeClass("menu-btn-close");
      $("#menu-item").fadeOut();
      $(".header").css("height", "55px");
      $("body").css("overflow", "auto");
    } else {
      $(this).addClass("menu-btn-close");
      $("#menu-item").fadeIn();
      $(".header").css({
        height: "100%",
        backgroundColor: "#fff",
      });
      $("body").css("overflow", "hidden");
    }
  });

  if (
    $("[data-show] li").length > parseInt($("[data-show]").data("num")) &&
    !IsPC()
  ) {
    $(".envir-more").css("display", "block");
  }

  var j = 0;
  $(".envir-more").click(function () {
    j++;
    if (j % 2) {
      $(this).addClass("retract").html("点击收起更多");
      $(this).siblings("[data-show=true]").addClass("open");
    } else {
      $(this).removeClass("retract").html("点击查看更多");
      $(this).siblings("[data-show=true]").removeClass("open");
    }
  });

  // 视频播放
  $(".playVideo").each(function () {
    //遍历视频列表
    var videoPath = $(this).data("path");
    if (videoPath) {
      $(this).click(function () {
        $("body").append(
          '<div class="video-overview open" onclick="removeVideo()">' +
            '<div class="video-card" onclick="stopFun()">' +
            '<video controls autoplay preload="auto" src="' +
            videoPath +
            '"></video>' +
            '<div class="videotop-tool">' +
            '<img onclick="removeVideo()" src="/images/close-video.png" alt="关闭">' +
            "</div>" +
            "</div>" +
            "</div>"
        );
      });
    }
  });
});

function stopFun(e) {
  var e = event || window.event;
  e.stopPropagation();
}
function removeVideo(){
  $(".video-overview video").attr('src', '')
  $(".video-overview").remove();
}

//验证正整数

function isInteger(s) {
  var re = /^[0-9]+$/;
  return re.test(s);
}

function dropdwon() {
  $(".select-skin").each(function () {
    var s = $(this);
    var z = parseInt(s.css("z-index"));
    var select_header = $(this).children(".select-title");
    var select_body = $(this).children(".select-list");
    var _show = function () {
      select_body.slideDown(200);
      select_header.addClass("cur");
      s.css("z-index", z + 1);
    };
    var _hide = function () {
      select_body.slideUp(200);
      select_header.removeClass("cur");
      s.css("z-index", z);
    };
    $(this).on("click", select_header, function () {
      select_body.is(":hidden") ? _show() : _hide();
    });

    $(this).on("click", "dd", function () {
      select_header.find("input[type=text]").val($(this).html());
      _hide();
      select_header.find("input[type=hidden]").val($(this).data("value"));
      _hide();
    });

    $("body").click(function (i) {
      !$(i.target).parents(".select-skin").first().is(s) ? _hide() : "";
    });
  });
}
//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}

function heade_Countup(t, start, end) {
  var type = t ? t : 1;
  var jgnum = end - start;

  if (type == 1) {
    // 拦截次数
    var options = {
      useEasing: false,
      useGrouping: true,
      separator: ",",
      decimal: ".",
    };
    //var left_num = $('#left_num').html();
    var demo = new CountUp("left_num", start, end, 0, 180, options);

    if (!demo.error) {
      demo.start();
    } else {
      console.error(demo.error);
    }
  }

  if (type == 2) {
    // 攻击次数
    var options = {
      useEasing: false,
      useGrouping: true,
      separator: ",",
      decimal: ".",
    };
    //var middle_num = $('#middle_num').html();
    var demo = new CountUp("middle_num", start, end, 0, 120, options);
    if (!demo.error) {
      demo.start();
    } else {
      console.error(demo.error);
    }
  }

  if (type == 3) {
    // ip
    var options = {
      useEasing: false,
      useGrouping: true,
      separator: ",",
      decimal: ".",
    };
    //var right_num = $('#right_num').html();
    var demo = new CountUp("right_num", start, end, 0, 240, options);
    if (!demo.error) {
      demo.start();
    } else {
      console.error(demo.error);
    }
  }
}

//判断是否有引入某个js/css文件
function isInclude(name) {
  var js = /js$/i.test(name);
  var es = document.getElementsByTagName(js ? "script" : "link");
  for (var i = 0; i < es.length; i++)
    if (es[i][js ? "src" : "href"].indexOf(name) != -1) return true;
  return false;
}

// 高斯模糊贴顶(首页、活动页) 白底不贴顶(正常情况、有跳转) 白底贴顶(没有跳转)
function setfixedNav() {
  if (!$("#skip-box").length) {
    if ($(window).scrollTop() > 0) {
      $(".header").addClass("header-fixed")
    } else if ((!$(".header").hasClass("noBanner") && $(window).width() > 1024) || !$('.header').hasClass('.hidden-header')) {
      $(".header").removeClass("header-fixed")
    }
  }
}
setfixedNav()
$(window).scroll(function() {
  setfixedNav()
})

function setNav() {
  if (window.innerWidth <= 1023) {
    $(".sub").parent().addClass("active");
    $(".nav>ul>li>a").each(function () {
      if ($(this).hasClass("active")) $(this).parent().find(".sub").show();
    });
    $(".nav>ul>li").click(function () {
      $(this).parent().find("a").removeClass("active");
      $(this).find(">a").addClass("active");
      $(this).parent().find(".sub").hide();
      if ($(this).find(">.sub").length) {
        $(this).find(">.sub").show();
      }
    });
    $(".nav>ul>li.active .sub dl dt").click(function (e) {
      $(this).parents(".sub").find("dl").removeClass("opened");
      $(this).parent().addClass("opened");
    });
    $(".sub dd").click(function (e) {
      e.stopPropagation();
    });
  } else {
    $(".nav>ul>li")
      .hover(function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
        $(this).find(".sub").addClass("new-sub");
        $('.nav-search').removeClass('is-open');
        $('.nav-search-input').blur();
      })
      .mouseleave(function () {
        $(".nav>ul>li").removeClass("active");
        $(this).find(".sub").removeClass("new-sub");
        $(".new-sub").remove();
      });
  }
}

/**
 * QQ显示
 * @param bool_type
 */
function showqq(bool_type) {
  if (bool_type) {
    $(".showqq").fadeIn();
    $(".mask").show();
  } else {
    $(".showqq").hide();
    $(".mask").hide();
  }
}

 

/**
 *  获取cookie
 * @param name
 * @returns {*}
 */
function getCookie(name) {
  var arr,
    reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");

  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

function getFirst(name) {
  var cookie = document.cookie;
  var arrcookie = cookie.split("; ");

  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split("=");
    if (arr[0] == name) {
      return unescape(arr[1]);
    }
  }
}

//打开新页面
function newWin(url) {
  var link = document.createElement("a");
  link.href = url;
  link.target = "_black";
  document.body.appendChild(link);
  link.click();
}

//下载文件
function download(url, name = "") {
  var link = document.createElement("a");
  link.download = name;
  link.href = url;
  link.click();
}

/**
 * 转化时间戳或日期对象为日期格式字符
 *
 * @param {Date|String} time    可以是日期对象，也可以是毫秒数
 * @param {String} format       日期字符格式（默认：yyyy-MM-dd HH:mm:ss），可随意定义，如：yyyy年MM月dd日
 * @returns {String}
 *
 * @example toDateString(new Date(), 'yyyy-MM-dd HH:mm:ss') / toDateString(1606469850000, 'yyyy-MM-dd HH:mm:ss')
 */
function toDateString(time, format) {
  //数字前置补零
  function digit(num, length) {
    var str = "";
    num = String(num);
    length = length || 2;
    for (var i = num.length; i < length; i++) {
      str += "0";
    }
    return num < Math.pow(10, length) ? str + (num | 0) : num;
  }
  var date = new Date(time || new Date()),
    ymd = [
      digit(date.getFullYear(), 4),
      digit(date.getMonth() + 1),
      digit(date.getDate()),
    ],
    hms = [
      digit(date.getHours()),
      digit(date.getMinutes()),
      digit(date.getSeconds()),
    ];

  format = format || "yyyy-MM-dd HH:mm:ss";

  return format
    .replace(/yyyy/g, ymd[0])
    .replace(/MM/g, ymd[1])
    .replace(/dd/g, ymd[2])
    .replace(/HH/g, hms[0])
    .replace(/mm/g, hms[1])
    .replace(/ss/g, hms[2]);
}

//16进制转RGB
function colorToRGB(color, opt) {
  var color1, color2, color3;
  color = "" + color;
  if (typeof color !== "string") return;
  if (color.charAt(0) == "#") {
    color = color.substring(1);
  }
  if (color.length == 3) {
    color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
  }
  if (/^[0-9a-fA-F]{6}$/.test(color)) {
    color1 = parseInt(color.substr(0, 2), 16);
    color2 = parseInt(color.substr(2, 2), 16);
    color3 = parseInt(color.substr(4, 2), 16);
    return "rgb(" + color1 + "," + color2 + "," + color3 + "," + opt + ")";
  }
}

var browser = {
  versions: (function () {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      //移动终端浏览器版本信息
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf("MicroMessenger") > -1, //是否微信
      qq: u.match(/\sQQ/i) == " qq", //是否QQ
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};


