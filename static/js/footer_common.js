(() => {
  const FOOTER_HTML = `
		<div class="w1400 m-footer">
			<div class="pc-data">
				<div class="footer-top">
					<ul>
						<li>
							<span class="footer-icon footer-icon2" style="background-image: url(static/image/icon_pay.png);"></span>
							<p>快速交付</p>
						</li>
						<li>
							<span class="footer-icon footer-icon2" style="background-image: url(static/image/icon_defence.png);"></span>
							<p>安全防护</p>
						</li>
						<li>
							<span class="footer-icon footer-icon3" style="background-image: url(static/image/icon_custom.png);"></span>
							<p>配套定制</p>
						</li>
						<li>
							<span class="footer-icon footer-icon4" style="background-image: url(static/image/icon_service.png);"></span>
							<p>专业服务</p>
						</li>
					</ul>
				</div>
			</div>
			<div class="clear footer_nav">
				<div class="footer_l fl">
					<div class="footer-link">
						<dl>
							<dt data-toggle>产品服务</dt>
							<dd>
								<a href="cdn.html">CDN加速</a>
							</dd>
							<dd>
								<a href="server.html">服务器</a>
							</dd>
							<dd>
								<a href="cloud.html">云账号</a>
							</dd>
						</dl>
						<dl>
							<dt data-toggle>帮助文档</dt>
							<dd>
								<a href='sdkarticle.html'>CDN文档</a>
							</dd>
							<dd>
								<a href='news.html'>CDN行业新闻</a>
							</dd>
							
						 
						</dl>
						<dl>
							<dt data-toggle>登录注册</dt>
							<dd>
								<a href="https://user.feiduncdn.com/dashboard/login" target="_blank">用户登录</a>
							</dd>
							<dd>
								<a href="https://user.feiduncdn.com/dashboard/register" target="_blank">用户注册</a>
							</dd>
						</dl>
					</div>
				</div>
				<div class="footer_r fr">
					<ul>
						<li class="custom">
							<i></i>
							<div>联系客服：</div>
						</li>
						<li>
							<i></i>
							<div class=""> <a class="tel-a" href="mailto:feiduncdn@outlook.com"  target="_blank">电子邮箱：feiduncdn@outlook.com</a></div>
 
						</li>
					
						<li>
							<i></i>
							<div class=""><a class="tel-a" href="https://t.me/nodem_bot?start=start" target="_blank">销售客服TG①</a></div>
						</li>
						<li>
							<i></i>
							<div class=""><a class="tel-a" href="https://t.me/feiduncdn" target="_blank">销售客服TG②</a></div>
						</li>
						<li>
							<i></i>
							<div class=""><a class="tel-a zixun_btn" href="javascript:;">公司地址：飞盾網絡科技有限公司</a></div>
 
						</li>
					</ul>
				 
				 
				</div>
                        <div>
                            <div class="pc-data">
                                <div class="footer-link friends-box">
                                    <dl style="width: 100%; text-align: center;">
                                        <dt style="color: #fff;">友情链接</dt>
                                        <div class="friends-links">
                                            <!-- <dd><a href="index.html" target="_blank">飞盾CDN</a></dd> -->
                                            <dd><a href="https://spy.house/?utm_source=feiduncdn" target="_blank">Spy.House</a></dd>
                                            <dd><a href="https://www.itdog.cn/http" target="_blank">网站质量检测</a></dd>
                                            <dd><a href="https://urlsec.qq.com/check.html" target="_blank">网站安全检测</a></dd>
                                            <dd><a href="https://www.icpapi.com" target="_blank">域名备案查询</a></dd>
                                            <dd><a href="/download/DnsJumper.zip" target="_blank" download>DNS网络优化</a></dd>
                                            <dd><a href="/download/security_check.sh" target="_blank" download>系统安全检查</a></dd>
                                            <dd><a href="https://www.speedtest.cn/" target="_blank">本地网络测试</a></dd>
                                            <dd><a href="https://ip.me/" target="_blank">本地IP查询</a></dd>
                                            <dd><a href="https://www.virustotal.com/gui/home/url" target="_blank">在线病毒检查</a></dd>
                                            <dd><a href="https://github.com/xykt/NetQuality" target="_blank">系统网络检测</a></dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                            <div class="bottom-filing">
                                <div class="copyright" style="text-align: center; color: #fff;">
                                    Copyright © 2022-2026 飞盾CDN版权所有
                                </div>
                            </div>
                        </div>

  `.trim();

  /** 与文章详情页一致的右侧悬浮：TG、在线聊天、置顶（帮助中心列表等页原先未包含） */
  const FIX_RIGHT_INNER = `
		<div class="fix-qq">
			<div class="fix-wrap">
				<ul>
          <li class="sale-item">
            <a href="https://t.me/nodem_bot?start=start" rel="nofollow" target="_blank">
              <i class="slide-icon slide-icon-sale" data-value="销售客服TG①"></i>
              <p>销售客服TG①</p>
            </a>
            <div class="bubble-wrap">
              <div class="bubble">
                <a href="https://t.me/nodem_bot?start=start" rel="nofollow" target="_blank">
                  <i class="slide-icon-sale"></i>
                  <div>24小时在线，快速解决客户问题</div>
                </a>
              </div>
            </div>
          </li>
          <li class="sale-item">
            <a href="https://t.me/feiduncdn" rel="nofollow" target="_blank">
              <i class="slide-icon slide-icon-sale" data-value="销售客服TG②"></i>
              <p>销售客服TG②</p>
            </a>
            <div class="bubble-wrap">
              <div class="bubble">
                <a href="https://t.me/feiduncdn" rel="nofollow" target="_blank">
                  <i class="slide-icon-sale"></i>
                  <div>在线时间 9:00-02:00</div>
                </a>
              </div>
            </div>
          </li>
          <li class="sale-item">
            <a href="https://t.me/nodem_bot?start=start" rel="nofollow" target="_blank" class="zixun_btn">
              <i class="slide-icon slide-icon-chat" data-value="在线聊天"></i>
              <p>在线聊天</p>
            </a>
            <div class="bubble-wrap">
              <div class="bubble">
                <a href="https://t.me/nodem_bot?start=start" rel="nofollow" target="_blank" class="zixun_btn">
                  <p><i class="slide-icon-chat"></i>在线聊天</p>
                  <div>24小时在线，快速解决客户问</div>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="toTop" id="toTop">
      <a href="javascript:;">
        <i class="slide-icon-totop"></i>
        <p>置顶</p>
      </a>
    </div>
  `.trim();

  function injectFixRight() {
    if (document.querySelector('.fix-right')) return;
    if (!document.getElementById('help-slide-icon-chat-style')) {
      const style = document.createElement('style');
      style.id = 'help-slide-icon-chat-style';
      style.textContent =
        '.slide-icon-chat::before {content: \'\';display: inline-block;position: relative;top: 4px;width: 24px;height: 24px;background-image: url(static/image/icon_chat.png);background-position: 0 0;background-size: 100%;}';
      document.head.appendChild(style);
    }
    const wrap = document.createElement('div');
    wrap.className = 'fix-right';
    wrap.innerHTML = FIX_RIGHT_INNER;
    document.body.appendChild(wrap);

    const $ = window.jQuery;
    if (!$) return;

    $(function () {
      $('.zixun_btn').on('click', function () {
        if (typeof window.LiveChatWidget !== 'undefined' && window.LiveChatWidget.call) {
          window.LiveChatWidget.call('maximize');
        }
      });
      $(window).on('scroll', function () {
        if ($(document).scrollTop() < 600) {
          $('#toTop').fadeOut();
        } else {
          $('#toTop').fadeIn();
        }
      });
      $(window).trigger('scroll');
      $('#toTop').on('click', function () {
        $('html, body').animate({ scrollTop: 0 });
      });
    });
  }

  function inject() {
    const nodes = document.querySelectorAll('.footer');
    if (!nodes.length) return;
    nodes.forEach((el) => {
      if (el.dataset.footerInjected === '1') return;
      el.innerHTML = FOOTER_HTML;
      el.dataset.footerInjected = '1';
    });
    injectFixRight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }
})();
