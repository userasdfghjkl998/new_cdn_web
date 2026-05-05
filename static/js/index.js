$(function () {
  this.wave = wavify("#wave01", {
    height: 20,
    bones: 3,
    amplitude: 80,
    color: "url(#wave-lg)",
    speed: 0.1,
  });

  /* section03 */
  // $('.block-item-hover li').hover(function () {
  //      var id = $(this).data('id');
  //      $('.detail-wrapper').find('[data-item]').hide();
  //      $('.detail-wrapper').find('[data-item='+ id +']').fadeIn();
  // }).mouseleave(function () {
  //     $('.detail-wrapper').find('[data-item]').hide();
  // });

  /* section04 线段 */
  var idx = 0,
    timer = "";
  $(".location-list li")
    .hover(function () {
      clearInterval(timer);
      idx = $(this).index();
      $(".map-path").attr("data-path", $(this).index());
    })
    .mouseleave(function () {
      timer = setInterval(function () {
        $(".map-path").attr("data-path", idx++ % 7);
      }, 3000);
    });

  //数字增长
  // var dataFlag = true;
  // $(window).scroll(function () {
  //     var windowScrollT = $(window).scrollTop();
  //     if( windowScrollT > $('#NumberGrow').offset().top - 550 && dataFlag){
  //         $('.animateNum').each(function () {
  //             NumberGrow(this);
  //         });
  //         dataFlag = false;
  //     }
  // });

  var time1, time2;

  // function goAnimate(){
  //     var arr = [
  //         "M87.681,487.053l363.18-156.737a19.922,19.922,0,0,1,15.273-.255l56.662,22a18.667,18.667,0,0,0,14.027-.123l63.946-28.689L658,349,979,204",
  //         "M87.681,487.053l363.18-156.737a19.922,19.922,0,0,1,15.273-.255l56.662,22a18.667,18.667,0,0,0,14.027-.123l146.946-63.689c4.17-1.774,4.256-6.564.153-8.436L540.94,219.663a18.426,18.426,0,0,0-14.51-.194L377.109,283.34c-3.9,1.643-3.992,6.113-.168,7.863l25.545,9.886c2.822,1.292,2.74,4.594-.145,5.793L-0.588,477.41",
  //         "M-0.588,475.41L400.341,306.882c2.885-1.2,2.967-4.5.145-5.793L374.941,291.2c-3.824-1.75-3.728-6.22.168-7.863L409,268l-19-6a22.843,22.843,0,0,0-14,1c-7.5,3-35,13-35,13s-4,3-13-1l-96-39L678,32",
  //         "M340.026,331.125L69.438,197.587c-4.646-2.108-4.565-7.525.143-9.542L301.283,82.3a29.528,29.528,0,0,1,22.608-.079l117.725,49.726",
  //         "M414.514,268.975l-23.506-9.387a12.05,12.05,0,0,0-9.084.058L341.749,275.78a11.423,11.423,0,0,1-8.844-.039L224.177,232.159,672.187,28",
  //         "M198.005,130.334l207.764,88.808a30.411,30.411,0,0,0,23.355.1L580,155.9a32.083,32.083,0,0,1,23.989-.154L852.279,262.811",
  //         "M173.673,450.053L452.617,330.316a19.892,19.892,0,0,1,15.261-.255l56.615,22a18.634,18.634,0,0,0,14.014-.123L602.4,324.252,837.433,430,1127.19,276s9.34-5.588-10.99-13L895.384,172s-10.931-3.838-21.981,0-118.9,52-118.9,52",
  //         "M205.333,388.432l195.213-82.443c2.74-1.143,2.819-4.287.137-5.517l-24.275-9.413c-3.633-1.667-3.542-5.923.16-7.488l151.193-66.377a17.469,17.469,0,0,1,13.788.184l82.761,34.987a8.37,8.37,0,0,0,6.386.006l20.841-6.575a2.4,2.4,0,0,0,.044-4.6l-15.655-7.646a4.533,4.533,0,0,1-2.966-4.015v-17.17a4.824,4.824,0,0,1,3.085-4.255l210.221-93.476c5.337-2.422,5.244-8.647-.165-10.963L611.969,5.24A33.915,33.915,0,0,0,586,5.15L448.564,61.732"
  //     ];
  //     svgAnimate(arr[random(0,7)]);
  //     time1 = setInterval(function (args) { {
  //         svgAnimate(arr[random(0,7)])
  //     } },16000);
  // }

  function clearAnimate() {
    clearInterval(time1);
  }

  function randBubble() {
    time2 = setInterval(function (args) {
      $(".section04 li").removeClass("active");
      $(".section04 li")
        .eq(random(0, $(".section04 .info li").length))
        .addClass("active");
    }, 5000);
  }

  $(".section04 li")
    .mouseenter(function () {
      $(".section04 li").removeClass("active");
      $(this).addClass("active");
      clearBubble();
    })
    .mouseleave(function () {
      randBubble();
    });

  function clearBubble() {
    clearInterval(time2);
  }

  document.onvisibilitychange = function () {
    if (document.hidden) {
      clearAnimate();
    } else {
      // goAnimate();
    }
  };
  // goAnimate();
  randBubble();

  var slidePerView01 = 5,
    slidePerView02 = 7,
    spaceBetween = 20;
  if ($(window).width() < 850 && $(window).width() > 640) {
    slidePerView02 = 5;
    spaceBetween = 20;
    slidePerView01 = 3;
  } else if ($(window).width() < 640) {
    slidePerView01 = 1;
    slidePerView02 = 3;
    spaceBetween = 10;
  }

  if ($(window).width() < 768) {
    $(".block-item-tab li").click(function () {
      $(this).siblings().removeClass("on");
      $(this).addClass("on");
      $(".block-item-hover").find("[data-id]").removeClass("on");
      $(".block-item-hover")
        .find("[data-id=" + $(this).data("id") + "]")
        .addClass("on");
    });
  }

  /* 基础建设 */
  var honorswiper = new Swiper(".honor-swiper-6", {
    slidesPerView: "auto",
    speed: 4000, //滚动速度
    freeMode: true,
    loop: true,
    spaceBetween: 30,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      loopPreventsSlide: true,
    },
    paginationClickable: true,
    observer: true,
    observeParents: true,
    onImagesReady: function () {
      honorswiper.startAutoplay();
    },
  });

  /* 关于快快 */
  var honorswiper2 = new Swiper(".honor-swiper-8", {
    slidesPerView: 8,
    spaceBetween: 57,
    loop: true,
    autoplay: {
      disableOnInteraction: false,
      delay: 3000,
    },
  });

  /* 客户案例 */
  var partnercontainer = null;
  function initPartnerCssMarquee() {
    if ($(window).width() <= 1023) return;
    var box = document.querySelector(".partner-section .partner-container-box");
    var wrapper = document.querySelector(".partner-section .partner-container-box .swiper-wrapper");
    if (!box || !wrapper || wrapper.dataset.cssMarqueeInited === "1") return;
    if (!wrapper.children || wrapper.children.length < 2) return;

    wrapper.dataset.cssMarqueeInited = "1";
    wrapper.innerHTML = wrapper.innerHTML + wrapper.innerHTML;
    var halfHeight = wrapper.scrollHeight / 2;
    var offset = 0;
    var speed = 0.45; // 持续慢速（但肉眼可感知）
    var rafId = null;

    function tick() {
      offset += speed;
      if (offset >= halfHeight) offset = 0;
      wrapper.style.transform = "translate3d(0,-" + offset + "px,0)";
      rafId = window.requestAnimationFrame(tick);
    }

    tick();
  }
  function initPartnerVerticalMarquee() {
    if ($(window).width() <= 1023) return;
    var box = document.querySelector(".partner-section .partner-container-box");
    var wrapper = document.querySelector(".partner-section .partner-container-box .swiper-wrapper");
    if (!box || !wrapper || wrapper.dataset.marqueeInited === "1") return;

    var slides = wrapper.children;
    if (!slides || slides.length < 2) return;

    wrapper.dataset.marqueeInited = "1";
    wrapper.innerHTML = wrapper.innerHTML + wrapper.innerHTML;

    var halfHeight = wrapper.scrollHeight / 2;
    var offset = 0;
    var speed = 0.35;
    var rafId = null;

    function step() {
      offset += speed;
      if (offset >= halfHeight) offset = 0;
      wrapper.style.transform = "translate3d(0,-" + offset + "px,0)";
      rafId = window.requestAnimationFrame(step);
    }

    box.addEventListener("mouseenter", function () {
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = null;
    });
    box.addEventListener("mouseleave", function () {
      if (!rafId) step();
    });

    step();
  }

  if ($(window).width() > 1023) {
    initPartnerCssMarquee();
  }

  if ($(window).width() <= 1023) {
    partnercontainer = new Swiper(".partner-container-box", {
      slidesPerView: "auto",
      speed: 4000, //滚动速度
      freeMode: true,
      loop: true,
      spaceBetween: 4,
      autoplay: {
        delay: 0,
        disableOnInteraction: false, //就算触摸了也继续滚动
        loopPreventsSlide: true,
      },
      paginationClickable: true,
      observer:true,
      observeParents:true,
    });
  }

  /* 万千客户的共同选择 */
  if ($(window).width() <= 1023) {
    var userswiper = new Swiper(".user-swiper", {
      slidesPerView: "auto",
      spaceBetween: 15,
      loop: true,
      loopedSlides: 4,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      observer: true,
      observeParents: true,
    });
    if (userswiper && !userswiper.autoplay) {
      setInterval(function () {
        if (userswiper && typeof userswiper.slideNext === "function") {
          userswiper.slideNext();
        }
      }, 5000);
    }
  } else {
    var userswiper = new Swiper(".user-swiper", {
      noSwiping: true,
      loop: true,
      navigation: {
        nextEl: ".right-icon",
        prevEl: ".left-icon",
      },
      autoplay: {
        delay: 5000,
      },
      // allowTouchMove: false,  //鼠标拖动切换
    });

    // 兼容兜底：部分旧版 Swiper 配置差异会导致 autoplay 失效
    if (userswiper && !userswiper.autoplay) {
      setInterval(function () {
        if (userswiper && typeof userswiper.slideNext === "function") {
          userswiper.slideNext();
        }
      }, 5000);
    }
  }

  $(window).resize(function () {
    if ($(window).width() < 850 && $(window).width() > 640) {
      swiper02.params.slidesPerView = 5;
    } else if ($(window).width() < 640) {
      swiper02.params.slidesPerView = 3;
    }
  });

  //悬浮导航不滚动
    if ($(window).width() > 1023) {
        $(".header").hover(
          function () {
            var top = $(document).scrollTop();
            $(document).on("scroll.unable", function (e) {
              $(document).scrollTop(top);
            });
          },
          function () {
            $(document).off("scroll.unable");
          }
        );
    }

});


