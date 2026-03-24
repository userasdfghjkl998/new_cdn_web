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
								<a href="gfsdk.html" target="_blank">高防SDK盾</a>
							</dd>
							<dd>
								<a href="cdn.html">高防SCDN</a>
							</dd>
							<dd>
								<a href="server.html">香港高防服务器</a>
							</dd>
						</dl>
						<dl>
							<dt data-toggle>帮助文档</dt>
														<dd>
								<a href='sdk.html'>SDK盾接入文档</a>
							</dd>
														<dd>
								<a href='sdkarticle.html'>CDN加速接入文档 </a>
							</dd>
														<dd>
								<a href='news.html'>CDN行业新闻</a>
							</dd>
							
						 
						</dl>
						<dl>
							<dt data-toggle>香港高防服务器</dt>
														<dd>
								<a href='server.html'>香港高防服务器</a>
							</dd>
														<dd>
								<a href='hk_server2.html'>香港大带宽服务器</a>
							</dd>
													</dl>
						<dl>
							<dt data-toggle>登录注册</dt>
							<dd>
								<a href="login.html" target="_blank">用户登录</a>
							</dd>
							<dd>
								<a href="login.html" target="_blank">用户注册</a>
							</dd>
							<dd>
								<a href="login.html" target="_blank">控制台</a>
							</dd>
						</dl>
					</div>
				</div>
				<div class="footer_r fr">
					<ul>
						<li class="custom">
							<i></i>
							<div><a class="tel-a" href="tel:">客服电话：</a></div>
						</li>
						<li>
							<i></i>
							<div class=""> <a class="tel-a" href="mailto:duotu888@gmail.com">电子邮箱：duotu888@gmail.com</a></div>
 
						</li>
					
						<li>
							<i></i>
							<div class=""><a class="tel-a" href="https://t.me/duotu7x24">销售客服TG：:@duotu7x24</a></div>
						</li>
						<li>
							<i></i>
							<div class=""><a class="tel-a" href="https://t.me/duotu7">销售客服TG：:@duotu7</a></div>
						</li>
						<li>
							<i></i>
							<div class=""><a class="tel-a zixun_btn" href="javascript:;">公司地址：飞盾網絡科技有限公司</a></div>
 
						</li>
					</ul>
				 
				 
				</div>
			</div>
			<div class="pc-data">
				<div class="footer-link friends-box">
					<dl style="width: 100%">
						<dt data-toggle class="" style="color: #fff;">友情链接</dt>
						<div class="friends-links">
							 
							<dd><a href='index.html' target="_blank">飞盾CDN</a></dd>
													</div>
					</dl>
				</div>
			</div>
			<div class="bottom-filing">
				<div class="copyright">
		Copyright © 20022-2026 飞盾CDN版权所有<br>
				 
				</div>
			</div>
		</div>
  `.trim();
 
  function inject() {
    const nodes = document.querySelectorAll('.footer');
    if (!nodes.length) return;
    nodes.forEach((el) => {
      if (el.dataset.footerInjected === '1') return;
      el.innerHTML = FOOTER_HTML;
      el.dataset.footerInjected = '1';
    });
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject, { once: true });
  } else {
    inject();
  }
})();
