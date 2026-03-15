$(function(){
    $("input[name=level]").each(function(){
        $(this).click(function(){
            if ($(this).val() == 2) {
                $('.product_text[data-type="1"]').hide()
                $('.product_text[data-type="2"]').fadeIn()
            } else {
                $('.product_text[data-type="2"]').hide()
                $('.product_text[data-type="1"]').fadeIn()
            }
        });
    });

    $('#distpicker').distpicker();
    $('.showCalc').click(function(){
        $('.dengbao-calculator,.calc-overlay').fadeIn()
    })
    $('.calc-overlay').click(function(e){
        $('.dengbao-calculator,.calc-overlay').fadeOut()
    })

    $('.calc-header .icon-close').click(function(){
        $('.calc-overlay').click()
    })
    
    $(window).ready(function(){
        if (window.performance.navigation.type == 1) return
        location.pathname.indexOf('servicesafe/guarante') > -1 && $('.dengbao-calculator,.calc-overlay').fadeIn()
    })

    // var time = 10;
    // var countdown = sessionStorage.getItem('coutdown1') || ''
    // var timer = setInterval(function(){
    //     if(!countdown && time <= 0) {
    //         $('.dengbao-calculator,.calc-overlay').fadeIn()
    //         sessionStorage.setItem('coutdown1',1)
    //         clearInterval(timer)
    //     }
    //     time--
    // },1000)

    // 开始计算
    $('.startCalc').click(function(){
        // price_phone_sliding.reset();
        var province = $('#province').val();
        var city = $('#city').val();
        var c_room = $('input[name=conputer_room]:checked').val(); // 1 共有云 2 线下机房
        var level = $('input[name=level]:checked').val();// 1 二级 2 三级
        var server_num = $('input[name=server_num]').val();
        var hadApp = $('input[name=hadApp]:checked').val();// 1 是 2 否
        var safepro = $('input[name=safepro]:checked').val();// 1 是 2 否
        var phone = $('input[name=phone]').val();
        var yzcode = $('input[name=yzcode]').val();

        var isPhone = /^((\(\d{2,3}\))|(\d{3}\-))?(13|15|18|14|17|16|19)\d{9}$/.test(phone)

        if(!province || !city) return layer.msg('请选择所在城市');
        if(!server_num) return layer.msg('请输入服务器数量');
        if(!phone) return layer.msg('请输入手机号码');
        if(!isPhone) return layer.msg('请输入正确的手机号码');
        if(!yzcode) return layer.msg('请输入验证码');

        var parms = {
            province: province,
            city: city,
            idc_type: c_room,
            dengbao_level: level,
            ecs_num: server_num,
            is_app: hadApp,
            is_product: safepro,
            phone: phone,
            yzcode: yzcode
        }
        $.post(url_guarantee_price, parms, function (data) {
            if (data.code == 1) {
                $('.total_fee').html(data.data.total_price);
                $('.consulting_fee').html(data.data.ask_price);
                $('.grading-fee').html(data.data.rank_price);
                $('.evaluation-fee').html(data.data.eval_price);
                $('.product-fee').html(data.data.product_price);
                $('.all_ask_count').html(data.data.all_num_ask);
                $.myGlobalVar = "1";
            } else {
                layer.msg(data.msg || '数据返回异常，请联系客服');
                $.myGlobalVar = "2";
                return false
            }
        });
    })
})