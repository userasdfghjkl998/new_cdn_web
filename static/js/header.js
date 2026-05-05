(function () {
  var FD_DEFAULT_CONFIG = {
    tgLinks: {
      sales: 'https://t.me/nodem_bot?start=start',
      channel: 'https://t.me/feiduncdn'
    },
    accountLinks: {
      login: 'https://user.feiduncdn.com/dashboard/login',
      register: 'https://user.feiduncdn.com/dashboard/register',
      trial: 'https://user.feiduncdn.com/dashboard/register'
    }
  };
  var FD_SITE_CONFIG = window.FD_SITE_CONFIG || {};

  function getConfig(path, fallback) {
    var parts = path.split('.');
    var cursor = FD_SITE_CONFIG;
    for (var i = 0; i < parts.length; i++) {
      if (!cursor || typeof cursor !== 'object' || !(parts[i] in cursor)) {
        return fallback;
      }
      cursor = cursor[parts[i]];
    }
    return cursor;
  }

  function ensureMeta(attrName, attrValue, content) {
    var selector = 'meta[' + attrName + '="' + attrValue + '"]';
    var tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
      return;
    }
    if (!tag.getAttribute('content')) {
      tag.setAttribute('content', content);
    }
  }

  function ensureCanonical(url) {
    var link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }

  function ensureLink(rel, href, crossOrigin) {
    var selector = 'link[rel="' + rel + '"][href="' + href + '"]';
    var link = document.querySelector(selector);
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', rel);
      link.setAttribute('href', href);
      if (crossOrigin) {
        link.setAttribute('crossorigin', crossOrigin);
      }
      document.head.appendChild(link);
    }
  }

  function injectResourceHints() {
    // 外链落地页和客服链接预连接，降低首次点击延迟。
    ensureLink('dns-prefetch', '//user.feiduncdn.com');
    ensureLink('dns-prefetch', '//t.me');
    ensureLink('preconnect', 'https://user.feiduncdn.com', 'anonymous');
    ensureLink('preconnect', 'https://t.me', 'anonymous');
  }

  function normalizeGlobalLinks() {
    var tgSales = getConfig('tgLinks.sales', FD_DEFAULT_CONFIG.tgLinks.sales);
    var tgChannel = getConfig('tgLinks.channel', FD_DEFAULT_CONFIG.tgLinks.channel);
    var loginUrl = getConfig('accountLinks.login', FD_DEFAULT_CONFIG.accountLinks.login);
    var registerUrl = getConfig('accountLinks.register', FD_DEFAULT_CONFIG.accountLinks.register);
    var trialUrl = getConfig('accountLinks.trial', FD_DEFAULT_CONFIG.accountLinks.trial);

    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href') || '';

      if (/t\.me\/nodem_bot(\?start=start)?/.test(href)) {
        a.setAttribute('href', tgSales);
      } else if (/t\.me\/feiduncdn/.test(href)) {
        a.setAttribute('href', tgChannel);
      } else if (/user\.feiduncdn\.com\/dashboard\/login/.test(href)) {
        a.setAttribute('href', loginUrl);
      } else if (/user\.feiduncdn\.com\/dashboard\/register/.test(href)) {
        if (a.classList.contains('btn-register')) {
          a.setAttribute('href', trialUrl);
        } else {
          a.setAttribute('href', registerUrl);
        }
      }
    }
  }

  function normalizeSeo() {
    // 全站统一语言声明，避免页面模板遗漏。
    document.documentElement.setAttribute('lang', 'zh-CN');

    var siteName = '飞盾CDN';
    var title = (document.title || siteName).trim();
    var descriptionTag = document.querySelector('meta[name="description"]');
    var description = (descriptionTag && descriptionTag.getAttribute('content')) || '';
    if (!description) {
      description = '飞盾CDN提供高防CDN、香港高防服务器与DDoS/CC/WAF防护，一站式安全加速解决方案。';
    }

    var origin = window.location.origin || 'https://feiduncdn.com';
    var pathname = window.location.pathname || '/';
    var canonicalPath = pathname === '/index.html' ? '/' : pathname;
    var canonicalUrl = origin + canonicalPath;
    var ogImage = origin + '/static/picture/feidun_logo.png';

    ensureMeta('name', 'robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    ensureCanonical(canonicalUrl);

    ensureMeta('property', 'og:type', 'website');
    ensureMeta('property', 'og:locale', 'zh_CN');
    ensureMeta('property', 'og:site_name', siteName);
    ensureMeta('property', 'og:title', title);
    ensureMeta('property', 'og:description', description);
    ensureMeta('property', 'og:url', canonicalUrl);
    ensureMeta('property', 'og:image', ogImage);

    ensureMeta('name', 'twitter:card', 'summary_large_image');
    ensureMeta('name', 'twitter:title', title);
    ensureMeta('name', 'twitter:description', description);
    ensureMeta('name', 'twitter:image', ogImage);
  }

  function pageHasInlineArticleSchema() {
    var scripts = document.querySelectorAll('script[type="application/ld+json"]');
    for (var i = 0; i < scripts.length; i++) {
      var text = (scripts[i].textContent || '').replace(/\s+/g, ' ');
      if (/"@type"\s*:\s*"Article"/.test(text) || /'@type'\s*:\s*'Article'/.test(text)) {
        return true;
      }
    }
    return false;
  }

  function injectArticleSchemaIfNeeded() {
    var pathname = window.location.pathname || '';
    if (!/\/\d+\.html$/.test(pathname)) {
      return;
    }

    if (document.getElementById('fd-article-schema') || pageHasInlineArticleSchema()) {
      return;
    }

    var titleEl = document.querySelector('.content-item-title h1') || document.querySelector('h1');
    var dateEl = document.querySelector('.data-time');
    var articleTitle = titleEl ? titleEl.textContent.trim() : document.title.replace('_飞盾CDN', '').trim();
    var dateText = dateEl ? dateEl.textContent : '';
    var dateMatch = dateText.match(/(\d{4}-\d{2}-\d{2})/);
    var publishedDate = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10);
    var descriptionTag = document.querySelector('meta[name="description"]');
    var description = (descriptionTag && descriptionTag.getAttribute('content')) || articleTitle;
    var canonical = document.querySelector('link[rel="canonical"]');

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: articleTitle,
      datePublished: publishedDate,
      dateModified: publishedDate,
      description: description,
      mainEntityOfPage: canonical ? canonical.getAttribute('href') : (window.location.origin + pathname),
      author: {
        '@type': 'Organization',
        name: '飞盾CDN'
      },
      publisher: {
        '@type': 'Organization',
        name: '飞盾CDN',
        logo: {
          '@type': 'ImageObject',
          url: (window.location.origin || 'https://feiduncdn.com') + '/static/picture/feidun_logo.png'
        }
      }
    };

    var script = document.createElement('script');
    script.id = 'fd-article-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function injectBreadcrumbSchemaIfNeeded() {
    var pathname = window.location.pathname || '';
    if (!/\/\d+\.html$/.test(pathname)) {
      return;
    }
    if (document.getElementById('fd-breadcrumb-schema')) {
      return;
    }

    var titleEl = document.querySelector('.content-item-title h1') || document.querySelector('h1');
    var articleTitle = titleEl ? titleEl.textContent.trim() : document.title.replace('_飞盾CDN', '').trim();
    var origin = window.location.origin || 'https://feiduncdn.com';
    var itemUrl = origin + pathname;

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: origin + '/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: '帮助中心与文档',
          item: origin + '/help.html'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: articleTitle,
          item: itemUrl
        }
      ]
    };

    var script = document.createElement('script');
    script.id = 'fd-breadcrumb-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function injectHomeHelpItemList() {
    var p = window.location.pathname || '/';
    if (!(p === '/' || p === '/index.html' || /index\.html$/.test(p))) {
      return;
    }
    if (document.getElementById('fd-home-help-itemlist')) {
      return;
    }

    var links = document.querySelectorAll('.section02 .info-data-list li a[href]');
    if (!links.length) return;

    var origin = window.location.origin || 'https://feiduncdn.com';
    var items = [];
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var titleEl = a.querySelector('.info-data-title');
      var title = titleEl ? titleEl.textContent.trim() : (a.textContent || '').trim();
      if (!title) continue;
      var href = a.getAttribute('href') || '';
      var url = href.indexOf('http') === 0 ? href : (origin + '/' + href.replace(/^\//, ''));
      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: title,
        item: url
      });
    }
    if (!items.length) return;

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: '帮助中心与文档精选文章',
      itemListElement: items
    };

    var script = document.createElement('script');
    script.id = 'fd-home-help-itemlist';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function injectArticleRelatedLinks() {
    var pathname = window.location.pathname || '';
    if (!/\/\d+\.html$/.test(pathname)) return;
    if (document.getElementById('fd-related-links')) return;

    var container = document.querySelector('.content-item-detail');
    if (!container) return;

    var related = [
      { href: '188.html', text: '高防CDN用到什么技术：Anycast、WAF与清洗中心解析' },
      { href: '196.html', text: '大陆免备案CDN是什么意思？最佳方案与线路选择' },
      { href: '194.html', text: 'CDN加速媒体存储资源概述：传输效率与成本优化' },
      { href: '191.html', text: '高防服务器防火墙特性：CC/DDOS防御与访问控制' }
    ];

    var html = '<div id="fd-related-links" style="margin-top:24px;padding-top:16px;border-top:1px solid #e9edf3;">'
      + '<div style="font-weight:600;margin-bottom:10px;">相关阅读</div><ul style="padding-left:18px;margin:0;">';
    for (var i = 0; i < related.length; i++) {
      var item = related[i];
      if (pathname.indexOf('/' + item.href) !== -1) continue;
      html += '<li style="margin:6px 0;"><a href="' + item.href + '">' + item.text + '</a></li>';
    }
    html += '</ul></div>';

    container.insertAdjacentHTML('beforeend', html);
  }

  function optimizeImageLazyLoading() {
    var imgs = document.querySelectorAll('img');
    if (!imgs.length) return;
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (!img.getAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.getAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    }
  }

  normalizeSeo();
  injectResourceHints();
  normalizeGlobalLinks();
  injectArticleSchemaIfNeeded();
  injectBreadcrumbSchemaIfNeeded();
  injectArticleRelatedLinks();
  injectHomeHelpItemList();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeImageLazyLoading);
  } else {
    optimizeImageLazyLoading();
  }

  // 导航配置
  var navItems = [
    { title: '首页',   href: 'index.html',          label: '首页' },
    { title: 'CDN加速',    href: 'cdn.html',           label: 'CDN加速' },
    { title: '服务器', href: 'server.html',            label: '服务器' },
    { title: '云账号', href: 'cloud.html',       label: '云账号' },
    // { title: '聊天系统', href: 'chat.html',          label: '聊天系统' },
    { title: '帮助文档', href: 'help.html',          label: '帮助文档' },
    { title: '联系我们', href: 'lianxiwomen986.html', label: '联系我们' }
  ];

  // 站点根首页（仅根路径 / 或 /index.html），子目录下的 index.html 不能当作首页
  var pathNorm = (location.pathname || '').replace(/\/+$/, '');
  if (!pathNorm) {
    pathNorm = '/';
  }
  var isSiteHome = pathNorm === '/' || pathNorm === '/index.html';

  var currentPage = pathNorm.split('/').pop() || 'index.html';
  if (!currentPage || currentPage.indexOf('.') === -1) {
    currentPage = 'index.html';
  }

  function isActive(href) {
    if (href === 'index.html') {
      return isSiteHome;
    }
    return href === currentPage;
  }

  // logo：仅在站点根首页用空链接，其余页指向根 index.html（配合各页 <base> 解析到站点根）
  var logoHref = isSiteHome ? '' : 'index.html';

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
      + '飞盾 高防服务器租用,云堤清洗,安全领域专业提供商'
      + '<img class="pc-show" src="static/picture/feidun_logo.png" alt="飞盾 高防服务器租用,云堤清洗,安全领域专业提供商">'
      + '<img class="m-show" src="static/picture/new-fd-logo.png" alt="飞盾 高防服务器租用,云堤清洗,安全领域专业提供商">'
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
      + '<li id="ajax_token_new" style="display: none"></li>'
      + '<li class="ajax_token_login"><a class="mobile-hide" href="' + getConfig('accountLinks.login', FD_DEFAULT_CONFIG.accountLinks.login) + '" target="_blank">登录</a></li>'
      + '<li class="ajax_token_login"><a class="mobile-hide" href="' + getConfig('accountLinks.register', FD_DEFAULT_CONFIG.accountLinks.register) + '" target="_blank">注册</a></li>'
      + '<li class="li-register-pc ajax_token_login" id="inviteRoute"><a class="btn btn-register mobile-hide" href="' + getConfig('accountLinks.trial', FD_DEFAULT_CONFIG.accountLinks.trial) + '" target="_blank">免费试用</a></li>'
      + '<li class="li-mobile"><a class="link-person iconfont"  target="_blank" href="' + getConfig('accountLinks.register', FD_DEFAULT_CONFIG.accountLinks.register) + '">&#xe679;</a></li>'
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
