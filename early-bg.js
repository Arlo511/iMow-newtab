// 首帧壁纸：在 body 渲染前把已缓存壁纸写入 #background，
// 避免刷新瞬间先看到默认底色再跳到壁纸（闪屏）。localStorage 在扩展页同步可读。
(function () {
    try {
        // 首帧只绘制壁纸：内容区先隐藏，等主脚本同步渲染完网站图标后再显示，
        // 避免出现"搜索框已显示但图标还没渲染"的空白帧（图标缺失感）。
        document.documentElement.classList.add('icons-pending');
        // 兜底保护：若主脚本未能完成渲染，1.2 秒后强制显示内容，避免页面一直空白
        setTimeout(function () {
            document.documentElement.classList.remove('icons-pending');
        }, 1200);

        var settings = JSON.parse(localStorage.getItem('settings') || '{}');
        var sourceId = (settings.wallpaper && settings.wallpaper.source) || 'bingdaily';
        var stored = JSON.parse(localStorage.getItem('backgrounds') || '{}');
        var entry = stored[sourceId];
        if ((!entry || !entry.image) && localStorage.getItem('backgrounds') === null) {
            // 仅当从未存在按源缓存时，兼容旧格式 background
            var legacy = JSON.parse(localStorage.getItem('background') || '{}');
            if (legacy && legacy.image) entry = legacy;
        }
        if (!entry || !entry.image) return;
        var color = (entry.color && entry.color !== 'transparent') ? entry.color : '#0b0e14';
        var image = String(entry.image).replace(/["\\]/g, '\\$&');
        var style = document.createElement('style');
        style.id = 'early-bg-style';
        // 只在主脚本接手前生效：
        // - #background 的负 z-index 位于 body 背景之下，body 必须透明才能看到壁纸
        // - applyBackground 会加 bg-ready 并移除本样式，交还控制权
        style.textContent =
            'html{background-color:' + color + ' !important;}' +
            'body{background-color:transparent !important;}' +
            '#background:not(.bg-ready){background-color:' + color + ' !important;background-image:url("' + image + '") !important;}';
        document.head.appendChild(style);
    } catch (e) { }
})();