//控制数字增长
// var NumberGrow = function NumberGrow(element, options) {
//     options = options || {};
//     var $this = $(element),
//         time = options.time || parseInt($this.attr('data-time')),
//         num = options.num?options.num:$this.attr('data-value'),
//         step = num * 7 / (time * 1000), start = 0, interval, old = 0;

//     interval = setInterval(function () {
//         start = start + step;
//         if (start >= num) {
//             clearInterval(interval);
//             interval = undefined;
//             start = num;

//         }
//         var t;
//         if ($this.hasClass('percent-data')) {
//             if(typeof start !== 'string'){
//                 t = start.toFixed(9);
//             }else{
//                 t = start
//             }
//         } else {
//             t = Math.floor(start);
//         }
//         if (t == old) {
//             return;
//         }
//         old = t;
//         if ($this.hasClass('percent-data')) {
//             $this.text(old.toString());
//         } else {
//             $this.text(old.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
//         }
//     }, 30);
// };

// function svgAnimate(path){
//     var snap = Snap("#dcSvg");
//     var p01 = snap.path(path);
//     var len = p01.getTotalLength();
//     var circle01 =  snap.ellipse(0,0,12,6).attr({fill: "#fff",stroke: "none"});
//     var circle02 =  snap.ellipse(0,0,7,3).attr({fill: "#4c89f0",stroke: "none"});
//     var circle03 =  snap.ellipse(0,0,12,6).attr({fill: "#fff",stroke: "none"});
//     var circle04 =  snap.ellipse(0,0,7,3).attr({fill: "#4c89f0",stroke: "none"});

