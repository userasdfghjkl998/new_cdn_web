(function () {
  /** file:// 打开页面时 fetch 本地其它文件会触发 CORS，直接跳过同步（保留静态 HTML） */
  function canUseFetchForSiblingHtml() {
    try {
      return window.location.protocol === 'http:' || window.location.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function isIndexPage() {
    var p = window.location.pathname || '/';
    return p === '/' || p === '/index.html' || /index\.html$/.test(p);
  }

  function pickItems(list, count) {
    var out = [];
    for (var i = 0; i < list.length && out.length < count; i++) {
      out.push(list[i].outerHTML);
    }
    return out;
  }

  function syncIndexCdnPackages() {
    if (!isIndexPage() || !canUseFetchForSiblingHtml()) return;

    var targetList = document.querySelector('.section01 .tab-content [data-item="2"] .product-list.pc-show');
    if (!targetList) return;

    fetch('cdn.html', { credentials: 'same-origin' })
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var tab1 = doc.querySelector('.section-a1 .tab-content [data-item="1"] .product-list.pc-show');
        var tab2 = doc.querySelector('.section-a1 .tab-content [data-item="2"] .product-list.pc-show');
        if (!tab1 || !tab2) return;

        var li1 = tab1.querySelectorAll('li.product-set');
        var li2 = tab2.querySelectorAll('li.product-set');
        var merged = pickItems(li1, 2).concat(pickItems(li2, 2));
        if (merged.length < 4) return;

        targetList.innerHTML = merged.join('');
      })
      .catch(function () {
        // Keep existing static content when sync fails.
      });
  }

  function syncIndexServerPackages() {
    if (!isIndexPage() || !canUseFetchForSiblingHtml()) return;

    var targetList = document.querySelector('.section01 .tab-content [data-item="3"] .product-list.pc-show');
    if (!targetList) return;

    fetch('server.html', { credentials: 'same-origin' })
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var tab1 = doc.querySelector('.tab-content [data-item="1"] .product-list.pc-show');
        if (!tab1) return;

        var li1 = tab1.querySelectorAll('li.product-set');
        var picked = pickItems(li1, 4);
        if (picked.length < 4) return;
        targetList.innerHTML = picked.join('');
      })
      .catch(function () {
        // Keep existing static content when sync fails.
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      syncIndexCdnPackages();
      syncIndexServerPackages();
    });
  } else {
    syncIndexCdnPackages();
    syncIndexServerPackages();
  }
})();
