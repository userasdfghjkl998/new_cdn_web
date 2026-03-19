(function () {
  // 导航配置
  var navItems = [
    { title: '首页2',   href: 'index.html',          label: '首页' },
    { title: 'CDN',    href: 'gfsdk.html',           label: '高防SDK盾' },
    { title: '服务器', href: 'scdn.html',            label: '高防SCDN' },
    { title: '云总代', href: 'hk_server.html',       label: '香港高防服务器' },
    { title: '帮助文档', href: 'help.html',          label: '帮助文档' },
    { title: '联系我们', href: 'lianxiwomen986.html', label: '联系我们' }
  ];

  // 当前页面文件名
  var currentPage = location.pathname.split('/').pop() || 'index.html';

  // 判断某个 href 是否为当前页
  function isActive(href) {
    return href === currentPage || (currentPage === '' && href === 'index.html');
  }

  // logo href：首页为空，其他页面指向 index.html
  var logoHref = isActive('index.html') ? '' : 'index.html';

  // ---- 渲染 top clear（PC 顶部导航）----
  var topEl = document.querySelector('.top.clear');
  if (topEl) {
    var pcNavItems = navItems.map(function (item) {
      var href = isActive(item.href) ? '' : item.href;
      return '<li>'
        + '<a href="' + href + '">'
        + '<p class="rotate-text">'
        + '<span data-title="' + item.title + '">' + item.title + '</span>'
        + '</p>'
        + '</a>'
        + '</li>';
    }).join('\n');

    topEl.innerHTML = ''
      + '<h1 style="line-height: 0;">'
      + '<a class="logo fl" bi_name="logo" href="' + logoHref + '" style="font-size:0">'
      + '多途SDK盾 高防服务器租用,云堤清洗,安全领域专业提供商'
      + '<img class="pc-show" src="static/picture/dt-logo-slogan.png" alt="多途SDK盾 高防服务器租用,云堤清洗,安全领域专业提供商">'
      + '<img class="m-show" src="static/picture/new-dt-logo.png" alt="多途SDK盾 高防服务器租用,云堤清洗,安全领域专业提供商">'
      + '</a>'
      + '</h1>'
      + '<!-- 导航链接和展开项 - 新 -->'
      + '<div class="nav pc-data">'
      + '<i class="scroll-left-arrow pc-data"></i>'
      + '<i class="scroll-right-arrow pc-data"></i>'
      + '<ul>' + pcNavItems + '</ul>'
      + '</div>'
      + '<div class="top-r">'
      + '<ul id="ajax_token">'
      + '<li class="nav-m-show"><a href="login.html" target="_blank" rel="external nofollow">控制台</a></li>'
      + '<li><a class="mobile-hide" href="login.html" target="_blank">控制台</a></li>'
      + '<li id="ajax_token_new" style="display: none"></li>'
      + '<li class="ajax_token_login"><a class="mobile-hide" href="login.html" target="_blank">登录</a></li>'
      + '<li class="li-register-pc ajax_token_login" id="inviteRoute"><a class="btn btn-register mobile-hide" href="login.html" target="_blank">立即注册</a></li>'
      + '<li class="li-mobile"><a class="link-person iconfont" href="login.html">&#xe679;</a></li>'
      + '<li class="li-mobile"><a href="javascript:;" id="menu-btn"><i></i><i></i><i></i></a></li>'
      + '</ul>'
      + '</div>';
  }

  // ---- 渲染移动端菜单（#menu-item）----
  var mobileEl = document.getElementById('menu-item');
  if (mobileEl) {
    var mobileNavItems = navItems.map(function (item) {
      var href = isActive(item.href) ? '' : item.href;
      return '<li><a href="' + href + '">' + item.label + '</a></li>';
    }).join('\n');

    mobileEl.innerHTML = '<ul>' + mobileNavItems + '</ul>';
  }
})();