//     p01.attr({"stroke-dasharray": len + " " + len,"stroke-dashoffset": len});
//     setTimeout( function() {
//         Snap.animate(0, len, function( value ) {
//             p01.attr({"stroke-dashoffset": len-value});
//             var startPoint = p01.getPointAtLength( 0 );
//             var endPoint = p01.getPointAtLength( value );
//             circle01.attr({ cx: startPoint.x, cy: startPoint.y });
//             circle02.attr({ cx: startPoint.x, cy: startPoint.y });
//             circle03.attr({ cx: endPoint.x, cy: endPoint.y });
//             circle04.attr({ cx: endPoint.x, cy: endPoint.y });
//         }, 8000,mina.easeinout,function () {
//             Snap.animate(0, len, function( value ) {
//                 p01.attr({"stroke-dashoffset": -value});
//                 var startPoint = p01.getPointAtLength( len );
//                 var endPoint = p01.getPointAtLength( value );
//                 circle01.attr({ cx: endPoint.x, cy: endPoint.y });
//                 circle02.attr({ cx: endPoint.x, cy: endPoint.y });
//                 circle03.attr({ cx: startPoint.x, cy: startPoint.y });
//                 circle04.attr({ cx: startPoint.x, cy: startPoint.y });
//             }, 8000,mina.easeinout,function () {
//                 p01.remove();
//                 circle01.animate({"opacity": 0},500,mina.easeinout,function () {
//                     circle01.remove();
//                 });
//                 circle02.animate({"opacity": 0},500,mina.easeinout,function () {
//                     circle02.remove();
//                 });
//                 circle03.animate({"opacity": 0},500,mina.easeinout,function () {
//                     circle03.remove();
//                 });
//                 circle04.animate({"opacity": 0},500,mina.easeinout,function () {
//                     circle04.remove();
//                 });
//                 return true;
//             });
//         });
//     });
// }


