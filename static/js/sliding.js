var WIDGETS = {
    imgSmoothCheck: undefined
};
var _widgets = {
    default:
        {
            noop:
                function() {}
        }
};
WIDGETS.imgSmoothCheck = function(options) {
    return new Sliding(options);
};

function Sliding(opt){
    this.options = $.extend({}, Sliding.DEFAULTS, $.isPlainObject(opt) && opt);
    this.$sel = $(this.options.selector);
    this.$smoothCir = '';
    this.$imgFragmentCnt = '';
    this.flag = false;
    this.disabled = false;
    this.canvasOption = {};
    this.position = 0;
    this.$srcImg = '';
    this.init();
}
Sliding.prototype = {
    init:function(){
        if(!this.$sel) return;
        this.render();
        this.bind();
    },

    render:function(){
        var loadding = '<div class="sliding-loadding"><img src="../images/loadding.gif"/><p>加载中...</p></div>';
        var html =
          '<a class="close iconfont" href="javascript:;">&#xe816;</a>\n' +
          '                                <div class="sliding-img-display">\n' +
          '                                    <p>拖动下列滑块完成拼图<a href="javascript:;" class="sliding-icon-refresh fr"><span class="iconfont" style="font-size:13px;margin:0 10px 0 18px">&#xe675;</span>刷新</a></p>\n' +
          '                                    <div class="sliding-img-cnt">' +
          '                                    <img class="sliding-img-fragment-cnt"/>' +
          '                                    <img class="sliding-img-src"/>' +
          loadding +
          "                               </div>" +
          "                                </div>\n";

        var slideBtn = '',smoothCir = '';
        if(!this.options.slideBtn){
            smoothCir =
              '<div class="sliding-smooth-circle"><img src="/images/new_kkidc/dengbao/jiantou.png" alt=""></div>\n';
            slideBtn = '<div class="sliding-smooth-cnt">\n' +
                '                                    <div class="sliding-smooth-bar"></div>\n' + smoothCir +
                '                                </div>';
        }


        this.$sel.addClass('sliding-img-check-box');
        this.$sel.html(html + slideBtn);

        this.$smoothCir =!this.options.slideBtn?this.$sel.find('.sliding-smooth-circle'):$(this.options.slideBtn);
        this.$srcImgCnt = this.$sel.find(".sliding-img-src");
        this.$imgFragmentCnt = this.$sel.find(".sliding-img-fragment-cnt");
        this.$loadding = this.$sel.find(".sliding-loadding");
        this.$slidingBar = !this.options.slideBar?false:$(this.options.slideBar);
        this.initImg()
    },
    /* 加载图片 */
    initImg: function(){
        this.$loadding.show();
        var t = this;
        $.get(this.options.imgApi, function(result){
            // console.log(result)
            t.$srcImgCnt.attr('src', result.data.back_img);
            t.$imgFragmentCnt.attr('src',result.data.cover_img);
            t.$loadding.hide()
        });
    },
    /* 绑定事件 */
    bind: function(){
        var that = this;

        var blnIsMobile = /Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent) || (navigator.platform == 'MacIntel' && navigator.maxTouchPoints > 1);
        var sSmoothStart = "mousedown";
        var sSmoothMove = "mousemove";
        var sSmoothEnd = "mouseup";
        if (blnIsMobile) {
            sSmoothStart = "touchstart";
            sSmoothMove = "touchmove";
            sSmoothEnd = "touchend";
        }

        var originX, originY, trail = [];
        /* 鼠标拖动 - 开始*/
        that.$smoothCir.on(sSmoothStart,function(e) {
            if(that.disabled)return;
            that.$sel.css('visibility','visible');
            originX = blnIsMobile?e.targetTouches[0].pageX:e.clientX;
            originY = blnIsMobile?e.targetTouches[0].pageY:e.clientY;
            that.flag = true;
            e.preventDefault();
            /* 鼠标拖动 - 进行中*/
            document.addEventListener(sSmoothMove,function(e) {
                if (!that.flag) return false;
                var moveX = (blnIsMobile?e.targetTouches[0].pageX:e.clientX) - originX;
                var moveY = (blnIsMobile?e.targetTouches[0].pageY:e.clientY) - originY;
                var btn_w = that.$smoothCir.closest('.sliding-btn').width() || that.$smoothCir.closest('.sliding-smooth-cnt').width();
                trail.push(moveY);  //存 trail
                if (moveX < 0 || moveX + 50 >= btn_w) return false;
                that.$smoothCir.addClass('moving');
                that.$imgFragmentCnt.css("left", moveX /btn_w*100 + "%");
                that.$smoothCir.css("left", moveX + "px");
                if(that.$slidingBar) that.$slidingBar.css("width", moveX + 25 + "px");
                e.preventDefault();
            });

            /* 鼠标拖动 - 结束*/
            document.addEventListener(sSmoothEnd,function(e) {
                if(!that.flag) return false;
                that.flag = false;
                var posX = blnIsMobile?e.changedTouches[0].pageX:e.clientX;
                if(posX == originX) return false;
                that.$smoothCir.parents('.sliding-btn').removeClass('success').removeClass('error');
                /* 验证 */
                var TuringTest = that.verify(trail).TuringTest;
                if(TuringTest){
                    /* 人为拖动 */
                    var val = parseInt(that.$imgFragmentCnt.css('left'));
                    var curr = Date.parse(new Date()).toString();

                    that.options.change(curr.substr(0,11)+val, that);
                }else{
                    /* 机器拖动 */
                    that.error()
                }
                that.$smoothCir.removeClass('moving');
                e.preventDefault();
            });
        });

        that.$sel.find(".sliding-icon-refresh").on("click",function() {
            that.refresh();
        });

        that.$sel.find(".close").on("click",function() {
            that.$sel.css('visibility','hidden');
            that.reset();
        });
    },

    /* 验证拖动是否人为拖动 */
    verify: function(trail){
        var average = trail.reduce(this.sum) / trail.length;
        var deviations = trail.map(function(x){
            return x - average;
        }); //偏差数组
        var stddev = Math.sqrt(deviations.map(this.square).reduce(this.sum) / trail.length); // 标准差
        return {
            TuringTest: average !== stddev   // 只是简单的验证拖动轨迹，相等时一般为0，表示可能非人为操作
        }
    },

    /* 求和 */
    sum: function(x,y){
        return x + y
    },

    /* 求平方 */
    square: function(x) {
        return x * x
    },


    /*刷新事件*/
    refresh: function() {
        this.initImg();
        this.$imgFragmentCnt.css("left",0 + 'px');
        if(this.$slidingBar) this.$slidingBar.css("width", "0px");
        this.$smoothCir.css("left", "0px");
        this.flag = false;
    },


    /* 重置 图形验证码 */
    reset: function(){
        this.$smoothCir.parents('.sliding-btn').removeClass('success').removeClass('error');
        this.$sel.css('visibility','hidden');
        this.refresh();
    },

    success: function() {
        this.$smoothCir.parents('.sliding-btn').addClass('success');
        return true;
    },

    error: function() {
        this.$smoothCir.parents('.sliding-btn').addClass('error');
        this.options.error('再试一次');
        this.refresh();
        return true;
    },

    disabledSliding: function(bool){
        this.disabled = bool;
        this.$smoothCir.closest('.sliding-btn').attr('data-disabled',bool);
    }

};

Sliding.DEFAULTS = {
    default:'',
    imgWidth: 285,
    imgHeight: 160,
    imgFragmentW: undefined,
    imgFragmentH: undefined,
    slideBtn: undefined,
    change: _widgets.
        default.noop,
    success: _widgets.
        default.noop,
    error: _widgets.
        default.noop
};