/* footer */
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Point = function (_F3$Obj) {
    _inherits(Point, _F3$Obj);

    function Point() {
        var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

        _classCallCheck(this, Point);

        var _this = _possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this));

        _this.radius = radius;
        _this.color = 'rgba(' + [Math.random() * 255 | 0, Math.random() * 255 | 0, Math.random() * 255 | 0, Math.random()].join(',') + ')';
        _this.prevCrood = null;
        return _this;
    }

    _createClass(Point, [{
        key: 'render',
        value: function render(ctx) {

            ctx.fillStyle = '#62bfed';
            ctx.fillRect(this.croods2D.position.x, this.croods2D.position.y, this.radius * this.croods2D.scale * this.yScale, this.radius * this.croods2D.scale * this.yScale);
        }
    }]);

    return Point;
}(F3.Obj);

var planeFunctions = {
    'sin(sqrt(x^2+z^2))': function sinSqrtX2Z2(x, z, offset) {
        return Math.sin(Math.sqrt(Math.pow(x / 2, 2) + Math.pow(z / 2, 2)) - offset);
    },
    'cos(x)*sin(z)': function cosXSinZ(x, z, offset) {
        return Math.cos(x / 4 + offset) * Math.sin(z / 4 + offset) * 1;
    }
};

var Effect = function (_F3$Time) {
    _inherits(Effect, _F3$Time);
    function Effect(renderer, scene, camera, cvs) {
        _classCallCheck(this, Effect);
        var _this2 = _possibleConstructorReturn(this, (Effect.__proto__ || Object.getPrototypeOf(Effect)).call(this));
        _this2.renderer = renderer;
        _this2.scene = scene;
        _this2.camera = camera;
        _this2.cvs = cvs;
        _this2.xOffset = 0;
        _this2.waveHeight = 0.4; // 波高
        _this2.waveWidth = 8; // 波长
        _this2.col = 33;
        _this2.colPointNum = 60;
        _this2.flyTime = 2000;
        _this2.timePass = 0;
        _this2.scale = 1;
        _this2.scaleStep = 0.01;
        _this2.planeFunction = function () {
            return 0;
        };
        _this2.rotate = { x: false, y: false, z: false };

        _this2.pointGroup = new F3.Obj();
        _this2.scene.add(_this2.pointGroup);

        _this2.resize(cvs.width, cvs.height);
        _this2.init();
        return _this2;
    }

    _createClass(Effect, [{
        key: 'resize',
        value: function resize(width, height) {
            this.cvs.width = width;
            this.cvs.height = height;
            // this.pointGroup.position.set(this.cvs.width/2, this.cvs.height, 0);
            this.stepWidth = width * 1.8 / this.col;
            this.pointGroup.setPosition(this.cvs.width / 2, this.cvs.height * 1.2, -this.col * this.stepWidth / 2);
            this.pointGroup.setRotation(0.1, 0, 0);
            // this.waveHeight = height/2;
            // this.waveWidth = this.waveHeight * 4;
            // console.log(this.stepWidth);
        }
    }, {
        key: 'init',
        value: function init() {
            // create point
            var point;
            for (var x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
                for (var z = -(this.colPointNum - 1) / 2; z <= (this.colPointNum - 1) / 2; z++) {
                    point = new Point(10);
                    this.pointGroup.add(point);
                    /*point.initPos = new F3.Vector3(
                         x + Math.random() * -2 + 1,
                         -30 + -10 * Math.random(),
                         z + Math.random() * -2 + 1
                    );*/
                    point.initPos = new F3.Vector3(0, 0, 0);
                    point.flyDelay = 0; //Math.random() * 1000 | 0;
                }
            }
        }
    }, {
        key: 'update',
        value: function update(delta) {
            this.timePass += delta;
            this.xOffset = this.timePass / 500;

            var point = void 0;
            var flyPecent = void 0;
            var x = void 0,
                y = void 0,
                z = void 0;
            var count = 0;

            // if (this.timePass < 100)
            for (x = -(this.col - 1) / 2; x <= (this.col - 1) / 2; x++) {
                for (z = -(this.colPointNum - 1) / 2; z <= (this.colPointNum - 1) / 2; z++) {

                    // var y = Math.cos(x*Math.PI/this.waveWidth + this.xOffset)*Math.sin(z*Math.PI/this.waveWidth + this.xOffset) * this.waveHeight;

                    y = this.planeFunction(x, z, this.xOffset);
                    // var y = Math.sin(Math.sqrt(Math.pow(x/v, 2)+Math.pow(z/v, 2)) - this.xOffset) * 1
                    // console.log(y);

                    point = this.pointGroup.children[count];
                    point.yScale = 1; //(-y + 0.6)/(this.waveHeight) * 1.5;

                    flyPecent = (this.timePass - point.flyDelay) / this.flyTime;
                    flyPecent = flyPecent > 1 ? 1 : flyPecent < 0 ? 0 : flyPecent;

                    point.setPosition(x * this.stepWidth, y * this.stepWidth, z * this.stepWidth);
                    count++;
                }
            }
            if (this.rotate.x || this.rotate.y || this.rotate.z) {
                this.pointGroup.setRotation(this.rotate.x ? this.pointGroup.rotation.x + 0.001 : 0, this.rotate.y ? this.pointGroup.rotation.y + 0.001 : 0, this.rotate.z ? this.pointGroup.rotation.z + 0.001 : 0);
            }
        }
    }, {
        key: 'setFunction',
        value: function setFunction(fun) {
            this.planeFunction = fun;
        }
    }, {
        key: 'toggleRotate',
        value: function toggleRotate(r) {
            this.rotate[r] = !this.rotate[r];
            if (!this.rotate[r]) {
                this.pointGroup.rotation[r] = 0;
            }
        }
    }, {
        key: 'animate',
        value: function animate() {
            var _this3 = this;

            this.addTick(function (delta) {
                _this3.update(delta);
                _this3.renderer.render(_this3.scene, _this3.camera);
            });
        }
    }]);

    return Effect;
}(F3.Time);


function random(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;
}

