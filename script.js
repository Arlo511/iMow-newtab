// 全局函数：统一控制搜索引擎下拉列表的显示/隐藏
// 同时维护 class 与 display，避免二者不同步导致下拉框关不掉
function openEngineDropdown() {
    const dropdown = document.getElementById('engineDropdown');
    if (!dropdown) return;
    dropdown.style.display = 'block';
    dropdown.classList.add('show');
}

function closeEngineDropdown() {
    const dropdown = document.getElementById('engineDropdown');
    if (!dropdown) return;
    dropdown.classList.remove('show');
    dropdown.style.display = 'none';
}

function toggleEngineDropdown() {
    const dropdown = document.getElementById('engineDropdown');
    if (!dropdown) {
        console.error('toggleEngineDropdown: 未找到引擎下拉列表元素');
        return;
    }
    if (dropdown.classList.contains('show')) {
        closeEngineDropdown();
    } else {
        openEngineDropdown();
    }
}

// 直接为搜索引擎选择器添加事件监听器，使用setTimeout确保DOM元素已经加载
setTimeout(function() {
    console.log('setTimeout: 添加搜索引擎选择器事件监听器');
    
    // 直接获取搜索引擎选择器元素
    const engineSelector = document.querySelector('.search-engine-selector');
    
    if (engineSelector) {
        // 直接添加点击事件监听器
        engineSelector.addEventListener('click', toggleEngineDropdown);
        console.log('setTimeout: 成功为搜索引擎选择器添加点击事件监听器');
    } else {
        console.error('setTimeout: 未找到搜索引擎选择器元素');
    }
}, 100);

// 设置面板数值展示：尺寸/间距类统一按“相对默认值”的百分比显示
function formatRelativePercent(value, baseline) {
    const num = Number(value);
    if (!Number.isFinite(num) || !baseline) return '100%';
    return `${Math.round((num / baseline) * 100)}%`;
}

// 设置面板数值展示：位置偏移统一按视口百分比显示（保留一位小数，正值带 + 号）
function formatOffsetPercent(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return '0%';
    const rounded = Math.round(num * 10) / 10;
    const sign = rounded > 0 ? '+' : '';
    return `${sign}${rounded}%`;
}

// 数据持久化管理
class DataManager {
    constructor() {
        this.defaults = {
            websites: [
                { id: 1, name: '知乎', url: 'https://www.zhihu.com', icon: './icons/websites-icons/zhihu.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 2, name: 'B站', url: 'https://www.bilibili.com', icon: './icons/websites-icons/bilibili.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 3, name: '抖音', url: 'https://www.douyin.com', icon: './icons/websites-icons/douyin.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 4, name: '豆瓣电影', url: 'https://movie.douban.com', icon: './icons/websites-icons/douban.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 5, name: '今日热榜', url: 'https://tophub.today/', icon: './icons/websites-icons/jinrirebang.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 6, name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: './icons/websites-icons/deepseek.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 7, name: '小红书', url: 'https://www.xiaohongshu.com', icon: './icons/websites-icons/xiaohongshu.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 8, name: 'YouTube', url: 'https://www.youtube.com', icon: './icons/websites-icons/Youtube.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 9, name: 'Instagram', url: 'https://www.instagram.com', icon: './icons/websites-icons/INS.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 10, name: 'X', url: 'https://www.twitter.com', icon: './icons/websites-icons/X.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 11, name: 'ChatGPT', url: 'https://chat.openai.com', icon: './icons/websites-icons/chatgpt.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 12, name: '飞书', url: 'https://www.feishu.cn', icon: './icons/websites-icons/feishu.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 13, name: '豆包', url: 'https://www.doubao.com', icon: './icons/websites-icons/doubao.png', iconSize: 50, iconBgColor: '#ffffff' },
                { id: 14, name: '即梦', url: 'https://jimeng.jianying.com/ai-tool/home', icon: './icons/websites-icons/jimeng.png', iconSize: 50, iconBgColor: '#ffffff' }
            ],
            searchEngines: [
                { id: 1, name: '必应', url: 'https://www.bing.com/search?q={}' },
                { id: 2, name: '百度', url: 'https://www.baidu.com/s?wd={}' },
                { id: 3, name: '谷歌', url: 'https://www.google.com/search?q={}' },
                { id: 4, name: 'Yandex', url: 'https://yandex.com/search/?text={}' },
                { id: 5, name: '搜狗', url: 'https://www.sogou.com/web?query={}' },
                { id: 6, name: '360搜索', url: 'https://www.so.com/s?q={}' }
            ],
            background: {
                image: '',
                color: 'transparent'
            },
            widgets: [
                { id: 1, type: 'clock', title: '时钟', enabled: true }
            ],
            settings: {
            showWebsiteNames: true,
            websiteIconSize: 120, // 默认网站图标大小120px
            pageTransition: 'slide', // 翻页动画：slide=水平滑动 / fade=交叉淡入 / stack=上下堆叠 / none=无动画
        websiteNameColor: '#ffffff', // 默认文字颜色
        websiteNameSize: 14, // 默认文字大小
        openSearchInNewTab: false, // 默认关闭搜索结果在新标签页打开
        openWebsiteInNewTab: false, // 默认关闭网站在新标签页打开
        layout: {
            rows: 2,
            columns: 6, // 默认每页 2 行 × 6 列 = 12 个图标
            columnGap: 105, // 默认列间距 105px（旧默认 70px 的 150%，对齐参考截图）
            rowGap: 58, // 默认行间距 58px（旧默认 40px 的 145%，对齐参考截图）
            searchOffsetY: 0, // 搜索框上下位置，单位为视口百分比（如 10 表示 10vh）
            iconsOffsetY: 0, // 网站图标区域上下位置，单位为视口百分比（如 10 表示 10vh）
            offsetUnit: 'vh', // 位置偏移单位标记，用于兼容旧版像素数据
            layoutRev: 3 // 布局默认值版本：3 = 2×6 + 列距 105 / 行距 58；2 = 2×6 旧默认
        },
        searchBoxRadius: 40, // 默认搜索框圆角40px，最大值
        searchBoxOpacity: 30, // 默认搜索框透明度30%
        searchBoxSize: 100, // 默认搜索框整体大小100%
        searchBoxHeight: 65, // 默认搜索框高度65px
        searchBoxWidth: 35, // 默认搜索框宽度35%
        searchBoxBlur: 22, // 搜索框背景模糊半径，默认 22px（与当前视觉一致）
                wallpaper: {
                    source: 'bingdaily', // 默认壁纸源
                    sources: [
                        { id: 'bingdaily', name: '必应每日壁纸', url: 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN', type: 'bing-daily' },
                        { id: 'picsum', name: 'Picsum 随机摄影', url: 'https://picsum.photos/1920/1080', type: 'random' },
                        { id: 'imgapi', name: 'IMGAPI 真人摄影', url: 'https://imgapi.cn/api.php?fl=meizi&zd=pc&gs=images', type: 'random' },
                        { id: 'upx8', name: '鸟壁纸 美女写真', url: 'https://wp.upx8.com/api.php?content=%E7%BE%8E%E5%A5%B3', type: 'random' },
                        { id: 'ltywl', name: 'ltywl 真人写真', url: 'https://pic.ltywl.top/mn/api.php', type: 'random' },
                        { id: 'mwm', name: '举个栗子 4K 二次元', url: 'https://t.mwm.moe/pc', type: 'random' },
                        { id: 'loliapi', name: 'LoliAPI 二次元插画', url: 'https://www.loliapi.com/bg/', type: 'random' },
                        { id: 'paugram', name: '保罗 API 二次元壁纸', url: 'https://api.paugram.com/wallpaper/', type: 'random' },
                        { id: 'xjh', name: 'XJH 动漫壁纸', url: 'https://img.xjh.me/random_img.php?type=bg&ctype=acg&return=302', type: 'random' },
                        { id: 'suyanw', name: 'Suyanw API 动漫壁纸', url: 'https://api.suyanw.cn/api/comic/windows.php', type: 'random' }
                    ]
                }
            }
        };
    }

    // 获取数据
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            if (data) {
                const parsedData = JSON.parse(data);
                // 检查是否为空数组，如果是则返回默认数据
                if (Array.isArray(parsedData) && parsedData.length === 0) {
                    return this.defaults[key] || [];
                }
                
                // 特殊处理background数据，确保背景设置的完整性和正确性
                if (key === 'background') {
                    // 直接返回缓存中的设置，确保保存的壁纸设置不会被默认设置覆盖
                    // 只有当parsedData是null或undefined时才返回默认设置
                    if (parsedData && typeof parsedData === 'object') {
                        return parsedData;
                    }
                    // 如果缓存中没有有效设置，则返回默认设置
                    const defaultBackground = this.defaults.background || { image: '', color: 'transparent' };
                    return defaultBackground;
                }
                
                // 检查是否为空对象，如果是则返回默认数据
                // 注意：这个检查放在background特殊处理之后，避免影响背景数据
                if (typeof parsedData === 'object' && parsedData !== null && !Array.isArray(parsedData) && Object.keys(parsedData).length === 0) {
                    return this.defaults[key] || {};
                }
                
                // 特殊处理settings数据，确保搜索框设置的完整性和正确性
                if (key === 'settings') {
                    // 使用默认设置作为基础，合并缓存中的设置
                    const defaultSettings = this.defaults.settings || {};
                    
                    // 处理壁纸源：内置源统一使用已验证的中文名称与地址，旧版失效源直接丢弃
                    const sourcesMap = new Map();
                    const obsoleteSourceIds = ['bingimg', 'lolimi', 'btstu'];
                    const builtinSourceIds = new Set(defaultSettings.wallpaper.sources.map(source => source.id));
                    
                    defaultSettings.wallpaper.sources.forEach(source => {
                        sourcesMap.set(source.id, source);
                    });
                    
                    if (parsedData.wallpaper?.sources) {
                        parsedData.wallpaper.sources.forEach(source => {
                            if (!source || !source.id) return;
                            if (obsoleteSourceIds.includes(source.id)) return;
                            // 内置源不允许被旧数据覆盖，确保界面上只出现中文名称
                            if (builtinSourceIds.has(source.id)) return;
                            sourcesMap.set(source.id, source);
                        });
                    }
                    
                    const mergedSources = Array.from(sourcesMap.values());
                    
                    // 深合并wallpaper对象，确保壁纸源设置正确
                    // 检查当前源是否存在于合并后的源列表中，如果不存在则使用默认源
                    let currentSourceId;
                    if (parsedData && parsedData.wallpaper && parsedData.wallpaper.source) {
                        currentSourceId = parsedData.wallpaper.source;
                    } else if (defaultSettings && defaultSettings.wallpaper && defaultSettings.wallpaper.source) {
                        currentSourceId = defaultSettings.wallpaper.source;
                    } else {
                        currentSourceId = defaultSettings.wallpaper.source;
                    }
                    
                    const sourceExists = mergedSources.some(source => source.id === currentSourceId);
                    const finalSourceId = sourceExists ? currentSourceId : defaultSettings.wallpaper.source;
                    
                    // 确保parsedData.wallpaper不是undefined
                    const parsedWallpaper = parsedData.wallpaper || {};
                    
                    const mergedWallpaper = {
                        ...defaultSettings.wallpaper,
                        ...parsedWallpaper,
                        source: finalSourceId,
                        sources: mergedSources
                    };
                    
                    const mergedSettings = {
                        ...defaultSettings,
                        ...parsedData,
                        wallpaper: mergedWallpaper
                    };
                    
                    // 确保搜索框圆角在有效范围内（0-40px）
                    if (mergedSettings.searchBoxRadius === undefined || mergedSettings.searchBoxRadius < 0 || mergedSettings.searchBoxRadius > 40) {
                        mergedSettings.searchBoxRadius = defaultSettings.searchBoxRadius || 40;
                    }
                    
                    // 确保搜索框透明度在有效范围内（30-100%）
                    if (mergedSettings.searchBoxOpacity === undefined || mergedSettings.searchBoxOpacity < 30 || mergedSettings.searchBoxOpacity > 100) {
                        mergedSettings.searchBoxOpacity = defaultSettings.searchBoxOpacity ?? 30;
                    }
                    
                    // 确保搜索框整体大小在有效范围内（80-150%）
                    if (mergedSettings.searchBoxSize === undefined || mergedSettings.searchBoxSize < 80 || mergedSettings.searchBoxSize > 150) {
                        mergedSettings.searchBoxSize = defaultSettings.searchBoxSize || 100;
                    }
                    
                    // 确保搜索框高度在有效范围内（40-100px）
                    if (mergedSettings.searchBoxHeight === undefined || mergedSettings.searchBoxHeight < 40 || mergedSettings.searchBoxHeight > 100) {
                        mergedSettings.searchBoxHeight = defaultSettings.searchBoxHeight ?? 65;
                    }
                    
                    // 确保网站图标大小在有效范围内（80-250px）
                    if (mergedSettings.websiteIconSize === undefined || mergedSettings.websiteIconSize < 80 || mergedSettings.websiteIconSize > 250) {
                        mergedSettings.websiteIconSize = defaultSettings.websiteIconSize ?? 120;
                    }
                    
                    // 确保搜索框宽度在有效范围内（20-100%）
                    if (mergedSettings.searchBoxWidth === undefined || mergedSettings.searchBoxWidth < 20 || mergedSettings.searchBoxWidth > 100) {
                        mergedSettings.searchBoxWidth = defaultSettings.searchBoxWidth ?? 35;
                    }
                    
                    // 确保搜索框模糊度在有效范围内（0-30px，默认 22px）
                    if (mergedSettings.searchBoxBlur === undefined || mergedSettings.searchBoxBlur < 0 || mergedSettings.searchBoxBlur > 30) {
                        mergedSettings.searchBoxBlur = defaultSettings.searchBoxBlur ?? 22;
                    }
                    
                    // 位置调整：单位统一为视口百分比（-10~30），旧版像素数据自动换算
                    const defaultLayout = defaultSettings.layout || {};
                    const storedLayout = (parsedData.layout && typeof parsedData.layout === 'object') ? parsedData.layout : null;
                    // 与默认布局逐字段合并，保证新增字段（如 layoutRev）对老数据也可见
                    mergedSettings.layout = { ...defaultLayout, ...(storedLayout || {}) };

                    // 布局默认值按版本迁移，逐字段只改"仍是旧默认"的值，用户手调过的值一律保留：
                    // rev1 → rev2：旧默认 2×7 改为 2×6
                    // rev2 → rev3：列间距 70 → 105（150%）、行间距 40 → 58（145%）
                    // 图标区基准位置 +3% 由 CSS 变量承载（见 styles.css 的 --icons-base-offset-y），
                    // 因此把老用户已保存的 iconsOffsetY 统一减 3（同量反补），保证其视觉位置不变；
                    // 新用户与点“重置”的用户则落在新的 +3% 基准上。
                    const OLD_DEFAULT_COLUMN_GAP = 70;
                    const OLD_DEFAULT_ROW_GAP = 40;
                    const ICONS_BASE_OFFSET = 3;
                    if (!storedLayout || Number(storedLayout.layoutRev) !== 3) {
                        const l = mergedSettings.layout;
                        const storedRev = Number(storedLayout && storedLayout.layoutRev) || 1;
                        if (storedRev < 2) {
                            const isOldDefault = Number(l.rows) === 2
                                && Number(l.columns) === 7
                                && Number(l.columnGap) === OLD_DEFAULT_COLUMN_GAP
                                && Number(l.rowGap) === OLD_DEFAULT_ROW_GAP;
                            if (isOldDefault) {
                                l.columns = 6;
                            }
                        }
                        if (Number(l.columnGap) === OLD_DEFAULT_COLUMN_GAP) {
                            l.columnGap = defaultLayout.columnGap;
                        }
                        if (Number(l.rowGap) === OLD_DEFAULT_ROW_GAP) {
                            l.rowGap = defaultLayout.rowGap;
                        }
                        if (storedLayout) {
                            const prevOffset = Number(l.iconsOffsetY);
                            if (Number.isFinite(prevOffset)) {
                                l.iconsOffsetY = Math.min(30, Math.max(-10, Math.round((prevOffset - ICONS_BASE_OFFSET) * 10) / 10));
                            }
                        }
                        l.layoutRev = 3;
                    }

                    if (mergedSettings.layout.offsetUnit !== 'vh') {
                        // 旧版本没有单位标记，其中的数值是像素；按 8px ≈ 1vh 近似换算后迁移（保留 0.1 精度）
                        const pxToVh = (px) => Math.round((Number(px) / 8) * 10) / 10;
                        mergedSettings.layout.searchOffsetY = pxToVh(mergedSettings.layout.searchOffsetY ?? 0);
                        mergedSettings.layout.iconsOffsetY = pxToVh(mergedSettings.layout.iconsOffsetY ?? 0);
                        mergedSettings.layout.offsetUnit = 'vh';
                    }
                    const clampVh = (value, fallback) => {
                        const num = Number(value);
                        if (!Number.isFinite(num)) return fallback;
                        return Math.min(30, Math.max(-10, Math.round(num * 10) / 10));
                    };
                    mergedSettings.layout.searchOffsetY = clampVh(mergedSettings.layout.searchOffsetY, defaultLayout.searchOffsetY ?? 0);
                    mergedSettings.layout.iconsOffsetY = clampVh(mergedSettings.layout.iconsOffsetY, defaultLayout.iconsOffsetY ?? 0);
                    
                    // 更新缓存，确保下一次读取时使用正确的设置
                    this.saveData(key, mergedSettings);
                    
                    return mergedSettings;
                }
                
                return parsedData;
            }
            return this.defaults[key] || [];
        } catch (error) {
            console.error('Error parsing data from localStorage:', error);
            return this.defaults[key] || [];
        }
    }

    // 保存数据
    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // 重置数据
    resetData() {
        Object.keys(this.defaults).forEach(key => {
            this.saveData(key, this.defaults[key]);
        });
    }
}

// 网站管理类
class WebsiteManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.settings = this.dataManager.getData('settings');
        
        // 获取网站数据
        this.websites = this.dataManager.getData('websites');
        
        // 只在网站数据为空时使用默认数据，避免覆盖用户自定义图标
        if (!this.websites || this.websites.length === 0) {
            this.websites = this.dataManager.defaults.websites;
            this.dataManager.saveData('websites', this.websites);
        }
        
        // 编辑事务快照：进入编辑时记录原始数据，取消/关闭/Esc 时回滚
        this.editSnapshot = null;

        // 分页相关属性
        this.currentPage = 0;
        this.pages = [];
        this.itemsPerPage = 0;
        this.totalPages = 1;
        // 翻页锁：过渡进行中忽略新的翻页触发，避免一次手势连翻多页
        this.pageSwitchLocked = false;
        this._lastPageSwitchAt = 0;

        // 窗口尺寸变化时重新计算列间距/列数，避免窄窗口下网格被裁切（只调整布局，不重新渲染）
        window.addEventListener('resize', () => {
            clearTimeout(this._layoutResizeTimer);
            this._layoutResizeTimer = setTimeout(() => {
                const grid = document.getElementById('websitesGrid');
                if (grid) this.applyWebsiteLayout(grid);
            }, 120);
        });
    }

    // 获取所有网站
    getAllWebsites() {
        return this.websites;
    }

    // 添加网站
    addWebsite(website) {
        const newWebsite = {
            id: Date.now(),
            iconSize: 50, // 默认图标大小为50%
            iconBgColor: '#ffffff', // 默认图标底色为白色
            ...website
        };
        this.websites.push(newWebsite);
        this.dataManager.saveData('websites', this.websites);
        return newWebsite;
    }

    // 更新网站
    updateWebsite(id, updates) {
        const index = this.websites.findIndex(w => w.id === id);
        if (index !== -1) {
            this.websites[index] = { ...this.websites[index], ...updates };
            this.dataManager.saveData('websites', this.websites);
            return this.websites[index];
        }
        return null;
    }

    // 删除网站
    deleteWebsite(id) {
        this.websites = this.websites.filter(w => w.id !== id);
        this.dataManager.saveData('websites', this.websites);
    }

    // 渲染网站网格
    // options.transition: 翻页触发时为 true（走新旧页过渡而不是逐项重新入场）
    // options.direction: 'next' / 'prev'，决定滑动方向
    // options.data: 传入内存数据（取消编辑时按进入编辑的快照重绘，不读写 localStorage）
    renderWebsites(options = {}) {
        console.log('开始渲染网站...');
        const container = document.getElementById('websitesGrid');
        
        // 确保settings正确加载
        this.settings = this.dataManager.getData('settings');
        console.log('Settings:', this.settings);
        
        // 确保websites正确加载
        if (Array.isArray(options.data)) {
            this.websites = options.data;
        } else {
            this.websites = this.dataManager.getData('websites');
        }
        console.log('Websites:', this.websites);
        
        // 应用网站布局设置
        this.applyWebsiteLayout(container);

        if (!this.websites || this.websites.length === 0) {
            console.log('No websites to render! Using default websites.');
            // 使用新的默认网站列表，确保能显示新增的网站
            this.websites = this.dataManager.defaults.websites;
            // 保存默认网站到localStorage
            this.dataManager.saveData('websites', this.websites);
        }

        // 分页逻辑
        const layout = this.settings.layout || { rows: 2, columns: 6, columnGap: 105, rowGap: 58 };
        // 计算每页可显示的网站数量
        this.itemsPerPage = layout.rows * layout.columns;
        console.log('每页可显示网站数量:', this.itemsPerPage);
        
        // 重置当前页码，避免超出范围
        this.totalPages = Math.ceil(this.websites.length / this.itemsPerPage);
        if (this.currentPage >= this.totalPages) {
            this.currentPage = Math.max(0, this.totalPages - 1);
        }
        console.log('总页数:', this.totalPages, '当前页:', this.currentPage);
        
        // 将网站数据分割成多页
        this.pages = [];
        for (let i = 0; i < this.totalPages; i++) {
            const start = i * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            this.pages.push(this.websites.slice(start, end));
        }

        // 只渲染当前页的网站
        const currentPageWebsites = this.pages[this.currentPage] || [];
        console.log('当前页网站:', currentPageWebsites);

        // 翻页过渡准备：先给旧页拍快照，再同步渲染新页；
        // 动画阶段两者严格串行（旧页离场后才允许新页入场），不会同屏可见
        const isPageSwitch = options.transition === true;
        const transitionType = this.getPageTransitionType();
        const direction = options.direction === 'prev' ? -1 : 1;
        const canTransition = isPageSwitch
            && typeof container.animate === 'function'
            && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            && transitionType !== 'none'
            && this.totalPages > 1
            && container.children.length > 0;

        let snapshot = null;
        let oldRect = null;
        if (canTransition) {
            oldRect = container.getBoundingClientRect();
            snapshot = container.cloneNode(true);
            snapshot.removeAttribute('id');
            snapshot.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
            snapshot.querySelectorAll('.icon-enter').forEach(el => {
                el.classList.remove('icon-enter');
                el.style.animationDelay = '';
            });
            snapshot.classList.remove('right-clicked');
            snapshot.classList.add('page-transition-snapshot');
            snapshot.setAttribute('aria-hidden', 'true');
            if ('inert' in snapshot) snapshot.inert = true;
        }

        // 直接同步渲染：首屏"涌现"动画会让图标在刷新后缺失/渐入近 1 秒，是"页面闪一下"的直接原因
        container.innerHTML = '';
        
        // 渲染新页面的网站
        currentPageWebsites.forEach((website, index) => {
            const websiteItem = document.createElement('div');
            // 翻页时整页由过渡动画接管，不再逐项入场（避免"先消失再逐个出现"的拖尾）
            websiteItem.className = isPageSwitch ? 'website-item' : 'website-item icon-enter';
            websiteItem.style.animationDelay = isPageSwitch ? '' : `${index * 12}ms`;
            websiteItem.addEventListener('animationend', () => {
                websiteItem.classList.remove('icon-enter');
                websiteItem.style.animationDelay = '';
            }, { once: true });
                
                // 使用全局设置的图标大小作为容器大小
                const globalIconSize = this.settings.websiteIconSize || 120;
                // 单个网站的iconSize现在是百分比，用于缩放图标
                const iconScale = website.iconSize || 100;
                const iconBgColor = website.iconBgColor || '#ffffff'; // 默认填充白色背景色
                
                // 图标加载失败时回退到本地图标，避免空白/裂图
                const safeIconSrc = website.icon || './icons/icon_32.png';
                
                // 调整网站标题与图标的间距，添加margin-top: 5px;
                const nameHTML = this.settings.showWebsiteNames ? `<span class="website-name" style="color: ${this.settings.websiteNameColor}; font-size: ${this.settings.websiteNameSize}px; margin-top: 5px;">${website.name}</span>` : '';
                
                // 构建图标HTML，支持底色和大小调整，添加统一的容器类
                let iconHTML = '';
                if (iconBgColor === 'transparent') {
                    // 透明底色，使用容器+图标结构，根据iconScale缩放图标
                    iconHTML = `
                        <div class="website-icon-container" style="width: ${globalIconSize}px; height: ${globalIconSize}px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="${safeIconSrc}" alt="${website.name}" class="website-icon" style="width: auto; height: auto; max-width: 90%; max-height: 90%; object-fit: contain; transform: scale(${iconScale / 100}); transition: transform 0.3s ease;">
                            <button class="website-edit-btn" data-id="${website.id}" title="编辑">
                                <div class="edit-box">
                                    <svg class="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    `;
                } else {
                    // 带底色的图标，根据iconScale缩放图标
                    iconHTML = `
                        <div class="website-icon-container" style="background: ${iconBgColor}; border-radius: 50%; width: ${globalIconSize}px; height: ${globalIconSize}px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="${safeIconSrc}" alt="${website.name}" style="width: auto; height: auto; max-width: 90%; max-height: 90%; object-fit: contain; transform: scale(${iconScale / 100}); transition: transform 0.3s ease;">
                            <button class="website-edit-btn" data-id="${website.id}" title="编辑">
                                <div class="edit-box">
                                    <svg class="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    `;
                }
                
                websiteItem.innerHTML = `
                    ${iconHTML}
                    <button class="website-delete-btn" data-id="${website.id}" title="删除">
                        <svg class="delete-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    ${nameHTML}
                `;

                // 图标加载失败时回退到本地图标，避免 favicon 不显示
                const iconImg = websiteItem.querySelector('.website-icon-container img');
                if (iconImg) {
                    iconImg.addEventListener('error', () => {
                        if (!iconImg.dataset.fallbackApplied) {
                            iconImg.dataset.fallbackApplied = '1';
                            iconImg.src = './icons/icon_32.png';
                        }
                    });
                }

                // 点击网站打开链接
                websiteItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.website-edit-btn') && !e.target.closest('.website-delete-btn')) {
                        const settings = this.dataManager.getData('settings');
                        const target = settings.openWebsiteInNewTab ? '_blank' : '_self';
                        window.open(website.url, target);
                    }
                });

                // 右键点击事件 - 添加right-clicked类显示删除按钮
                websiteItem.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); // 防止默认右键菜单
                    
                    // 为网站网格容器添加right-clicked类，显示删除按钮
                    container.classList.add('right-clicked');
                });

                // 编辑按钮事件
                websiteItem.querySelector('.website-edit-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.switchToWebsiteEditForEdit(website.id);
                });

                // 删除按钮事件
                websiteItem.querySelector('.website-delete-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteWebsite(website.id);
                    this.renderWebsites();
                });

                container.appendChild(websiteItem);
        });
        
        // 添加页面指示和切换功能
        this.renderPageIndicators(container);
        
        // 绑定鼠标滚轮事件来切换页面
        this.bindScrollEvent(container);

        if (canTransition) {
            this.runPageTransition(container, snapshot, oldRect, transitionType, direction);
        } else {
            // 无过渡（无动画/降级/首屏）时立即释放翻页锁，保证下一次翻页可用
            this.pageSwitchLocked = false;
        }

        // 图标已同步插入 DOM，解除首帧内容隐藏：
        // 浏览器绘制内容的第一帧就包含全部图标，不会再出现"图标缺失"的帧
        document.documentElement.classList.remove('icons-pending');
    }

    // 读取当前翻页动画类型（始终以 localStorage 合并后的设置为准，避免实例缓存过期）
    getPageTransitionType() {
        const settings = this.dataManager.getData('settings') || {};
        const type = settings.pageTransition;
        return ['slide', 'fade', 'stack', 'none'].includes(type) ? type : 'slide';
    }

    // 执行新旧页过渡：严格串行（旧页先离场并被移除，新页随后入场）
    runPageTransition(grid, snapshot, oldRect, type, direction) {
        const parent = grid.parentElement;
        const parentRect = parent.getBoundingClientRect();

        // 快照层绝对定位到旧页原来的位置，不参与布局流
        snapshot.style.position = 'absolute';
        snapshot.style.left = `${oldRect.left - parentRect.left}px`;
        snapshot.style.top = `${oldRect.top - parentRect.top}px`;
        snapshot.style.width = `${oldRect.width}px`;
        snapshot.style.height = `${oldRect.height}px`;
        snapshot.style.margin = '0';
        parent.appendChild(snapshot);

        // 新页的最终位置（末页图标较少时宽度会变窄）
        const newRect = grid.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
        const viewportMargin = 32;
        // 严格串行：旧页先完整移出可视区，再让新页进入
        // 位移量以“完全离开视口”为准，保证任一帧只有一页的像素
        const exitDistance = Math.round(direction > 0
            ? oldRect.right + viewportMargin
            : viewportWidth - oldRect.left + viewportMargin);
        const entryDistance = Math.round(direction > 0
            ? viewportWidth - newRect.left + viewportMargin
            : newRect.right + viewportMargin);
        // 回弹幅度按页宽等比缩放并钳制，窄屏/多列时不会显得夸张
        const overshoot = Math.max(10, Math.min(22, Math.round(Math.min(oldRect.width, newRect.width) * 0.03)));
        const stackOvershoot = Math.max(6, Math.min(14, Math.round(overshoot * 0.55)));
        const configs = {
            // 水平滑动：旧页先整页滑出视口（此间新页停在视口外），旧页移除后新页再滑入并回弹
            slide: {
                outDuration: 140,
                inDelay: 140,
                inDuration: 230,
                out: [
                    { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0)', easing: 'cubic-bezier(0.4, 0, 1, 1)' },
                    { offset: 1, opacity: 1, transform: `translate3d(${-exitDistance * direction}px, 0, 0)` }
                ],
                in: [
                    { offset: 0, opacity: 1, transform: `translate3d(${entryDistance * direction}px, 0, 0)`, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' },
                    { offset: 0.78, opacity: 1, transform: `translate3d(${-overshoot * direction}px, 0, 0)`, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
                    { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0)' }
                ]
            },
            // 交叉淡入：旧页先完全淡出（末段保持 opacity:0 再移除），新页再淡入 + 轻微缩放回弹，不重叠
            fade: {
                outDuration: 120,
                inDelay: 120,
                inDuration: 150,
                out: [
                    { offset: 0, opacity: 1, transform: 'scale(1)', easing: 'cubic-bezier(0.4, 0, 1, 1)' },
                    { offset: 0.995, opacity: 0, transform: 'scale(1.03)', easing: 'linear' },
                    // 末段保持全透明：即使快照尚未被移除，也不会有任何可见像素
                    { offset: 1, opacity: 0, transform: 'scale(1.03)' }
                ],
                in: [
                    { offset: 0, opacity: 0, transform: 'scale(0.96)', easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)' },
                    { offset: 0.7, opacity: 1, transform: 'scale(1.02)', easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
                    { offset: 1, opacity: 1, transform: 'scale(1)' }
                ]
            },
            // 上下堆叠：旧页先上移淡出（末段保持 opacity:0），新页再从下方滑入并越过目标位回弹
            stack: {
                outDuration: 130,
                inDelay: 130,
                inDuration: 240,
                out: [
                    { offset: 0, opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', easing: 'cubic-bezier(0.4, 0, 1, 1)' },
                    { offset: 0.995, opacity: 0, transform: `translate3d(0, ${-24 * direction}px, 0) scale(0.97)`, easing: 'linear' },
                    { offset: 1, opacity: 0, transform: `translate3d(0, ${-24 * direction}px, 0) scale(0.97)` }
                ],
                in: [
                    { offset: 0, opacity: 0, transform: `translate3d(0, ${44 * direction}px, 0) scale(0.95)`, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' },
                    { offset: 0.76, opacity: 1, transform: `translate3d(0, ${-stackOvershoot * direction}px, 0) scale(1.01)`, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
                    { offset: 1, opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
                ]
            }
        };

        const config = configs[type] || configs.slide;
        let finished = false;
        // 旧页动画一结束就移除快照：此时它已完全离开视口/完全透明，
        // 新页随后（inDelay）才开始，二者不会在任何一帧同时可见
        const removeSnapshot = () => {
            if (snapshot.isConnected) snapshot.remove();
        };
        const finish = () => {
            if (finished) return;
            finished = true;
            removeSnapshot();
            if (inAnim) inAnim.cancel();
            this.pageSwitchLocked = false;
        };

        // 关键帧各自带 easing 分段曲线，整体缓动必须为 linear，
        // 否则两层缓动会叠加（进度被提前拉满，动画看起来“秒到再回弹”）
        const inAnim = grid.animate(config.in, {
            duration: config.inDuration,
            delay: config.inDelay,
            easing: 'linear',
            fill: 'both'
        });
        const outAnim = snapshot.animate(config.out, {
            duration: config.outDuration,
            easing: 'linear',
            fill: 'both'
        });

        // 旧页收尾即清场，杜绝残留快照与新页同框。
        // onfinish 在“更新动画”阶段同步派发，早于本帧绘制，快照不会以半透明残留被画出来
        outAnim.onfinish = removeSnapshot;
        outAnim.finished.then(removeSnapshot).catch(removeSnapshot);
        const total = config.inDelay + config.inDuration;
        Promise.allSettled([inAnim.finished, outAnim.finished]).then(finish);
        // 兜底：动画被系统打断/暂停时也能解锁并清理快照
        setTimeout(finish, total + 200);
    }

    // 统一的翻页入口：处理页码、翻页锁与过渡方向
    switchPage(pageIndex, direction) {
        if (this.pageSwitchLocked) return;
        if (pageIndex === this.currentPage) return;
        if (pageIndex < 0 || pageIndex >= this.totalPages) return;
        this.currentPage = pageIndex;
        this.pageSwitchLocked = true;
        this.renderWebsites({ transition: true, direction });
    }
    
    // 渲染页面指示
    renderPageIndicators(container) {
        const oldIndicators = document.getElementById('pageIndicators');

        // 如果只有一页，不需要显示页面指示
        if (this.totalPages <= 1) {
            if (oldIndicators) oldIndicators.remove();
            return;
        }

        // 翻页时页数没变：只更新激活态，不重建 DOM，分页点不再闪一下
        if (oldIndicators && oldIndicators.children.length === this.totalPages) {
            Array.from(oldIndicators.children).forEach((indicator, i) => {
                indicator.className = i === this.currentPage ? 'page-indicator active' : 'page-indicator';
            });
            return;
        }

        // 移除旧的页面指示
        if (oldIndicators) {
            oldIndicators.remove();
        }
        
        // 创建页面指示容器
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.id = 'pageIndicators';
        
        // 创建页面指示点
        for (let i = 0; i < this.totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = i === this.currentPage ? 'page-indicator active' : 'page-indicator';
            
            // 点击指示点切换页面（与滚轮共用翻页锁，过渡中忽略重复触发）
            indicator.addEventListener('click', () => {
                this.switchPage(i, i > this.currentPage ? 'next' : 'prev');
            });
            
            indicatorsContainer.appendChild(indicator);
        }
        
        // 将页面指示添加到容器中
        container.parentNode.appendChild(indicatorsContainer);
    }
    
    // 绑定鼠标滚轮事件来切换页面
    bindScrollEvent(container) {
        // 移除旧的事件监听器
        const parent = container.parentNode;
        parent.removeEventListener('wheel', this.handleScroll);
        
        // 保存this上下文
        const self = this;
        
        // 处理鼠标滚轮事件
        this.handleScroll = function(e) {
            e.preventDefault();

            // 过渡进行中：忽略新的手势，防止一次滚动连翻多页
            if (self.pageSwitchLocked) return;
            // 触控板/高精度滚轮的零碎微小 delta 不触发翻页
            if (Math.abs(e.deltaY) < 2) return;

            // 两次翻页之间的最小间隔（覆盖手势的连续事件流）
            // 最长翻页动画为 370ms（水平滑动 140+230 / 上下堆叠 130+240），
            // 冷却 380ms 保证冷却结束时动画一定已收尾，不出现残影叠加
            const now = performance.now();
            if (now - self._lastPageSwitchAt < 380) return;

            if (e.deltaY > 0) {
                if (self.currentPage >= self.totalPages - 1) return;
                self._lastPageSwitchAt = now;
                self.switchPage(self.currentPage + 1, 'next');
            } else {
                if (self.currentPage <= 0) return;
                self._lastPageSwitchAt = now;
                self.switchPage(self.currentPage - 1, 'prev');
            }
        };
        
        // 添加新的事件监听器
        parent.addEventListener('wheel', this.handleScroll, { passive: false });
    }
    

    
    // 应用网站布局设置
    applyWebsiteLayout(container) {
        const layout = this.settings.layout || { rows: 2, columns: 6, columnGap: 105, rowGap: 58 };
        // 兼容历史数据缺失间距字段的情况（基线与默认值 105/58 一致）
        const rows = layout.rows || 2;
        const columns = layout.columns || 6;
        const columnGap = layout.columnGap ?? 105;
        const rowGap = layout.rowGap ?? 58;

        // 固定列数的等宽轨道：格位只由列数决定，与当前页有几个项目无关。
        // 这样 1 个 / 2 个 / 不满一页时，图标仍从左上第 1 格开始排，不会收缩居中。
        const iconSize = this.settings.websiteIconSize || 120;
        const itemWidth = iconSize + 20; // website-item 左右内边距各 10px
        const parent = container.parentElement;
        let available = 0;
        if (parent) {
            const cs = getComputedStyle(parent);
            available = parent.clientWidth - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
        }
        // 窄窗口保护：判断依据只有可用宽度，从不参考项目数量。
        // 先把列间距压到 8px 下限（保住列数），仍放不下才减少视觉列数。
        let effectiveColumns = columns;
        let effectiveGap = columnGap;
        if (available > 0 && columns > 1) {
            const neededWidth = columns * itemWidth + (columns - 1) * columnGap;
            if (neededWidth > available) {
                const gapForAllColumns = Math.floor((available - columns * itemWidth) / (columns - 1));
                if (gapForAllColumns >= 8) {
                    effectiveGap = gapForAllColumns;
                } else {
                    effectiveColumns = Math.max(1, Math.floor((available + columnGap) / (itemWidth + columnGap)));
                }
            }
        }

        // 网格宽度按“满列”计算：空出来的格位保留在原位，不塌陷
        let gridWidth = effectiveColumns * itemWidth + (effectiveColumns - 1) * effectiveGap;
        if (available > 0) {
            gridWidth = Math.min(gridWidth, available);
        }

        // 设置网格布局
        container.style.display = 'grid';
        container.style.gridTemplateColumns = `repeat(${effectiveColumns}, minmax(0, 1fr))`;
        container.style.gridAutoRows = 'auto';
        container.style.columnGap = `${effectiveGap}px`;
        container.style.rowGap = `${rowGap}px`;

        // 左对齐：不足一页时从左上角开始填格位，不做整体居中
        container.style.justifyContent = 'start';
        container.style.alignContent = 'start';

        // 宽度固定为满列宽度，空位不参与布局收缩；由父级 flex 居中整块网格
        container.style.width = `${gridWidth}px`;
        container.style.maxWidth = 'none';
    }

    // 编辑网站 - 只填充数据，不显示模态框
    editWebsite(id) {
        const website = this.websites.find(w => w.id === id);
        if (website) {
            // 填充现有网站的数据
            document.getElementById('websiteName').value = website.name;
            document.getElementById('websiteUrl').value = website.url;
            document.getElementById('websiteIcon').value = website.icon || '';
            
            // 设置图标编辑选项
            // 单个网站的iconSize表示图标大小，范围50-200%，默认50%
        const iconSizePercent = website.iconSize || 50;
        document.getElementById('iconSize').value = iconSizePercent;
        document.getElementById('currentIconSize').textContent = `${iconSizePercent}%`;
            
            // 设置底色，默认填充白色背景色
            const bgColor = website.iconBgColor || '#ffffff';
            document.getElementById('iconBgColor').value = bgColor;
            document.getElementById('currentBgColor').textContent = bgColor;
            
            // 显示图标预览
            this.updateIconPreview(website.icon, website.iconBgColor);
            
            // 保存编辑状态
            const form = document.getElementById('websiteForm');
            form.dataset.editId = id;
            // 进入编辑：记录原始数据快照，取消时用它兜底回滚
            this.editSnapshot = JSON.parse(JSON.stringify(website));
            // 记录进入编辑时的原始图标，用于手动输入校验失败时恢复预览
            form.dataset.originalIcon = website.icon || '';
            form.dataset.iconValidatedValue = website.icon || '';
            // 编辑现有网站：进入时不清空/不覆盖原字段，也不因首次失焦就重新抓取
            delete form.dataset.nameTouched;
            delete form.dataset.iconTouched;
            delete form.dataset.nameAutoFilled;
            delete form.dataset.iconAutoFilled;
            delete form.dataset.iconError;
            const normalizedUrl = this.normalizeSiteUrl(website.url);
            this.lastInfoUrl = normalizedUrl ? normalizedUrl.href : '';
        }
    }

    // 显示添加网站界面（设置的第二层）
    showAddWebsiteModal() {
        // 显示设置模态框
        document.getElementById('settingsModal').style.display = 'block';
        
        // 切换到网站编辑界面
        this.switchToWebsiteEdit();
        
        // 只清空URL状态，不再重置其他字段
        document.getElementById('urlStatus').textContent = '';
        // 新一次添加：允许首次输入后自动抓取
        this.lastInfoUrl = '';
        // 新增模式没有可回滚的编辑快照
        this.editSnapshot = null;
        // 新增模式没有图标：先展示占位状态
        this.updateIconPreview('');
        
        // 设置事件监听器
        const cancelBtn = document.getElementById('cancelAddWebsite');
        const submitBtn = document.querySelector('#websiteForm .submit-btn');
        
        // 移除之前的事件监听器，避免重复绑定
        cancelBtn.removeEventListener('click', this.hideAddWebsiteModal.bind(this));
        
        // 取消按钮
        cancelBtn.addEventListener('click', this.hideAddWebsiteModal.bind(this));
    }

    // 隐藏添加网站界面，返回设置主界面
    hideAddWebsiteModal() {
        const formEl = document.getElementById('websiteForm');
        const editId = formEl.dataset.editId ? parseInt(formEl.dataset.editId) : null;

        // 取消编辑：按进入编辑时的快照在内存里还原并重绘。
        // 面板内的实时预览只改主界面 DOM，从不写 localStorage，这里也不写
        let restoredWebsites = null;
        if (editId && this.editSnapshot) {
            const stored = this.dataManager.getData('websites') || [];
            const index = stored.findIndex(w => w.id === editId);
            if (index !== -1) {
                stored[index] = JSON.parse(JSON.stringify(this.editSnapshot));
            }
            this.websites = stored;
            restoredWebsites = stored;
        }
        this.editSnapshot = null;

        // 重置表单数据，确保下次打开时表单为空
        formEl.reset();
        
        // 重置图标编辑选项
        document.getElementById('iconSize').value = 50; // 默认图标大小为50%
        document.getElementById('currentIconSize').textContent = '50%'; // 显示50%
        // 重置底色为白色，显示也为白色
        document.getElementById('iconBgColor').value = '#ffffff'; // 默认填充白色背景色
        document.getElementById('currentBgColor').textContent = '#ffffff'; // 显示为白色
        // 清空图标预览
        this.updateIconPreview('');
        
        // 清空编辑ID与图标校验状态
        const form = document.getElementById('websiteForm');
        delete form.dataset.editId;
        delete form.dataset.iconValidatedValue;
        delete form.dataset.iconResolvedValue;
        delete form.dataset.iconError;
        delete form.dataset.originalIcon;
        delete form.dataset.nameTouched;
        delete form.dataset.iconTouched;
        delete form.dataset.nameAutoFilled;
        delete form.dataset.iconAutoFilled;
        this.lastInfoUrl = '';
        // 关闭面板即作废所有在途抓取，避免结果回写下次打开的表单
        this.siteInfoSeq = (this.siteInfoSeq || 0) + 1;
        this.iconFetchSeq = (this.iconFetchSeq || 0) + 1;
        clearTimeout(this.websiteInfoTimer);
        const iconStatus = document.getElementById('iconStatus');
        if (iconStatus) {
            iconStatus.textContent = '';
        }
        
        // 直接关闭设置模态框
        document.getElementById('settingsModal').style.display = 'none';

        // 取消编辑后按快照重绘主界面（内存数据，不落盘）
        if (editId) this.renderWebsites(restoredWebsites ? { data: restoredWebsites } : {});

        // 切换回设置主界面，确保下次打开设置时显示正确内容
        this.switchToSettingsMain();
    }
    
    // 切换到网站编辑界面
    switchToWebsiteEdit() {
        // 不显示返回按钮
        
        // 更新标题
        document.getElementById('settingsTitle').textContent = '添加网站';
        
        // 切换内容显示
        document.getElementById('settings-main-content').classList.remove('active');
        document.getElementById('settings-website-content').classList.add('active');
        
        // 表单按钮文本设为"添加"
        document.querySelector('#websiteForm .submit-btn').textContent = '添加';
        
        // 应用图标大小滑块样式
        const iconSizeSlider = document.getElementById('iconSize');
        if (iconSizeSlider) {
            // 应用基础样式
            iconSizeSlider.style.setProperty('-webkit-appearance', 'none', 'important');
            iconSizeSlider.style.setProperty('-moz-appearance', 'none', 'important');
            iconSizeSlider.style.setProperty('appearance', 'none', 'important');
            iconSizeSlider.style.width = '100%';
            iconSizeSlider.style.height = '8px';
            iconSizeSlider.style.borderRadius = '4px';
            iconSizeSlider.style.background = '#e0e0e0';
            iconSizeSlider.style.outline = 'none';
            iconSizeSlider.style.margin = '10px 0';
            iconSizeSlider.style.border = 'none';
            iconSizeSlider.style.padding = '0';
            iconSizeSlider.style.boxShadow = 'none';
            iconSizeSlider.style.cursor = 'pointer';
            iconSizeSlider.style.flex = '1';
            
            // 应用滑块按钮样式
            iconSizeSlider.style.setProperty('--slider-thumb-width', '18px');
            iconSizeSlider.style.setProperty('--slider-thumb-height', '18px');
        }
    }
    
    // 切换到设置主界面
    switchToSettingsMain() {
        // 隐藏返回按钮
        document.getElementById('settingsBackBtn').style.display = 'none';
        
        // 更新标题
        document.getElementById('settingsTitle').textContent = '设置';
        
        // 切换内容显示
        document.getElementById('settings-main-content').classList.add('active');
        document.getElementById('settings-website-content').classList.remove('active');
        document.getElementById('settings-custom-layout-content').classList.remove('active');
    }
    
    // 切换到网站编辑界面用于编辑
    switchToWebsiteEditForEdit(websiteId) {
        // 显示设置模态框
        document.getElementById('settingsModal').style.display = 'block';
        
        // 不显示返回按钮
        
        // 更新标题
        document.getElementById('settingsTitle').textContent = '编辑网站';
        
        // 切换内容显示
        document.getElementById('settings-main-content').classList.remove('active');
        document.getElementById('settings-website-content').classList.add('active');
        
        // 表单按钮文本设为"保存"
        document.querySelector('#websiteForm .submit-btn').textContent = '保存';
        
        // 填充网站数据
        this.editWebsite(websiteId);
        
        // 设置事件监听器
        const cancelBtn = document.getElementById('cancelAddWebsite');
        
        // 移除之前的事件监听器，避免重复绑定
        cancelBtn.removeEventListener('click', this.hideAddWebsiteModal.bind(this));
        
        // 取消按钮
        cancelBtn.addEventListener('click', this.hideAddWebsiteModal.bind(this));
    }

    // 更新主界面图标显示
    updateMainIcon(websiteId) {
        // 获取当前编辑的网站
        const website = this.websites.find(w => w.id === websiteId);
        if (!website) return;
        
        // 获取所有网站项元素
        const websiteItems = document.querySelectorAll('.website-item');
        
        // 查找对应的网站项
        for (const item of websiteItems) {
            const editBtn = item.querySelector('.website-edit-btn');
            if (editBtn && parseInt(editBtn.dataset.id) === websiteId) {
                // 获取全局设置的图标大小，用于容器大小
                const globalIconSize = this.settings.websiteIconSize || 120;
                // 单个网站的iconSize现在是百分比，用于缩放图标
                const iconScale = website.iconSize || 100;
                const iconBgColor = website.iconBgColor;
                const iconUrl = website.icon || './icons/icon_32.png';
                
                // 重新构建图标HTML，包含编辑按钮
                let iconHTML = '';
                if (iconBgColor === 'transparent') {
                    // 透明底色
                    iconHTML = `
                        <div class="website-icon-container" style="width: ${globalIconSize}px; height: ${globalIconSize}px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="${iconUrl}" alt="${website.name}" class="website-icon" style="width: auto; height: auto; max-width: 90%; max-height: 90%; object-fit: contain; transform: scale(${iconScale / 100}); transition: transform 0.3s ease;">
                            <button class="website-edit-btn" data-id="${website.id}" title="编辑">
                                <div class="edit-box">
                                    <svg class="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    `;
                } else {
                    // 带底色的图标
                    iconHTML = `
                        <div class="website-icon-container" style="background: ${iconBgColor}; border-radius: 50%; width: ${globalIconSize}px; height: ${globalIconSize}px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                            <img src="${iconUrl}" alt="${website.name}" class="website-icon" style="width: auto; height: auto; max-width: 90%; max-height: 90%; object-fit: contain; transform: scale(${iconScale / 100}); transition: transform 0.3s ease;">
                            <button class="website-edit-btn" data-id="${website.id}" title="编辑">
                                <div class="edit-box">
                                    <svg class="edit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    `;
                }
                
                // 更新网站项的图标
                const iconContainer = item.querySelector('.website-icon-container');
                if (iconContainer) {
                    iconContainer.outerHTML = iconHTML;
                    // 新图标加载失败时回退，避免裂图
                    const newIconImg = item.querySelector('.website-icon-container img');
                    if (newIconImg) {
                        newIconImg.addEventListener('error', () => {
                            if (!newIconImg.dataset.fallbackApplied) {
                                newIconImg.dataset.fallbackApplied = '1';
                                newIconImg.src = './icons/icon_32.png';
                            }
                        });
                    }
                    // 重新绑定编辑按钮事件
                    const newEditBtn = item.querySelector('.website-edit-btn');
                    if (newEditBtn) {
                        newEditBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.switchToWebsiteEditForEdit(website.id);
                        });
                    }
                }
                break;
            }
        }
    }
    
    // 网站面板图标预览：固定 72×72，仅展示图标本身（不跟随单站图标大小滑块）
    // 加载失败只改预览占位，具体原因仍由 #iconStatus 展示，两者互不覆盖
    updateIconPreview(iconUrl, bgColor = null) {
        const container = document.getElementById('websiteIconPreview');
        if (!container) return;

        const bgText = (bgColor !== null && bgColor !== undefined)
            ? String(bgColor).trim()
            : ((document.getElementById('currentBgColor') || {}).textContent || '').trim();
        const previewBg = bgText || '#ffffff';
        const isTransparent = previewBg === 'transparent';
        container.classList.toggle('is-transparent-bg', isTransparent);
        container.style.background = isTransparent ? '' : previewBg;

        const value = (iconUrl || '').trim();
        const token = String((Number(container.dataset.previewToken) || 0) + 1);
        container.dataset.previewToken = token;
        const isStale = () => container.dataset.previewToken !== token;

        const renderPlaceholder = (text) => {
            if (isStale()) return;
            container.innerHTML = '';
            const span = document.createElement('span');
            span.className = 'icon-preview-placeholder';
            span.textContent = text;
            container.appendChild(span);
        };

        if (!value) {
            renderPlaceholder('暂无图标');
            return;
        }

        renderPlaceholder('加载中…');
        const img = new Image();
        img.className = 'icon-preview-img';
        img.alt = '图标预览';
        img.referrerPolicy = 'no-referrer';
        img.onload = () => {
            if (isStale()) return;
            if (!img.naturalWidth || !img.naturalHeight) {
                renderPlaceholder('图标加载失败');
                return;
            }
            container.innerHTML = '';
            container.appendChild(img);
        };
        img.onerror = () => renderPlaceholder('图标加载失败');
        // 超时兜底：部分地址既不触发 load 也不触发 error
        setTimeout(() => {
            if (!isStale() && !container.querySelector('img')) renderPlaceholder('图标加载失败');
        }, 5000);
        img.src = value;
    }

    // 编辑实时预览：把面板当前值直接作用到主界面“正在编辑的那一项”，不写 localStorage
    syncEditPreview() {
        const form = document.getElementById('websiteForm');
        const editId = form.dataset.editId;
        if (!editId) return;

        // 只找当前编辑项，避免影响其他网站
        const item = Array.from(document.querySelectorAll('#websitesGrid .website-item')).find(el => {
            const btn = el.querySelector('.website-edit-btn');
            return btn && btn.dataset.id === String(editId);
        });
        if (!item) return;
        const container = item.querySelector('.website-icon-container');
        const img = container ? container.querySelector('img') : null;
        if (!container || !img) return;

        // 图标：优先用校验/抓取解析出的 DataURL，保证离线也能立即显示
        const iconValue = (document.getElementById('websiteIcon').value || '').trim();
        const resolvedIcon = form.dataset.iconResolvedValue || iconValue;
        if (resolvedIcon && img.getAttribute('src') !== resolvedIcon) {
            img.setAttribute('src', resolvedIcon);
        }

        // 图标大小：滑块是百分比，与主界面渲染时的 scale 保持一致
        const size = parseInt(document.getElementById('iconSize').value, 10);
        if (Number.isFinite(size)) {
            img.style.transform = `scale(${size / 100})`;
        }

        // 底色：透明时移除圆形底色，否则按所选颜色填充
        const bg = (document.getElementById('currentBgColor').textContent || '').trim();
        if (bg === 'transparent') {
            container.style.background = 'transparent';
            container.style.borderRadius = '0';
        } else {
            container.style.background = bg;
            container.style.borderRadius = '50%';
        }
    }

    // 一键适配：从当前图标提取底色（仅更新面板预览，保存后才落盘）
    async adaptIconBgColor() {
        const iconInput = document.getElementById('websiteIcon');
        const status = document.getElementById('iconStatus');
        const setStatus = (text, color) => {
            if (status) status.innerHTML = `<span style="color: ${color};">${text}</span>`;
        };
        const value = (iconInput.value || '').trim();
        if (!value) {
            setStatus('请先获取或上传图标', '#ea4335');
            return;
        }

        setStatus('正在提取图标底色…', '#4285f4');
        let src = value;
        // 远程图标先转 DataURL，规避 canvas 跨域污染
        if (/^https?:\/\//i.test(value)) {
            try {
                const response = await fetch(value, { cache: 'no-store' });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                if (!/^image\//i.test(blob.type || '')) throw new Error('返回内容不是图片');
                src = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result || ''));
                    reader.onerror = () => reject(new Error('转存失败'));
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                // 转存失败时仍尝试直接绘制；若被污染会走下面的失败提示
                src = value;
            }
        }

        const result = await this.extractIconBgColor(src);
        if (result && typeof result === 'object') {
            const reason = result.error === 'canvas-tainted' ? '图标跨域受限，转存后仍无法取样' : '图标无法解析';
            setStatus(`底色提取失败：${reason}`, '#ea4335');
            return;
        }
        if (!result) {
            document.getElementById('currentBgColor').textContent = 'transparent';
            this.updateIconPreview(value, 'transparent');
            this.syncEditPreview();
            setStatus('图标边缘均为透明，已设为透明底色', '#ea4335');
            return;
        }

        document.getElementById('iconBgColor').value = result;
        document.getElementById('currentBgColor').textContent = result;
        this.updateIconPreview(value, result);
        this.syncEditPreview();
        setStatus(`已适配图标底色 ${result}`, '#34a853');
    }

    // canvas 取样：边缘 2px 环带的众数色（透明像素跳过），整图无可见像素返回 null
    extractIconBgColor(src) {
        return new Promise((resolve) => {
            if (!src) return resolve(null);
            const img = new Image();
            img.referrerPolicy = 'no-referrer';
            let settled = false;
            const finish = (value) => {
                if (settled) return;
                settled = true;
                resolve(value);
            };
            const timer = setTimeout(() => {
                img.src = '';
                finish({ error: 'load-timeout' });
            }, 6000);

            img.onerror = () => {
                clearTimeout(timer);
                finish({ error: 'load-failed' });
            };
            img.onload = () => {
                clearTimeout(timer);
                try {
                    const naturalWidth = img.naturalWidth || 0;
                    const naturalHeight = img.naturalHeight || 0;
                    if (!naturalWidth || !naturalHeight) return finish({ error: 'empty-image' });

                    const maxSide = 128;
                    const scale = Math.min(1, maxSide / Math.max(naturalWidth, naturalHeight));
                    const width = Math.max(1, Math.round(naturalWidth * scale));
                    const height = Math.max(1, Math.round(naturalHeight * scale));
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    if (!ctx) return finish({ error: 'no-canvas' });
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    let data;
                    try {
                        data = ctx.getImageData(0, 0, width, height).data;
                    } catch (error) {
                        return finish({ error: 'canvas-tainted' });
                    }

                    const all = [];
                    const edge = [];
                    const ring = 2;
                    for (let y = 0; y < height; y++) {
                        for (let x = 0; x < width; x++) {
                            const i = (y * width + x) * 4;
                            if (data[i + 3] < 64) continue;
                            const pixel = [data[i], data[i + 1], data[i + 2]];
                            all.push(pixel);
                            if (x < ring || y < ring || x >= width - ring || y >= height - ring) edge.push(pixel);
                        }
                    }
                    // 边缘没有可取样像素：说明图标本身是透明底，回退为透明
                    if (!edge.length) return finish(null);
                    if (!all.length) return finish(null);

                    // 量化到 16 级后取众数桶，再求桶内真实均值，避免单一角落误判
                    const buckets = new Map();
                    for (const [r, g, b] of edge) {
                        const key = `${r >> 4},${g >> 4},${b >> 4}`;
                        let bucket = buckets.get(key);
                        if (!bucket) {
                            bucket = { count: 0, r: 0, g: 0, b: 0 };
                            buckets.set(key, bucket);
                        }
                        bucket.count += 1;
                        bucket.r += r;
                        bucket.g += g;
                        bucket.b += b;
                    }
                    let best = null;
                    for (const bucket of buckets.values()) {
                        if (!best || bucket.count > best.count) best = bucket;
                    }
                    if (!best) return finish(null);
                    const toHex = (value) => Math.round(value / best.count).toString(16).padStart(2, '0');
                    finish(`#${toHex(best.r)}${toHex(best.g)}${toHex(best.b)}`);
                } catch (error) {
                    finish({ error: error.message });
                }
            };
            img.src = src;
        });
    }

    // 把用户输入整理成可用的 http(s) 地址（允许省略协议）
    normalizeSiteUrl(input) {
        const value = (input || '').trim();
        if (!value) return null;
        const withProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value) ? value : `https://${value}`;
        try {
            const parsed = new URL(withProtocol);
            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
            return parsed;
        } catch (error) {
            return null;
        }
    }

    // 直接抓取网页 HTML：扩展已声明 https://*/*、http://*/* 主机权限，可跨域读取
    async fetchSiteHtml(url, timeoutMs = 6000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                redirect: 'follow',
                credentials: 'omit',
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const contentType = (response.headers.get('content-type') || '').toLowerCase();
            if (contentType && !/(text\/html|application\/xhtml\+xml|text\/plain)/.test(contentType)) {
                throw new Error(`返回内容不是网页（${contentType.split(';')[0]}）`);
            }
            // 只读前 320KB：足够取 <title> 与 <link rel="icon">，避免大页面拖慢
            const limit = 320 * 1024;
            if (response.body && typeof response.body.getReader === 'function') {
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let received = 0;
                let text = '';
                while (received < limit) {
                    const chunk = await reader.read();
                    if (chunk.done) break;
                    received += chunk.value.byteLength;
                    text += decoder.decode(chunk.value, { stream: true });
                }
                try { await reader.cancel(); } catch (e) { /* 已读完时取消会抛错，忽略 */ }
                return text + decoder.decode();
            }
            return (await response.text()).slice(0, limit);
        } catch (error) {
            if (error.name === 'AbortError') throw new Error('请求超时');
            if (error instanceof TypeError) throw new Error('网络请求被拦截或目标不可达');
            throw error;
        } finally {
            clearTimeout(timer);
        }
    }

    decodeHtmlEntities(text) {
        if (!text) return '';
        const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
        return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, code) => {
            if (code.charAt(0) === '#') {
                const isHex = code.charAt(1) === 'x' || code.charAt(1) === 'X';
                const value = parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
                if (!Number.isFinite(value) || value <= 0 || value > 0x10ffff) return match;
                try { return String.fromCodePoint(value); } catch (e) { return match; }
            }
            const lower = code.toLowerCase();
            return Object.prototype.hasOwnProperty.call(named, lower) ? named[lower] : match;
        });
    }

    extractTitleFromHtml(html) {
        if (!html) return '';
        const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        if (!match) return '';
        const title = this.decodeHtmlEntities(match[1]).replace(/\s+/g, ' ').trim();
        // 纯符号/空标题视为未取到
        return /[\p{L}\p{N}]/u.test(title) ? title.slice(0, 80) : '';
    }

    // 从页面 HTML 里按实际声明提取图标候选（apple-touch-icon / icon / shortcut icon）
    extractIconCandidatesFromHtml(html, baseUrl) {
        if (!html) return [];
        const candidates = [];
        const seen = new Set();
        const linkTags = html.match(/<link\b[^>]*>/gi) || [];
        for (const tag of linkTags) {
            const relMatch = tag.match(/\brel\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
            if (!relMatch) continue;
            const rel = (relMatch[1] || relMatch[2] || relMatch[3] || '').toLowerCase();
            if (!rel.includes('icon')) continue;
            const hrefMatch = tag.match(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
            if (!hrefMatch) continue;
            const href = (hrefMatch[1] || hrefMatch[2] || hrefMatch[3] || '').trim();
            if (!href) continue;
            let absolute;
            try { absolute = new URL(href, baseUrl).href; } catch (e) { continue; }
            if (!/^(https?:|data:image\/)/i.test(absolute) || seen.has(absolute)) continue;

            let size = 0;
            const sizesMatch = tag.match(/\bsizes\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
            if (sizesMatch) {
                const sizesValue = sizesMatch[1] || sizesMatch[2] || sizesMatch[3] || '';
                sizesValue.split(/\s+/).forEach(item => {
                    const width = parseInt(item.toLowerCase().split('x')[0], 10);
                    if (Number.isFinite(width)) size = Math.max(size, width);
                });
            }
            const isApple = rel.includes('apple-touch');
            const isSvg = /\.svg(?:$|[?#])/i.test(absolute) || /\bimage\/svg\+xml\b/i.test(tag);
            candidates.push({
                url: absolute,
                rank: (isApple ? 1000 : 0) + size + (isSvg ? 40 : 0)
            });
            seen.add(absolute);
        }
        return candidates.sort((a, b) => b.rank - a.rank);
    }

    describeIconUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.origin === 'null' ? '内嵌图标' : `${parsed.origin}${parsed.pathname}`;
        } catch (e) {
            return url;
        }
    }

    // 抓取最优图标：页面实际声明的图标 → 同源常见路径 → 第三方 favicon 服务
    async fetchBestIcon({ pageUrl, origin, hostname, html = '', pageUnreachable = false }) {
        const reasons = [];
        const linkCandidates = this.extractIconCandidatesFromHtml(html, pageUrl).map(item => item.url);
        const pathCandidates = ['/apple-touch-icon.png', '/favicon.ico', '/favicon.svg'];
        const localCandidates = [];
        // 页面本身网络不可达时，同源候选大概率也超时，直接交给并行图标服务
        if (!pageUnreachable) {
            linkCandidates.concat(pathCandidates.map(path => `${origin}${path}`)).forEach(candidate => {
                if (!localCandidates.includes(candidate)) localCandidates.push(candidate);
            });
        }

        // 同源候选按顺序尝试（总时长 5 秒），第三方服务同时并行请求
        // 本地一旦命中优先采用本地图标；全部失败时再用并行服务里最先可用的结果
        const localTask = (async () => {
            const deadline = Date.now() + 5000;
            for (const candidate of localCandidates.slice(0, 6)) {
                if (Date.now() > deadline) {
                    reasons.push('其余同源候选超时跳过');
                    break;
                }
                const remaining = Math.max(1500, Math.min(3500, deadline - Date.now()));
                try {
                    const result = await this.validateIconUrl(candidate, remaining);
                    return { success: true, value: result.value, source: candidate, width: result.width, height: result.height };
                } catch (error) {
                    reasons.push(`${this.describeIconUrl(candidate)} ${error.message}`);
                }
            }
            return null;
        })();

        const services = [
            { name: 'Google', url: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128` },
            { name: 'DuckDuckGo', url: `https://icons.duckduckgo.com/ip3/${hostname}.ico` },
            { name: 'Yandex', url: `https://favicon.yandex.net/favicon/${hostname}` }
        ];
        const serviceTask = new Promise(resolve => {
            const results = [];
            let settled = false;
            let remaining = services.length;
            services.forEach(service => {
                this.validateIconUrl(service.url, 2500).then(result => {
                    if (settled) return;
                    settled = true;
                    resolve({
                        winner: { success: true, name: service.name, value: result.value, source: service.url, width: result.width, height: result.height },
                        results
                    });
                }).catch(error => {
                    results.push({ success: false, name: service.name, reason: error.message });
                    remaining -= 1;
                    if (remaining === 0 && !settled) {
                        settled = true;
                        resolve({ winner: null, results });
                    }
                });
            });
        });

        // 谁先出结果先走：本地命中立即返回；否则等服务结果，同时给慢速本地候选留机会
        let localResult = null;
        let serviceOutcome = null;
        const firstSettled = await Promise.race([
            localTask.then(result => ({ kind: 'local', result })),
            serviceTask.then(result => ({ kind: 'service', result }))
        ]);
        if (firstSettled.kind === 'local') {
            localResult = firstSettled.result;
            if (localResult && localResult.success) return localResult;
            serviceOutcome = await serviceTask;
        } else {
            serviceOutcome = firstSettled.result;
            localResult = await localTask;
            if (localResult && localResult.success) return localResult;
        }
        if (serviceOutcome.winner) return serviceOutcome.winner;
        serviceOutcome.results.forEach(item => reasons.push(`${item.name} 图标服务 ${item.reason}`));
        return { success: false, reason: reasons };
    }

    // 自动获取网站信息：名称（<title> → 域名）与图标各自独立成败
    async fetchWebsiteInfo(rawUrl) {
        const statusElement = document.getElementById('urlStatus');
        const form = document.getElementById('websiteForm');
        const parsed = this.normalizeSiteUrl(rawUrl);
        if (!parsed) {
            if (statusElement) {
                statusElement.innerHTML = '<span style="color: #ea4335;">网址格式不正确，无法自动获取信息</span>';
            }
            return;
        }
        // 同一地址在一次编辑过程中只自动抓取一次，避免失焦与防抖重复请求
        if (this.lastInfoUrl === parsed.href) return;
        this.lastInfoUrl = parsed.href;

        const seq = (this.siteInfoSeq = (this.siteInfoSeq || 0) + 1);
        const iconTouched = form.dataset.iconTouched === '1';

        if (statusElement) {
            statusElement.innerHTML = '<span style="color: #4285f4;">正在获取网站信息…</span>';
        }
        // 避免上一次的成功/失败提示残留，图标结果稍后单独刷新
        const iconStatusElement = document.getElementById('iconStatus');
        if (iconStatusElement && !iconTouched) {
            iconStatusElement.innerHTML = '<span style="color: #6b7280;">等待抓取图标…</span>';
        }

        let html = '';
        let htmlError = '';
        let pageUnreachable = false;
        try {
            html = await this.fetchSiteHtml(parsed.href);
        } catch (error) {
            htmlError = error.message;
            // 网络层失败/超时：同源图标候选大概率同样不可达，直接走图标服务
            pageUnreachable = error.message === '请求超时' || error.message.includes('拦截');
        }
        if (seq !== this.siteInfoSeq) return;

        // 名称：优先 <title>，取不到退回去掉 www. 的域名；用户手改过则保留
        const title = this.extractTitleFromHtml(html);
        const fallbackName = parsed.hostname.replace(/^www\./, '');
        const nameInput = document.getElementById('websiteName');
        // 写入前重新读取手改标记：抓取期间用户可能刚编辑过名称，不能被异步结果覆盖
        const nameTouched = form.dataset.nameTouched === '1';
        if (!nameTouched || !nameInput.value.trim()) {
            nameInput.value = title || fallbackName;
            form.dataset.nameAutoFilled = '1';
            if (statusElement) {
                if (title) {
                    statusElement.innerHTML = '<span style="color: #34a853;">已获取网站名称</span>';
                } else if (htmlError) {
                    statusElement.innerHTML = `<span style="color: #ea4335;">网页抓取失败（${htmlError}），已用域名作为名称</span>`;
                } else {
                    statusElement.innerHTML = '<span style="color: #ea4335;">页面没有标题，已用域名作为名称</span>';
                }
            }
        } else if (statusElement) {
            statusElement.innerHTML = '<span style="color: #6b7280;">名称已手动修改，保留现有名称</span>';
        }

        // 图标：与名称互相独立，失败不清空已有内容
        if (!iconTouched) {
            await this.fetchWebsiteIcon(parsed.href, { html, pageFailed: !!htmlError, pageUnreachable });
        }
    }

    // 处理图标上传
    handleIconUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const iconUrl = e.target.result;
            document.getElementById('websiteIcon').value = iconUrl;

            // 上传的图片已由浏览器解码过，标记为已校验
            const form = document.getElementById('websiteForm');
            form.dataset.iconValidatedValue = iconUrl;
            // 用户手动上传过图标：后续自动抓取不覆盖
            form.dataset.iconTouched = '1';
            delete form.dataset.iconAutoFilled;
            delete form.dataset.iconError;
            const iconStatus = document.getElementById('iconStatus');
            if (iconStatus) {
                iconStatus.innerHTML = '<span style="color: #34a853;">图标已上传</span>';
            }
            this.updateIconPreview(iconUrl);
            this.syncEditPreview();
        };
        reader.readAsDataURL(file);
    }

    // 自动抓取图标（URL 自动获取、自动抓取按钮、引擎面板共用）
    async fetchWebsiteIcon(url, options = {}) {
        const statusElement = document.getElementById('iconStatus');
        const parsed = this.normalizeSiteUrl(url);
        const form = document.getElementById('websiteForm');
        if (!parsed) {
            if (statusElement) {
                statusElement.innerHTML = '<span style="color: #ea4335;">网址格式不正确，无法抓取图标</span>';
            }
            return null;
        }

        // 每次抓取分配序号：新请求会顶掉旧请求的结果，避免旧结果覆盖新输入
        const seq = (this.iconFetchSeq = (this.iconFetchSeq || 0) + 1);
        if (statusElement) {
            statusElement.innerHTML = '<span style="color: #4285f4;">正在抓取图标…</span>';
        }

        let html = options.html || '';
        let pageError = '';
        if (!html && !options.pageFailed) {
            try {
                html = await this.fetchSiteHtml(parsed.href);
            } catch (error) {
                pageError = error.message;
            }
        }
        if (seq !== this.iconFetchSeq) return null;

        let result;
        try {
            result = await this.fetchBestIcon({
                pageUrl: parsed.href,
                origin: parsed.origin,
                hostname: parsed.hostname,
                html,
                pageUnreachable: !!options.pageUnreachable
            });
        } catch (error) {
            result = { success: false, reason: [error.message] };
        }
        if (seq !== this.iconFetchSeq) return null;
        // 抓取期间用户已手动改过图标（输入 / 上传）：丢弃自动结果，避免覆盖
        if (form.dataset.iconTouched === '1') return null;

        if (!result.success) {
            if (statusElement) {
                const reasonList = Array.isArray(result.reason) ? result.reason : [result.reason || '未找到可用图标'];
                const pageHint = pageError ? `网页抓取失败（${pageError}），` : '';
                statusElement.innerHTML = `<span style="color: #ea4335;">图标获取失败：${pageHint}${reasonList.join('；')}。可手动上传或填写图标地址</span>`;
            }
            return null;
        }

        // 校验通过的图标立即写入输入框（输入框显示可读地址，数据里存 DataURL）
        const displayValue = result.source || result.value;
        document.getElementById('websiteIcon').value = displayValue;
        form.dataset.iconValidatedValue = displayValue;
        form.dataset.iconResolvedValue = result.value;
        form.dataset.iconAutoFilled = '1';
        delete form.dataset.iconError;
        this.updateIconPreview(displayValue);
        this.syncEditPreview();

        const sizeText = (result.width && result.height) ? `（${result.width}×${result.height}）` : '';
        if (statusElement) {
            statusElement.innerHTML = `<span style="color: #34a853;">图标获取成功${sizeText}</span>`;
        }

        return result;
    }

    // 用 <img> 真实加载图片，能解码出有效尺寸才算成功
    loadIconImage(url, timeoutMs = 5000) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            let finished = false;
            const timer = setTimeout(() => {
                if (finished) return;
                finished = true;
                img.src = '';
                reject(new Error('加载超时'));
            }, timeoutMs);

            img.referrerPolicy = 'no-referrer';
            img.onload = () => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                const width = img.naturalWidth;
                const height = img.naturalHeight;
                if (!width || !height) {
                    reject(new Error('无法解码图片尺寸'));
                    return;
                }
                if (width < 16 || height < 16) {
                    reject(new Error(`尺寸过小（${width}×${height}）`));
                    return;
                }
                resolve({ width, height });
            };
            img.onerror = () => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                reject(new Error('图片解码失败'));
            };
            img.src = url;
        });
    }

    // 下载图标并转成 DataURL，避免后续跨域/防盗链/403 导致加载失败
    async fetchIconAsDataUrl(url, timeoutMs = 6000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                cache: 'no-store',
                credentials: 'omit'
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const contentType = (response.headers.get('content-type') || '').toLowerCase();
            if (!contentType.startsWith('image/')) {
                throw new Error(`返回内容不是图片（${contentType || '未知类型'}）`);
            }
            const blob = await response.blob();
            if (blob.size < 32) {
                throw new Error(`图片内容过小（${blob.size} 字节）`);
            }
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('读取图片数据失败'));
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('请求超时');
            }
            throw error;
        } finally {
            clearTimeout(timer);
        }
    }

    // 校验图标地址：优先转 DataURL，再真实解码校验尺寸
    async validateIconUrl(url, timeoutMs = 5000) {
        let value = url;
        let fetchError = null;
        try {
            value = await this.fetchIconAsDataUrl(url, timeoutMs);
        } catch (error) {
            // fetch 被 CORS/防盗链拦截时，退回用 <img> 直接加载校验
            fetchError = error;
        }
        try {
            const size = await this.loadIconImage(value, timeoutMs);
            return { value, source: url, width: size.width, height: size.height };
        } catch (error) {
            const detail = fetchError ? `${error.message}（${fetchError.message}）` : error.message;
            throw new Error(detail);
        }
    }
}

// 背景管理类
class BackgroundManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        
        // 通过合并后的设置读取壁纸源，旧版失效源会自动回退到新的默认源
        const mergedSettings = this.dataManager.getData('settings');
        const currentSourceId = (mergedSettings && mergedSettings.wallpaper && mergedSettings.wallpaper.source)
            ? mergedSettings.wallpaper.source
            : 'bingdaily';
        this.currentSourceId = currentSourceId;

        // 当前源是否为必应每日壁纸（无缓存时的默认壁纸、低清缓存升级都以它为目标）
        const currentSource = (mergedSettings && mergedSettings.wallpaper && Array.isArray(mergedSettings.wallpaper.sources))
            ? mergedSettings.wallpaper.sources.find(source => source.id === currentSourceId)
            : null;
        this.isBingDailySource = !!currentSource && currentSource.type === 'bing-daily';
        
        // 使用默认壁纸URL
        const defaultWallpaperUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
        
        // 核心逻辑：优先使用localStorage中保存的与当前壁纸源关联的壁纸
        let backgroundImage = '';
        let hasSavedWallpaper = false;
        // 必应每日壁纸的元数据（hsh / 日期等），用于“换一张”时避开当前图
        this.backgroundMeta = null;
        // 壁纸平均色：首帧/图片解码期间作为兜底底色，避免刷新时闪白或闪黑
        let backgroundColor = 'transparent';
        
        console.log('BackgroundManager构造函数 - 当前壁纸源:', this.currentSourceId);
        
        // 1. 首先尝试从新格式加载与当前壁纸源关联的壁纸
        try {
            const storedBackgrounds = localStorage.getItem('backgrounds');
            console.log('BackgroundManager构造函数 - storedBackgrounds:', storedBackgrounds);
            
            if (storedBackgrounds) {
                const parsedData = JSON.parse(storedBackgrounds);
                console.log('BackgroundManager构造函数 - 解析后的backgrounds数据:', parsedData);
                
                // 检查数据格式是否正确
                if (parsedData && typeof parsedData === 'object') {
                    // 优先使用与当前壁纸源关联的保存壁纸
                    const currentEntry = parsedData[this.currentSourceId];
                    if (currentEntry && currentEntry.image && currentEntry.image.trim() !== '') {
                        backgroundImage = currentEntry.image;
                        // 同时恢复该源的元数据（必应源换图时需要用它比对当前图）
                        this.backgroundMeta = currentEntry.meta || null;
                        backgroundColor = currentEntry.color || 'transparent';
                        console.log(`BackgroundManager - 使用已保存的${this.currentSourceId}壁纸，不再获取新壁纸:`, backgroundImage);
                        hasSavedWallpaper = true;
                    } else {
                        console.log(`BackgroundManager - 没有找到${this.currentSourceId}的保存壁纸`);
                    }
                }
            } else {
                console.log('BackgroundManager构造函数 - 没有找到backgrounds数据');
            }
        } catch (error) {
            console.error('解析backgrounds数据失败:', error);
        }
        
        // 2. 仅当从未存在按源缓存时，才把旧格式 background 迁移到当前源
        //    否则会把其它源留下的旧图当成本源壁纸，导致刷新后壁纸“跳变”
        if (!hasSavedWallpaper && !localStorage.getItem('backgrounds')) {
            try {
                const storedSingleBackground = localStorage.getItem('background');
                console.log('BackgroundManager构造函数 - storedSingleBackground:', storedSingleBackground);
                
                if (storedSingleBackground) {
                    const singleParsed = JSON.parse(storedSingleBackground);
                    if (singleParsed && singleParsed.image && singleParsed.image.trim() !== '') {
                        backgroundImage = singleParsed.image;
                        console.log('BackgroundManager - 使用旧格式保存的壁纸:', backgroundImage);
                        hasSavedWallpaper = true;
                    }
                } else {
                    console.log('BackgroundManager构造函数 - 没有找到background数据');
                }
            } catch (e) {
                console.error('解析旧格式壁纸失败:', e);
            }
        }
        
        // 3. 检查是否有保存的壁纸
        if (hasSavedWallpaper) {
            // 有保存的壁纸，直接使用
            console.log('BackgroundManager - 有保存的壁纸，直接使用:', backgroundImage);
            
            // 检查保存的壁纸是否是Data URL
            if (backgroundImage.startsWith('data:image/')) {
                // 已经是Data URL，直接使用
                this.background = { image: backgroundImage, color: backgroundColor };
                this.persistLegacyBackgroundIfNeeded();
                // 无论是否首次打开，都初始化背景
                this.init();
            } else {
                // 不是Data URL，直接使用，不重新请求网络
                console.log('BackgroundManager - 保存的不是Data URL，直接使用:', backgroundImage);
                this.background = { image: backgroundImage, color: backgroundColor };
                this.persistLegacyBackgroundIfNeeded();
                // 直接初始化背景，不调用setBackgroundImage避免重新请求网络
                this.init();
                // 不再在后台转换为Data URL，避免重新请求网络
            }

            // 低清缓存（旧版 Unsplash 1920 / 必应 1920x1080）静默升级一次到 UHD
            this.upgradeLowResWallpaper();
        } else if (this.isBingDailySource) {
            // 首次安装/无缓存：不落 Unsplash 1920 兜底图，直接异步取必应 UHD
            console.log('BackgroundManager - 无缓存，直接获取必应 UHD 壁纸');
            this.background = { image: '', color: 'transparent' };
            this.backgroundMeta = null;
            this.init();
            this.loadDefaultBingWallpaper();
        } else {
            // 没有保存的壁纸，使用默认壁纸并保存
            console.log('BackgroundManager - 没有保存的壁纸，使用默认壁纸:', defaultWallpaperUrl);
            this.background = { image: defaultWallpaperUrl, color: 'transparent' };
            // 当前源尚无缓存：把这张固定壁纸写入该源，之后刷新保持同一张
            this.backgroundMeta = null;
            this.saveBackgroundForCurrentSource();
            // 直接初始化背景
            this.init();
            // 不再在后台转换为Data URL，避免重新请求网络
        }
        
        console.log('BackgroundManager构造函数 - 最终使用的壁纸:', this.background.image);
    }

    // 旧版只保存了单一的 background：首次启动时把它固定写入当前源，避免刷新后壁纸跳变
    persistLegacyBackgroundIfNeeded() {
        if (localStorage.getItem('backgrounds')) return;
        this.backgroundMeta = null;
        this.saveBackgroundForCurrentSource();
    }

    init() {
        // 确保DOM加载完成后再操作
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupBackground();
            });
        } else {
            this.setupBackground();
        }
    }
    
    // 设置背景
    setupBackground() {
        const backgroundElement = document.getElementById('background');
        if (backgroundElement) {
            console.log('setupBackground - 开始设置背景，使用已保存的壁纸:', this.background.image);
            // 确保背景元素可见
            backgroundElement.style.display = 'block';
            
            // 直接应用已保存的背景，不再进行复杂的URL验证
            // 简化处理：只要有保存的壁纸URL，就直接使用
            if (this.background.image && this.background.image.trim() !== '') {
                // 直接应用背景，不再进行预加载检查
                // 避免因网络问题或跨域问题导致的壁纸更换
                console.log('setupBackground - 直接应用已保存的壁纸');
                this.applyBackground();
                this.updateWallpaperThumbnail();
            } else {
                // 没有保存的壁纸（首次安装的必应源）：先显示兜底底色，等异步 UHD 到位后再应用
                console.log('setupBackground - 没有保存的壁纸，使用兜底底色');
                this.applyBackground();
            }
        }
    }
    
    // 首次安装/无缓存：直接取必应 UHD 作为默认壁纸
    // 失败时不写入任何低清兜底图，保留首帧底色，下次打开再试
    async loadDefaultBingWallpaper() {
        const settings = this.dataManager.getData('settings');
        const sources = (settings && settings.wallpaper && Array.isArray(settings.wallpaper.sources))
            ? settings.wallpaper.sources
            : [];
        const source = sources.find(item => item.type === 'bing-daily');
        if (!source) return;
        try {
            const resolved = await this.resolveSourceImageUrl(source, 12000, { rotate: false });
            if (!resolved || !resolved.url) return;
            await this.loadImageUrl(resolved.url, 12000);
            this.backgroundMeta = resolved.meta || null;
            this.background.image = resolved.url;
            this.saveBackgroundForCurrentSource();
            this.updateWallpaperThumbnail();
            this.applyBackground();
        } catch (error) {
            console.warn('默认必应 UHD 获取失败，暂不缓存低清图:', error.message);
        }
    }

    // 启动时把低清缓存静默升级一次到 UHD：
    // 命中条件 = 旧版 Unsplash w=1920 兜底图，或必应 1920x1080 地址
    // 升级失败时保留现有壁纸与缓存，绝不覆盖
    async upgradeLowResWallpaper() {
        if (this._wallpaperUpgradeTried) return;
        this._wallpaperUpgradeTried = true;
        if (!this.isBingDailySource) return;

        const image = (this.background && this.background.image) || '';
        if (!image || image.startsWith('data:')) return;

        const meta = this.backgroundMeta || {};
        let uhdUrl = '';
        let candidateMeta = null;
        if (meta.provider === 'bing' && meta.bingUhdUrl) {
            uhdUrl = meta.bingUhdUrl;
            candidateMeta = meta;
        } else if (/^https?:\/\/([^/]*\.)?bing\.com\//i.test(image) && /_1920x1080\.jpg/i.test(image)) {
            uhdUrl = image.replace(/_1920x1080\.jpg/gi, '_UHD.jpg');
            candidateMeta = meta.provider === 'bing' ? meta : null;
        } else if (/images\.unsplash\.com/i.test(image) && /([?&])w=1920(&|$)/i.test(image)) {
            // 旧版默认兜底图：换成必应当日 UHD
            try {
                const settings = this.dataManager.getData('settings');
                const sources = (settings && settings.wallpaper && Array.isArray(settings.wallpaper.sources))
                    ? settings.wallpaper.sources
                    : [];
                const source = sources.find(item => item.type === 'bing-daily');
                if (!source) return;
                const resolved = await this.resolveSourceImageUrl(source, 12000, { rotate: false });
                if (!resolved || !resolved.url) return;
                uhdUrl = resolved.url;
                candidateMeta = resolved.meta || null;
            } catch (error) {
                console.warn('低清壁纸升级失败，保留现有壁纸:', error.message);
                return;
            }
        }

        if (!uhdUrl || uhdUrl === image) return;

        try {
            const loaded = await this.loadImageUrl(uhdUrl, 12000);
            // 候选图必须确实达到 UHD 级别，否则视为升级失败
            if (!loaded || loaded.width < 3000) {
                console.warn('升级候选图分辨率不足，保留现有壁纸');
                return;
            }
            this.backgroundMeta = candidateMeta || this.backgroundMeta || null;
            this.background.image = uhdUrl;
            this.saveBackgroundForCurrentSource();
            this.updateWallpaperThumbnail();
            this.applyBackground();
            console.log('低清壁纸已静默升级为 UHD:', uhdUrl);
        } catch (error) {
            console.warn('低清壁纸升级失败，保留现有壁纸:', error.message);
        }
    }

    // 应用背景
    applyBackground() {
        const backgroundElement = document.getElementById('background');
        if (backgroundElement) {
            console.log('applyBackground - using stored background:', this.background.image);
            if (this.background.image && this.background.image.trim() !== '') {
                // 壁纸平均色作为兜底底色：图片解码/下载完成前不会出现白底或纯黑
                const coverColor = (typeof this.background.color === 'string' && this.background.color !== 'transparent')
                    ? this.background.color
                    : '';
                // 使用引号包裹，避免 URL 中的括号/空格导致解析失败
                backgroundElement.style.backgroundImage = `url("${this.background.image}")`;
                backgroundElement.style.backgroundColor = coverColor || '#0b0e14';
                // #background 是负 z-index，会落在 body 背景之下：body 必须透明，兜底色放在 html 画布上
                document.documentElement.style.backgroundColor = coverColor || '#0b0e14';
                document.body.style.backgroundColor = 'transparent';
                backgroundElement.style.display = 'block';
                backgroundElement.classList.remove('bg-empty');
                // 主脚本已接管背景，释放 early-bg.js 的首帧兜底规则（避免 !important 压过后续换图）
                backgroundElement.classList.add('bg-ready');
                this.releaseEarlyBackground();
                // 采样并保存平均色，供下次刷新首帧使用
                this.updateCoverColor();
            } else {
                // 用户主动移除背景后，使用柔和的深色渐变兜底
                console.log('applyBackground - no stored background, showing default gradient');
                backgroundElement.style.backgroundImage = 'linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #0f172a 100%)';
                backgroundElement.style.backgroundColor = '#0f172a';
                document.documentElement.style.backgroundColor = '#0f172a';
                document.body.style.backgroundColor = 'transparent';
                backgroundElement.style.display = 'block';
                backgroundElement.classList.add('bg-empty');
                // 移除壁纸后也由主脚本接管，确保深色渐变不被首帧规则覆盖
                backgroundElement.classList.add('bg-ready');
                this.releaseEarlyBackground();
            }
        }
    }
    
    // 主脚本接管背景后，移除 early-bg.js 的首帧 !important 规则
    releaseEarlyBackground() {
        const earlyStyle = document.getElementById('early-bg-style');
        if (earlyStyle) earlyStyle.remove();
    }
    
    // 采样壁纸平均色并保存：用于首帧/解码期间的兜底底色，避免刷新时闪白或闪黑
    updateCoverColor() {
        const image = this.background.image;
        if (!image || (!image.startsWith('data:') && !image.startsWith('http'))) return;
        if (this._coverColorImage === image) return;
        this._coverColorImage = image;
        const img = new Image();
        // 只有服务端允许跨域（必应图片带 ACAO:*）时才能取色；失败则静默跳过
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            if (this.background.image !== image) return;
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                canvas.getContext('2d').drawImage(img, 0, 0, 1, 1);
                const data = canvas.getContext('2d').getImageData(0, 0, 1, 1).data;
                const color = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
                this.background.color = color;
                const el = document.getElementById('background');
                if (el) el.style.backgroundColor = color;
                // html 画布同步兜底色：body 透明时它是壁纸解码期间的可见底色
                document.documentElement.style.backgroundColor = color;
                this.saveBackgroundForCurrentSource();
            } catch (e) {
                // 取色失败时保持默认底色，不影响壁纸显示
            }
        };
        img.src = image;
    }

    // 设置背景图
    async setBackgroundImage(imageUrl, initAfterSave = false) {
        // 手动上传 / 默认兜底图不再属于任何壁纸源的动态壁纸，清空元数据
        this.backgroundMeta = null;
        // 获取小猫按钮元素
        const catBtn = document.getElementById('catWallpaperBtn');
        
        // 移除小猫按钮的loading类
        if (catBtn) {
            catBtn.classList.remove('loading');
        }
        
        // 如果不需要重新初始化背景，就不立即显示图片，避免覆盖当前壁纸
        if (initAfterSave) {
            // 1. 首先立即显示图片，提升用户体验
            const backgroundElement = document.getElementById('background');
            if (backgroundElement) {
                backgroundElement.style.backgroundImage = `url(${imageUrl})`;
                backgroundElement.style.backgroundColor = 'transparent';
                document.body.style.backgroundColor = 'transparent';
                backgroundElement.style.display = 'block';
                backgroundElement.classList.add('bg-ready');
            }
        }
        
        try {
            // 本地文件/已转换的 Data URL 无需再次请求网络，直接保存并应用
            if (imageUrl.startsWith('data:')) {
                this.background.image = imageUrl;
                this.saveBackgroundForCurrentSource();
                this.updateWallpaperThumbnail();
                this.applyBackground();
                return;
            }
            
            // 2. 使用Fetch API获取图片并转换为Data URL，避免CORS问题
            console.log('开始获取图片并转换为Data URL:', imageUrl);
            
            const dataUrl = await this.fetchImageAsDataUrl(imageUrl, 12000);
            
            console.log('Data URL转换成功，长度:', dataUrl.length);
            
            // 保存Data URL到localStorage，与当前壁纸源关联
            this.background.image = dataUrl;
            this.saveBackgroundForCurrentSource();
            this.updateWallpaperThumbnail();
            console.log('Data URL保存完成');
            
            // 如果需要在保存后初始化背景
            if (initAfterSave) {
                this.init();
            }
        } catch (error) {
            console.error('获取图片或转换为Data URL失败:', error);
            
            // 转换失败时仍保留原始图片地址，避免壁纸加载失败后回落到默认图
            if (imageUrl && !imageUrl.startsWith('data:')) {
                this.background.image = imageUrl;
                this.saveBackgroundForCurrentSource();
                this.updateWallpaperThumbnail();
                this.applyBackground();
                if (initAfterSave) {
                    this.init();
                }
            } else {
                this.useDefaultWallpaper(initAfterSave);
            }
        }
        
        return;
    }
    
    // 移除背景图
    removeBackgroundImage() {
        this.background.image = '';
        this.backgroundMeta = null;
        // 同步删除当前壁纸源对应的记录，避免刷新后又恢复
        try {
            const storedBackgrounds = JSON.parse(localStorage.getItem('backgrounds') || '{}');
            if (storedBackgrounds && typeof storedBackgrounds === 'object') {
                delete storedBackgrounds[this.currentSourceId];
                localStorage.setItem('backgrounds', JSON.stringify(storedBackgrounds));
            }
        } catch (e) {
            console.error('移除当前壁纸源记录失败:', e);
        }
        localStorage.setItem('background', JSON.stringify(this.background));
        console.log('removeBackgroundImage - saved background:', this.background);
        this.applyBackground();
        this.updateWallpaperThumbnail();
    }
    
    // 更新壁纸缩略图
    updateWallpaperThumbnail() {
        const thumbnail = document.getElementById('currentWallpaperThumbnail');
        if (!thumbnail) return;
        
        // 直接使用内存中的当前壁纸，避免旧格式数据导致的缩略图不同步
        if (this.background.image) {
            thumbnail.src = this.background.image;
            thumbnail.style.display = 'block';
        } else {
            thumbnail.removeAttribute('src');
            thumbnail.style.display = 'none';
        }
    }

    // 处理文件上传
    handleFileUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // 上传后立即生效，无需刷新页面
            this.setBackgroundImage(e.target.result, true);
        };
        reader.readAsDataURL(file);
    }

    // 将壁纸与当前壁纸源关联保存到localStorage
    saveBackgroundForCurrentSource() {
        console.log('saveBackgroundForCurrentSource - 开始保存', this.currentSourceId, '壁纸');
        console.log('saveBackgroundForCurrentSource - 当前壁纸数据:', this.background);
        
        try {
            // 获取当前所有保存的壁纸
            let storedBackgrounds = {};
            const existingBackgrounds = localStorage.getItem('backgrounds');
            if (existingBackgrounds) {
                try {
                    storedBackgrounds = JSON.parse(existingBackgrounds);
                    console.log('saveBackgroundForCurrentSource - 现有壁纸数据:', storedBackgrounds);
                } catch (e) {
                    console.error('saveBackgroundForCurrentSource - 解析现有壁纸数据失败:', e);
                    storedBackgrounds = {};
                }
            }
            
            // 保存当前壁纸与当前壁纸源关联（meta 用于必应源判断“当前是哪一张”）
            const entry = {
                image: this.background.image,
                color: this.background.color
            };
            if (this.backgroundMeta) {
                entry.meta = this.backgroundMeta;
            }
            storedBackgrounds[this.currentSourceId] = entry;
            
            console.log('saveBackgroundForCurrentSource - 更新后的壁纸数据:', storedBackgrounds);
            
            // 保存到localStorage
            localStorage.setItem('backgrounds', JSON.stringify(storedBackgrounds));
            console.log(`saveBackgroundForCurrentSource - 已保存${this.currentSourceId}壁纸到localStorage`);
            
            // 验证保存是否成功
            const savedData = localStorage.getItem('backgrounds');
            console.log('saveBackgroundForCurrentSource - 验证保存的数据:', savedData);
            
            // 同时更新旧格式的background，确保兼容性
            localStorage.setItem('background', JSON.stringify(this.background));
            console.log('saveBackgroundForCurrentSource - 已保存background到localStorage');
        } catch (error) {
            console.error('保存壁纸失败:', error);
        }
    }

    // 带超时与类型校验的图片获取：失败会抛错，由调用方在同一源内重试
    async fetchImageAsDataUrl(url, timeoutMs = 10000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, {
                mode: 'cors',
                cache: 'no-store',
                credentials: 'omit',
                referrerPolicy: 'no-referrer',
                signal: controller.signal
            });
            if (!response.ok) {
                throw new Error('图片加载失败: HTTP ' + response.status);
            }
            const contentType = response.headers.get('content-type') || '';
            const blob = await response.blob();
            if (!blob || blob.size < 1024) {
                throw new Error('图片内容异常');
            }
            // 有些壁纸接口用 application/octet-stream 等类型返回图片：
            // 若在此处误判为失败，就会退回保存原始 URL，而该 URL 每次刷新都会随机，
            // 于是表现为“刷新页面壁纸就变了”。这里按真实解码结果判断。
            if (!contentType.startsWith('image/')) {
                const isImage = await this.validateImageBlob(blob);
                if (!isImage) {
                    throw new Error('返回内容不是图片: ' + (contentType || '未知类型'));
                }
            }
            return await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('图片转换失败'));
                reader.readAsDataURL(blob);
            });
        } finally {
            clearTimeout(timer);
        }
    }

    // 用 blob URL 实际解码，判断非 image/* 类型返回的内容是不是图片
    validateImageBlob(blob, timeoutMs = 8000) {
        return new Promise((resolve) => {
            const objectUrl = URL.createObjectURL(blob);
            const img = new Image();
            let settled = false;
            let timer = null;
            const finish = (ok) => {
                if (settled) return;
                settled = true;
                if (timer) clearTimeout(timer);
                URL.revokeObjectURL(objectUrl);
                resolve(ok);
            };
            timer = setTimeout(() => finish(false), timeoutMs);
            img.onload = () => finish(img.naturalWidth >= 50 && img.naturalHeight >= 50);
            img.onerror = () => finish(false);
            img.src = objectUrl;
        });
    }

    // 通过 <img> 加载壁纸：图片标签不受 CORS 限制，可绕开跨域/防盗链导致的 Failed to fetch
    loadImageUrl(url, timeoutMs = 10000) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            let settled = false;
            const timer = setTimeout(() => {
                if (settled) return;
                settled = true;
                img.src = '';
                reject(new Error('图片加载超时'));
            }, timeoutMs);

            img.onload = () => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                if (img.naturalWidth < 50 || img.naturalHeight < 50) {
                    reject(new Error('图片尺寸异常'));
                    return;
                }
                resolve({ url, width: img.naturalWidth, height: img.naturalHeight });
            };

            img.onerror = () => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                reject(new Error('图片加载失败'));
            };

            img.referrerPolicy = 'no-referrer';
            img.src = url;
        });
    }

    // 尽量把已经能用 <img> 加载的图片冻结成 Data URL
    // 否则只能保存原始 URL，而随机源每次请求该 URL 都可能返回新图 → 刷新就换壁纸
    async freezeLoadedImage(url, timeoutMs = 10000) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            let settled = false;
            let timer = null;
            const finish = (value) => {
                if (settled) return;
                settled = true;
                if (timer) clearTimeout(timer);
                resolve(value);
            };
            timer = setTimeout(() => finish(null), timeoutMs);
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    finish(canvas.toDataURL('image/jpeg', 0.92));
                } catch (e) {
                    // 跨域受限时 canvas 会被污染，只能回退为原始 URL
                    finish(null);
                }
            };
            img.onerror = () => finish(null);
            img.src = url;
        });
    }

    // 解析壁纸源的实际图片地址（必应每日壁纸需要先读取 JSON）
    // 返回 { url, meta }；必应源在 options.rotate=true 时换到一张与当前不同的历史图
    async resolveSourceImageUrl(source, timeoutMs = 10000, options = {}) {
        if (source.type === 'bing-daily') {
            const rotate = options.rotate === true;
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                // 一次性取回今日及最近几天的图片：只取 idx=0&n=1 时同一天永远只有同一张，
                // 这就是“点小猫没反应”的根因。n=8 是必应接口允许的最大数量。
                let archiveUrl = source.url;
                try {
                    const parsed = new URL(source.url);
                    parsed.searchParams.set('format', 'js');
                    parsed.searchParams.set('idx', '0');
                    parsed.searchParams.set('n', '8');
                    archiveUrl = parsed.toString();
                } catch (e) {
                    archiveUrl = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN';
                }

                const response = await fetch(archiveUrl, {
                    cache: 'no-store',
                    referrerPolicy: 'no-referrer',
                    signal: controller.signal
                });
                if (!response.ok) {
                    throw new Error('壁纸信息获取失败: HTTP ' + response.status);
                }
                const data = await response.json();
                const images = (data && Array.isArray(data.images)) ? data.images : [];
                const candidates = images
                    .map((item, index) => {
                        if (!item || !item.url) return null;
                        const url = item.url.startsWith('http') ? item.url : 'https://www.bing.com' + item.url;
                        // urlbase 形如 /th?id=OHR.xxx，拼 _UHD.jpg 可拿到 3840x2160 原图
                        // （实测 8 天历史图全部提供 UHD；接口本身只回溯 8 天，见 n/idx 上限）
                        let uhdUrl = '';
                        if (item.urlbase) {
                            const base = item.urlbase.startsWith('http')
                                ? item.urlbase
                                : 'https://www.bing.com' + item.urlbase;
                            uhdUrl = base + '_UHD.jpg';
                        } else {
                            uhdUrl = url.replace(/_\d{3,4}x\d{3,4}\.jpg/i, '_UHD.jpg');
                        }
                        return { url, uhdUrl, hsh: item.hsh || '', date: item.enddate || '', index };
                    })
                    .filter(Boolean);

                if (candidates.length === 0) {
                    throw new Error('壁纸信息解析失败');
                }

                // 已保存的必应元数据，用于判断“当前显示的是哪一张”
                const currentMeta = (this.backgroundMeta && this.backgroundMeta.provider === 'bing')
                    ? this.backgroundMeta
                    : null;
                const sameAsCurrent = (candidate) => {
                    if (!currentMeta) return false;
                    if (currentMeta.bingHsh && candidate.hsh) return currentMeta.bingHsh === candidate.hsh;
                    if (currentMeta.bingUrl) return currentMeta.bingUrl === candidate.url;
                    return false;
                };

                let chosen = candidates[0];
                if (rotate) {
                    let others = candidates.filter(candidate => !sameAsCurrent(candidate));
                    if (!currentMeta) {
                        // 旧缓存（已取过必应图但没存元数据）无法比对，至少排除今日这张，
                        // 保证“换一张”能换掉当前图；若当前是默认壁纸则保留今日这张可选
                        const currentIsFetchedImage = this.background
                            && typeof this.background.image === 'string'
                            && this.background.image.startsWith('data:image/');
                        if (currentIsFetchedImage) {
                            others = others.filter(candidate => candidate.index !== 0);
                        }
                    }
                    if (others.length === 0) {
                        // 当天接口只返回当前这一张，确实无图可换：交给上层提示，而不是重复应用同一张
                        return { unchanged: true };
                    }
                    chosen = others[Math.floor(Math.random() * others.length)];
                }

                return {
                    url: chosen.uhdUrl,
                    meta: {
                        provider: 'bing',
                        bingHsh: chosen.hsh,
                        bingUrl: chosen.url,
                        bingUhdUrl: chosen.uhdUrl,
                        bingDate: chosen.date,
                        bingIdx: chosen.index
                    }
                };
            } finally {
                clearTimeout(timer);
            }
        }

        let url = source.url;
        if (source.type === 'random') {
            const separator = url.includes('?') ? '&' : '?';
            url = `${url}${separator}t=${Date.now()}`;
        }
        return { url };
    }

    // 在设置面板壁纸源下方显示低调的状态提示
    showWallpaperStatus(message, type = 'error') {
        const el = document.getElementById('wallpaperSourceStatus');
        if (!el) return;
        el.textContent = message;
        el.classList.remove('is-error', 'is-success');
        if (type) el.classList.add('is-' + type);
        el.style.display = message ? 'block' : 'none';
    }

    clearWallpaperStatus() {
        const el = document.getElementById('wallpaperSourceStatus');
        if (!el) return;
        el.textContent = '';
        el.classList.remove('is-error', 'is-success');
        el.style.display = 'none';
    }

    // 获取随机壁纸 - 只在用户当前选中的壁纸源内重试，绝不自动切换到其他源
    // options.rotate=true 表示用户主动换图（必应源会换成另一张历史图，而不是重复今日这张）
    async getRandomWallpaper(options = {}) {
        const rotate = options.rotate === true;
        const catBtn = document.getElementById('catWallpaperBtn');
        
        if (catBtn) {
            catBtn.classList.add('loading');
            // 禁用按钮，防止重复点击
            catBtn.disabled = true;
        }
        
        try {
            const settings = this.dataManager.getData('settings');
            const sources = (settings && settings.wallpaper && Array.isArray(settings.wallpaper.sources))
                ? settings.wallpaper.sources
                : [];
            
            if (sources.length === 0) {
                console.warn('未找到可用的壁纸源，保留当前壁纸');
                this.showWallpaperStatus('当前壁纸源不可用，已保留原壁纸', 'error');
                return;
            }
            
            // 只取当前源，失败也不切换到其他源
            const source = sources.find(item => item.id === this.currentSourceId);
            if (!source) {
                console.warn(`未找到当前壁纸源「${this.currentSourceId}」，保留当前壁纸`);
                this.showWallpaperStatus('当前壁纸源不可用，已保留原壁纸', 'error');
                return;
            }
            
            const timeouts = [10000, 12000, 12000];
            let applied = false;
            let unchanged = false;
            let lastError = null;
            
            for (let attempt = 0; attempt < timeouts.length && !applied; attempt++) {
                try {
                    const resolved = await this.resolveSourceImageUrl(source, timeouts[attempt], { rotate });
                    if (resolved && resolved.unchanged) {
                        // 当前源当天没有别的图可换：保留当前壁纸，并给用户明确提示
                        unchanged = true;
                        break;
                    }
                    const imageUrl = resolved.url;
                    let imageValue;
                    if (resolved.meta && resolved.meta.provider === 'bing') {
                        // 必应图片 URL 本身固定（含 hsh），直接存 URL 即可保持刷新不变，
                        // 避免把 3.6MB 的 UHD 图转成 data URL 占用大量存储
                        try {
                            await this.loadImageUrl(imageUrl, timeouts[attempt]);
                            imageValue = imageUrl;
                        } catch (uhdError) {
                            console.warn('必应 UHD 图加载失败，回退 1920x1080:', uhdError.message);
                            await this.loadImageUrl(resolved.meta.bingUrl, timeouts[attempt]);
                            imageValue = resolved.meta.bingUrl;
                        }
                    } else {
                        try {
                            imageValue = await this.fetchImageAsDataUrl(imageUrl, timeouts[attempt]);
                        } catch (fetchError) {
                            // fetch 被 CORS / 权限 / 防盗链拦截时，退回 <img> 加载（不受 CORS 限制）
                            console.warn(`壁纸源「${source.name}」fetch 失败，改用 img 加载:`, fetchError.message);
                            const loaded = await this.loadImageUrl(imageUrl, timeouts[attempt]);
                            // 再尝试冻结：成功后刷新看到的就是同一张图，而不是重新随机
                            imageValue = await this.freezeLoadedImage(imageUrl, timeouts[attempt]) || loaded.url;
                        }
                    }
                    
                    this.backgroundMeta = resolved.meta || null;
                    this.background.image = imageValue;
                    this.saveBackgroundForCurrentSource();
                    this.updateWallpaperThumbnail();
                    this.applyBackground();
                    applied = true;
                    this.clearWallpaperStatus();
                    
                    console.log(`壁纸已更新：${source.name}`);
                } catch (error) {
                    lastError = error;
                    console.warn(`壁纸源「${source.name}」第 ${attempt + 1} 次加载失败:`, error.message);
                    if (attempt < timeouts.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 800));
                    }
                }
            }
            
            if (unchanged) {
                console.warn(`壁纸源「${source.name}」当天没有更多可切换的壁纸，保留当前壁纸`);
                this.showWallpaperStatus(`「${source.name}」今日已固定，明日自动更新（已保留当前壁纸）`, 'success');
            } else if (!applied) {
                const reason = lastError && lastError.message ? lastError.message : '未知原因';
                console.warn(`壁纸源「${source.name}」加载失败，保留当前壁纸`);
                this.showWallpaperStatus(`当前源「${source.name}」暂时不可用，已保留原壁纸（${reason}）`, 'error');
            } else if (catBtn) {
                catBtn.classList.add('success');
                setTimeout(() => catBtn.classList.remove('success'), 2000);
            }
        } catch (error) {
            console.error('获取随机壁纸失败:', error);
            this.showWallpaperStatus('当前壁纸源暂时不可用，已保留原壁纸', 'error');
        } finally {
            if (catBtn) {
                catBtn.classList.remove('loading');
                // 重新启用按钮
                catBtn.disabled = false;
            }
        }
    }
    
    // 使用默认壁纸
    useDefaultWallpaper() {
        // 首先尝试使用本地默认壁纸
        const localDefaultWallpaper = './wallpapers/default.png';
        
        // 检查本地默认壁纸是否存在
        const img = new Image();
        img.onload = () => {
            // 如果本地默认壁纸存在，使用它
            console.log('使用本地默认壁纸:', localDefaultWallpaper);
            this.setBackgroundImage(localDefaultWallpaper, true);
        };
        img.onerror = () => {
            // 如果本地默认壁纸不存在，使用固定的在线默认壁纸，避免每次都获取新的
            const defaultUrl = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
            console.log('使用在线默认壁纸:', defaultUrl);
            this.setBackgroundImage(defaultUrl, true);
        };
        
        // 尝试加载本地默认壁纸
        img.src = localDefaultWallpaper;
    }
}

// 搜索引擎管理类
class SearchEngineManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.engines = this.dataManager.getData('searchEngines');
        // 优先恢复上次使用的搜索引擎，找不到则回退到必应
        const savedEngine = this.dataManager.getData('currentSearchEngine');
        const matchedEngine = (savedEngine && !Array.isArray(savedEngine) && savedEngine.url)
            ? this.engines.find(engine => engine.url === savedEngine.url)
            : null;
        this.currentEngine = matchedEngine
            || this.engines.find(engine => engine.name === '必应')
            || this.engines[0];
        // 搜索引擎图标映射（使用本地图标）
        this.builtinEngineIcons = {
            '谷歌': './icons/search-engines/Google.png',
            '百度': './icons/search-engines/baidu.png',
            '必应': './icons/search-engines/bing.png',
            'Yandex': './icons/search-engines/Yandex.png',
            '搜狗': './icons/search-engines/sougou.png',
            '360搜索': './icons/search-engines/360.png'
        };
        this.init();
    }

    init() {
        this.setupSearch();
        this.setupEngineIconEvents();
        this.setupEngineIconClick();
        this.setupClickOutsideHandler();
    }
    
    // 设置点击外部区域关闭下拉列表的处理程序（只注册一次）
    setupClickOutsideHandler() {
        if (this.__dropdownOutsideBound) return;
        this.__dropdownOutsideBound = true;

        document.addEventListener('click', (event) => {
            const dropdown = document.getElementById('engineDropdown');
            const engineSelector = document.querySelector('.search-engine-selector');

            if (!dropdown || !engineSelector) return;
            if (!dropdown.classList.contains('show')) return;

            const isClickInside = engineSelector.contains(event.target) || dropdown.contains(event.target);
            if (!isClickInside) {
                closeEngineDropdown();
            }
        });
    }



    // 设置引擎图标点击事件
    setupEngineIconClick() {
        console.log('SearchEngineManager: 设置引擎图标点击事件');
        
        // 直接获取元素
        const dropdown = document.getElementById('engineDropdown');
        
        if (!dropdown) {
            console.error('SearchEngineManager: 下拉列表未找到');
            return;
        }
        
        // 只在初始化时设置一次状态，后续不再重置
        // 避免影响用户的正常操作
        if (!this.__initialized) {
            // 确保下拉列表初始状态为隐藏
            dropdown.classList.remove('show');
            this.__initialized = true;
        }
        
        console.log('SearchEngineManager: 引擎图标点击事件设置完成，使用HTML onclick属性处理点击事件');
    }

    // 设置搜索功能
    setupSearch() {
        console.log('SearchEngineManager: 设置搜索功能');
        
        // 渲染搜索引擎列表
        this.renderEngines();
        
        // 搜索按钮事件监听
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        
        if (searchBtn && searchInput) {
            // 点击搜索按钮
            searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
            
            // 回车键搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
    }
    
    // 渲染搜索引擎列表
    renderEngines() {
        const dropdown = document.getElementById('engineDropdown');
        const currentIcon = document.getElementById('currentEngineIcon');
        
        if (!dropdown || !currentIcon) {
            console.error('SearchEngineManager: 渲染引擎列表失败，元素未找到');
            return;
        }
        
        // 清空现有选项
        dropdown.innerHTML = '';
        
        // 添加每个搜索引擎选项
        this.engines.forEach(engine => {
            const option = document.createElement('div');
            option.className = 'engine-option';
            option.dataset.engineId = engine.id;
            
            // 获取引擎图标，缺失时回退到应用图标，避免出现破图
            let iconUrl = engine.icon;
            if (!iconUrl && this.builtinEngineIcons[engine.name]) {
                iconUrl = this.builtinEngineIcons[engine.name];
            }
            if (!iconUrl) {
                iconUrl = './icons/icon_32.png';
            }
            
            option.innerHTML = `
                <img src="${iconUrl}" alt="${engine.name}图标" class="engine-icon-small">
                <span class="engine-option-name">${engine.name}</span>
            `;
            
            // 图标加载失败时回退，避免显示裂图
            const iconImg = option.querySelector('img');
            iconImg.addEventListener('error', () => {
                iconImg.src = './icons/icon_32.png';
            }, { once: true });
            
            // 列表项右侧的管理按钮：编辑 / 删除
            const actions = document.createElement('div');
            actions.className = 'engine-option-actions';
            
            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'engine-action-btn';
            editBtn.title = '编辑搜索引擎';
            editBtn.setAttribute('aria-label', `编辑 ${engine.name}`);
            editBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
            `;
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showAddEngineModal(engine);
            });
            actions.appendChild(editBtn);
            
            // 至少保留一个引擎，最后一个不显示删除入口
            if (this.engines.length > 1) {
                const deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'engine-action-btn engine-action-delete';
                deleteBtn.title = '删除搜索引擎';
                deleteBtn.setAttribute('aria-label', `删除 ${engine.name}`);
                deleteBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                `;
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteEngine(engine.id);
                });
                actions.appendChild(deleteBtn);
            }
            
            option.appendChild(actions);
            
            // 点击事件
            option.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                this.switchEngine(engine);
            });
            
            dropdown.appendChild(option);
        });
        
        // 添加"添加搜索引擎"选项
        const addOption = document.createElement('div');
        addOption.className = 'engine-option add-engine-option';
        addOption.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4285f4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 10px;">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>添加搜索引擎</span>
        `;
        
        // 点击事件
        addOption.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            // 关闭下拉列表
            closeEngineDropdown();
            // 显示添加引擎弹窗
            this.showAddEngineModal();
        });
        
        dropdown.appendChild(addOption);
        
        // 更新当前引擎图标
        let currentIconUrl = this.currentEngine.icon;
        if (!currentIconUrl && this.builtinEngineIcons[this.currentEngine.name]) {
            currentIconUrl = this.builtinEngineIcons[this.currentEngine.name];
        }
        if (!currentIconUrl) {
            currentIconUrl = './icons/icon_32.png';
        }
        currentIcon.src = currentIconUrl;
        currentIcon.addEventListener('error', () => {
            currentIcon.src = './icons/icon_32.png';
        }, { once: true });
        
        // 渲染引擎列表后保持收起状态
        closeEngineDropdown();
    }
    
    // 切换搜索引擎
    switchEngine(engine) {
        this.currentEngine = engine;
        // 记住用户选择，刷新后仍然生效
        this.dataManager.saveData('currentSearchEngine', engine);
        
        this.renderEngines();
        closeEngineDropdown();
    }
    
    // 执行搜索
    performSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim() !== '') {
            const query = searchInput.value.trim();
            const searchUrl = this.currentEngine.url.replace('{}', encodeURIComponent(query));
            // 根据设置项决定是否在新标签页打开
            const settings = this.dataManager.getData('settings');
            const target = settings.openSearchInNewTab ? '_blank' : '_self';
            window.open(searchUrl, target);
            searchInput.value = ''; // 清空输入框
        }
    }
    
    // 显示添加/编辑引擎弹窗
    showAddEngineModal(engine = null) {
        // 关闭搜索引擎下拉列表
        closeEngineDropdown();
        
        // 显示添加搜索引擎模态框
        const modal = document.getElementById('addEngineModal');
        if (!modal) return;
        modal.style.display = 'flex';
        modal.classList.add('show');
        
        const form = document.getElementById('engineForm');
        const title = modal.querySelector('h2');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // 清空表单
        form.reset();
        // 清空预览
        document.getElementById('engineIconPreview').innerHTML = '';
        // 重置自动获取的去重与手改标记
        delete form.dataset.nameTouched;
        delete form.dataset.iconTouched;
        this.lastEngineInfoUrl = '';
        document.getElementById('engineUrlStatus').textContent = '';
        
        if (engine) {
            // 编辑模式：回填现有数据
            form.dataset.editId = String(engine.id);
            document.getElementById('engineName').value = engine.name;
            document.getElementById('engineUrl').value = engine.url;
            document.getElementById('engineIcon').value = engine.icon || '';
            const previewUrl = engine.icon || this.builtinEngineIcons[engine.name] || '';
            this.updateEngineIconPreview(previewUrl);
            // 打开编辑时不因首次失焦重复抓取
            const websiteManager = window.app && window.app.websiteManager;
            const normalizedUrl = websiteManager ? websiteManager.normalizeSiteUrl(engine.url.replace(/\{\}/g, '')) : null;
            this.lastEngineInfoUrl = normalizedUrl ? normalizedUrl.href : '';
            if (title) title.textContent = '编辑搜索引擎';
            if (submitBtn) submitBtn.textContent = '保存';
        } else {
            // 添加模式
            delete form.dataset.editId;
            if (title) title.textContent = '添加搜索引擎';
            if (submitBtn) submitBtn.textContent = '添加';
        }
        
        // 添加点击空白处关闭功能
        this.setupModalClickOutsideHandler();
    }
    
    // 点击遮罩空白处关闭"添加搜索引擎"弹窗（与下拉框的外部点击逻辑独立）
    setupModalClickOutsideHandler() {
        if (this.__modalOutsideBound) return;
        this.__modalOutsideBound = true;

        document.addEventListener('click', (event) => {
            const modal = document.getElementById('addEngineModal');
            if (!modal || !modal.classList.contains('show')) return;
            if (modal.contains(event.target)) return; // 点击弹窗内部不处理
            this.hideAddEngineModal();
        });
    }
    
    // 添加搜索引擎
    addEngine(engine) {
        const newEngine = {
            id: Date.now(),
            icon: '', // 添加默认空图标字段
            ...engine
        };
        this.engines.push(newEngine);
        this.dataManager.saveData('searchEngines', this.engines);
        this.renderEngines();
        return newEngine;
    }
    
    // 更新搜索引擎
    updateEngine(id, updates) {
        const index = this.engines.findIndex(e => e.id === id);
        if (index !== -1) {
            this.engines[index] = { ...this.engines[index], ...updates };
            this.dataManager.saveData('searchEngines', this.engines);
            // 如果编辑的是当前正在使用的引擎，同步当前引擎记录
            if (this.currentEngine && this.currentEngine.id === id) {
                this.currentEngine = this.engines[index];
                this.dataManager.saveData('currentSearchEngine', this.currentEngine);
            }
            this.renderEngines();
            return this.engines[index];
        }
        return null;
    }
    
    // 删除搜索引擎（与早期版本规则一致：任意引擎可删，但至少保留一个）
    deleteEngine(id) {
        if (this.engines.length <= 1) {
            return;
        }
        
        const wasCurrent = this.currentEngine && this.currentEngine.id === id;
        this.engines = this.engines.filter(e => e.id !== id);
        this.dataManager.saveData('searchEngines', this.engines);
        
        // 只有删掉当前引擎时才切换，避免误伤用户正在使用的引擎
        if (wasCurrent) {
            this.currentEngine = this.engines.find(e => e.name === '必应') || this.engines[0];
            this.dataManager.saveData('currentSearchEngine', this.currentEngine);
        }
        
        this.renderEngines();
        // 删除后保持列表展开，方便继续管理
        openEngineDropdown();
    }
    
    // 处理引擎图标上传
    handleEngineIconUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const iconUrl = e.target.result;
            document.getElementById('engineIcon').value = iconUrl;
            // 手动上传图标后，自动获取只更新名称
            document.getElementById('engineForm').dataset.iconTouched = '1';
            this.updateEngineIconPreview(iconUrl);
        };
        reader.readAsDataURL(file);
    }
    
    // 更新引擎图标预览
    updateEngineIconPreview(iconUrl) {
        const previewContainer = document.getElementById('engineIconPreview');
        if (iconUrl) {
            previewContainer.innerHTML = `
                <img src="${iconUrl}" alt="引擎图标预览" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #ddd;">
            `;
        } else {
            previewContainer.innerHTML = '';
        }
    }
    
    // 设置引擎图标相关事件
    setupEngineIconEvents() {
        const engineForm = document.getElementById('engineForm');
        // 引擎图标URL输入变化时更新预览，并标记为手动设置
        const engineIconInput = document.getElementById('engineIcon');
        if (engineIconInput) {
            engineIconInput.addEventListener('input', (e) => {
                engineForm.dataset.iconTouched = '1';
                this.updateEngineIconPreview(e.target.value);
            });
        }

        // 引擎名称被手动修改后，自动获取只填图标
        const engineNameInput = document.getElementById('engineName');
        if (engineNameInput) {
            engineNameInput.addEventListener('input', () => {
                engineForm.dataset.nameTouched = '1';
            });
        }

        // 引擎图标上传按钮
        const uploadEngineIconBtn = document.getElementById('uploadEngineIconBtn');
        if (uploadEngineIconBtn) {
            uploadEngineIconBtn.addEventListener('click', () => {
                document.getElementById('engineIconFile').click();
            });
        }

        // 引擎图标文件选择
        const engineIconFile = document.getElementById('engineIconFile');
        if (engineIconFile) {
            engineIconFile.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleEngineIconUpload(file);
                }
            });
        }
        
        // 自动获取按钮
        const fetchEngineIconBtn = document.getElementById('fetchEngineIconBtn');
        if (fetchEngineIconBtn) {
            fetchEngineIconBtn.addEventListener('click', () => {
                this.autoFetchEngineInfo();
            });
        }
        
        // 搜索地址输入停顿 650ms 或失焦后自动获取引擎信息
        const engineUrlInput = document.getElementById('engineUrl');
        if (engineUrlInput) {
            engineUrlInput.addEventListener('input', () => {
                clearTimeout(this.engineInfoTimer);
                const status = document.getElementById('engineUrlStatus');
                if (status) {
                    status.textContent = '';
                    status.style.color = '#666';
                }
                const value = engineUrlInput.value.trim();
                if (!value) return;
                this.engineInfoTimer = setTimeout(() => {
                    this.autoFetchEngineInfo();
                }, 650);
            });

            engineUrlInput.addEventListener('blur', () => {
                clearTimeout(this.engineInfoTimer);
                this.autoFetchEngineInfo();
            });
        }
        
        // 添加搜索引擎列表点击空白处关闭功能
        this.setupEngineDropdownClickOutsideHandler();
    }
    
    // 设置搜索引擎列表点击空白处关闭处理程序
    setupEngineDropdownClickOutsideHandler() {
        // 已由 setupClickOutsideHandler 统一处理，此处保持空实现避免重复绑定
        return;
    }
    
    // 自动获取引擎名称和图标（不覆盖用户手改过的字段）
    async autoFetchEngineInfo() {
        const engineUrlInput = document.getElementById('engineUrl');
        const statusEl = document.getElementById('engineUrlStatus');
        const form = document.getElementById('engineForm');
        const raw = (engineUrlInput.value || '').trim();

        if (!raw) {
            if (statusEl) {
                statusEl.textContent = '请先输入搜索地址';
                statusEl.style.color = '#ea4335';
            }
            return;
        }

        const websiteManager = window.app && window.app.websiteManager;
        if (!websiteManager) return;
        const parsed = websiteManager.normalizeSiteUrl(raw.replace(/\{\}/g, ''));
        if (!parsed) {
            if (statusEl) {
                statusEl.textContent = '搜索地址格式不正确';
                statusEl.style.color = '#ea4335';
            }
            return;
        }
        if (this.lastEngineInfoUrl === parsed.href) return;
        this.lastEngineInfoUrl = parsed.href;

        const seq = (this.engineInfoSeq = (this.engineInfoSeq || 0) + 1);
        const nameTouched = form.dataset.nameTouched === '1';
        const iconTouched = form.dataset.iconTouched === '1';

        if (statusEl) {
            statusEl.textContent = '正在获取引擎信息…';
            statusEl.style.color = '#4285f4';
        }

        // 名称：从域名提取（用户手改过则保留）
        const engineNameInput = document.getElementById('engineName');
        if (engineNameInput && (!nameTouched || !engineNameInput.value.trim())) {
            engineNameInput.value = this.extractEngineNameFromDomain(parsed.hostname);
        }

        // 图标：与网站面板共用同一套候选（页面声明 → 同源路径 → 第三方服务）
        if (iconTouched) {
            if (statusEl) {
                statusEl.textContent = '图标已手动设置，保留现有图标';
                statusEl.style.color = '#6b7280';
            }
            return;
        }

        const pageUrl = `${parsed.origin}/`;
        let html = '';
        let pageUnreachable = false;
        try {
            html = await websiteManager.fetchSiteHtml(pageUrl);
        } catch (error) {
            html = '';
            pageUnreachable = error.message === '请求超时' || error.message.includes('拦截');
        }
        if (seq !== this.engineInfoSeq) return;

        let result;
        try {
            result = await websiteManager.fetchBestIcon({
                pageUrl,
                origin: parsed.origin,
                hostname: parsed.hostname,
                html,
                pageUnreachable
            });
        } catch (error) {
            result = { success: false, reason: [error.message] };
        }
        if (seq !== this.engineInfoSeq) return;

        if (result.success) {
            const iconValue = result.source || result.value;
            document.getElementById('engineIcon').value = iconValue;
            this.updateEngineIconPreview(iconValue);
            if (statusEl) {
                statusEl.textContent = '已获取引擎名称和图标';
                statusEl.style.color = '#34a853';
            }
        } else {
            if (statusEl) {
                const reasonList = Array.isArray(result.reason) ? result.reason : [result.reason || '未找到可用图标'];
                statusEl.textContent = `名称已获取，图标获取失败：${reasonList.join('；')}。可手动上传或填写图标地址`;
                statusEl.style.color = '#ea4335';
            }
        }
    }
    
    // 从域名提取引擎名称
    extractEngineNameFromDomain(domain) {
        // 移除www.前缀
        const cleanDomain = domain.replace(/^www\./, '');
        
        // 移除.com, .org等后缀
        const name = cleanDomain.split('.')[0];
        
        // 首字母大写
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // 隐藏添加引擎弹窗
    hideAddEngineModal() {
        const modal = document.getElementById('addEngineModal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('show');
        }
        const form = document.getElementById('engineForm');
        form.reset();
        delete form.dataset.editId;
        delete form.dataset.nameTouched;
        delete form.dataset.iconTouched;
        // 关闭即作废在途自动抓取，避免结果回写下次打开的面板
        this.engineInfoSeq = (this.engineInfoSeq || 0) + 1;
        clearTimeout(this.engineInfoTimer);
        this.lastEngineInfoUrl = '';
    }
}



// 主应用类
class NewTabApp {
    constructor() {
        this.dataManager = new DataManager();
        this.websiteManager = new WebsiteManager(this.dataManager);
        this.backgroundManager = new BackgroundManager(this.dataManager);
        this.searchEngineManager = new SearchEngineManager(this.dataManager);
        // 移除小部件管理器，因为我们已经去除了小部件功能
        // this.widgetManager = new WidgetManager(this.dataManager);
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderInitialData();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 设置按钮
        document.getElementById('settingsBtn').addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡，防止刚打开就被关闭
            this.showSettingsModal();
        });

        // 关闭按钮事件 - 直接关闭设置模态框
        document.getElementById('closeSettings').addEventListener('click', () => {
            // 检查是否在编辑网站页面
            const websiteContent = document.getElementById('settings-website-content');
            if (websiteContent.classList.contains('active')) {
                // 如果是编辑网站页面，调用websiteManager的hideAddWebsiteModal方法
                this.websiteManager.hideAddWebsiteModal();
            } else {
                // 否则直接关闭设置模态框
                this.hideSettingsModal();
            }
        });
        
        // 设置返回按钮 - 已移除，不再使用
        // document.getElementById('settingsBackBtn').addEventListener('click', () => {
        //     // 检查当前显示的是哪个二级页面
        //     const customLayoutContent = document.getElementById('settings-custom-layout-content');
        //     const websiteContent = document.getElementById('settings-website-content');
        //     
        //     if (customLayoutContent.classList.contains('active')) {
        //         // 从自定义布局页面返回
        //         this.settingsManager.hideCustomLayoutModal();
        //     } else if (websiteContent.classList.contains('active')) {
        //         // 从添加/编辑网站页面返回
        //         this.websiteManager.hideAddWebsiteModal();
        //     }
        // });
        
        // 关闭添加引擎弹窗
        document.getElementById('closeAddEngine').addEventListener('click', () => {
            this.searchEngineManager.hideAddEngineModal();
        });

        // 移除之前添加的事件监听器，避免多次绑定
        const existingClickHandler = window.clickHandler;
        if (existingClickHandler) {
            document.removeEventListener('click', existingClickHandler);
            window.clickHandler = null;
        }
        
        // 为模态框添加专门的点击事件处理程序
        const settingsModal = document.getElementById('settingsModal');
        const websiteContent = document.getElementById('settings-website-content');
        const websitesGrid = document.getElementById('websitesGrid');
        const modalContent = document.querySelector('#settingsModal .modal-content');
        
        // 标志位：跟踪是否是刚刚关闭模态框的点击事件
        let justClosedModal = false;
        
        // 添加点击事件监听器到模态框本身
        settingsModal.addEventListener('click', function(e) {
            // 检查点击是否直接发生在模态框背景上（不是内容区域）
            if (e.target === this) {
                justClosedModal = true; // 设置标志位
                const isEditingWebsite = websiteContent.classList.contains('active');
                // 关闭模态框
                if (isEditingWebsite) {
                    app.websiteManager.hideAddWebsiteModal();
                } else {
                    app.hideSettingsModal();
                }
            }
        });
        
        // 将当前app实例保存到全局变量，以便在事件处理函数中使用
        window.app = this;
        
        // 添加点击事件监听器到主界面，用于关闭编辑和删除按钮、模态框以及搜索引擎下拉列表
        const clickHandler = function(e) {
            // 检查是否点击了引擎选择器，如果是则不处理
            const engineSelector = document.querySelector('.search-engine-selector');
            if (engineSelector && engineSelector.contains(e.target)) {
                console.log('clickHandler: 点击了引擎选择器，跳过处理');
                return; // 不处理引擎选择器的点击事件
            }
            
            // 处理搜索引擎下拉列表的关闭逻辑
            const engineDropdown = document.getElementById('engineDropdown');
            if (engineDropdown) {
                // 检查是否点击了下拉列表外部
                if (engineDropdown.classList.contains('show') && !engineDropdown.contains(e.target)) {
                    closeEngineDropdown();
                }
            }
            
            // 检查是否点击了主界面空白处（不在模态框内且不是模态框本身）
            if (settingsModal.style.display === 'block') {
                // 检查点击是否发生在模态框外部
                if (!settingsModal.contains(e.target)) {
                    justClosedModal = true; // 设置标志位
                    // 点击了主界面空白处，关闭模态框
                    const isEditingWebsite = websiteContent.classList.contains('active');
                    if (isEditingWebsite) {
                        window.app.websiteManager.hideAddWebsiteModal();
                    } else {
                        window.app.hideSettingsModal();
                    }
                }
            } else {
                // 模态框已经关闭时，处理右键菜单
                // 检查是否点击了主界面空白处
                if (websitesGrid && !websitesGrid.contains(e.target) && !e.target.closest('.website-item')) {
                    // 只有当不是刚刚关闭模态框的点击事件时，才移除right-clicked类
                    if (!justClosedModal) {
                        websitesGrid.classList.remove('right-clicked');
                    } else {
                        // 重置标志位，准备下一次点击
                        justClosedModal = false;
                    }
                }
            }
        };
        
        // 保存点击处理函数到全局变量，以便后续移除
        window.clickHandler = clickHandler;
        
        // 添加事件监听器
        document.addEventListener('click', clickHandler);

        // 网站表单提交
        const websiteForm = document.getElementById('websiteForm');
        const self = this;
        websiteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            self.handleWebsiteFormSubmit();
        });

        // 取消添加网站
        document.getElementById('cancelAddWebsite').addEventListener('click', () => {
            this.websiteManager.hideAddWebsiteModal();
        });

        // 图标上传按钮
        document.getElementById('uploadIconBtn').addEventListener('click', () => {
            document.getElementById('iconFile').click();
        });

        // 图标文件选择
        document.getElementById('iconFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.websiteManager.handleIconUpload(file);
            }
        });

        // 自动抓取图标按钮
        document.getElementById('fetchIconBtn').addEventListener('click', () => {
            const url = document.getElementById('websiteUrl').value;
            if (url) {
                this.websiteManager.fetchWebsiteIcon(url);
            } else {
                alert('请先输入网站URL');
            }
        });

        // 图标URL输入变化时只更新主界面预览，真正校验与保存放到 change 事件
        document.getElementById('websiteIcon').addEventListener('input', (e) => {
            const iconUrl = e.target.value.trim();
            const form = document.getElementById('websiteForm');
            // 用户手动改过图标：后续自动抓取不再覆盖
            form.dataset.iconTouched = '1';
            delete form.dataset.iconAutoFilled;
            // 输入过程中只对看起来完整的地址做预览，避免半截地址反复触发回退
            const looksComplete = !iconUrl || /^(https?:\/\/|data:image\/)/i.test(iconUrl);
            if (looksComplete) {
                this.websiteManager.updateIconPreview(iconUrl);
                this.websiteManager.syncEditPreview();
            }
        });

        // 手动输入图标地址后做真实加载校验，失败给出明确原因
        document.getElementById('websiteIcon').addEventListener('change', async (e) => {
            const iconUrl = e.target.value.trim();
            const statusElement = document.getElementById('iconStatus');
            const form = document.getElementById('websiteForm');

            if (!iconUrl) {
                delete form.dataset.iconValidatedValue;
                delete form.dataset.iconResolvedValue;
                delete form.dataset.iconError;
                if (statusElement) statusElement.textContent = '';
                this.websiteManager.updateIconPreview('');
                return;
            }

            if (statusElement) {
                statusElement.innerHTML = '<span style="color: #4285f4;">正在校验图标地址...</span>';
            }

            try {
                const result = await this.websiteManager.validateIconUrl(iconUrl, 6000);
                // 输入框保留可读地址，实际保存使用解析后的 DataURL（如可获取）
                form.dataset.iconValidatedValue = iconUrl;
                form.dataset.iconResolvedValue = result.value;
                delete form.dataset.iconError;
                const sizeText = (result.width && result.height) ? `（${result.width}×${result.height}）` : '';
                if (statusElement) {
                    statusElement.innerHTML = `<span style="color: #34a853;">图标可用${sizeText}</span>`;
                }
                this.websiteManager.updateIconPreview(iconUrl);
                this.websiteManager.syncEditPreview();
            } catch (error) {
                delete form.dataset.iconValidatedValue;
                delete form.dataset.iconResolvedValue;
                form.dataset.iconError = error.message;
                if (statusElement) {
                    statusElement.innerHTML = `<span style="color: #ea4335;">图标不可用：${error.message}</span>`;
                }
                // 数据仍回滚到进入编辑时的原始图标；预览按当前地址展示，
                // 加载不出来就显示占位，失败原因保留在 #iconStatus
                this.websiteManager.updateIconPreview(iconUrl);
            }
        });

        // URL输入停顿 650ms 或失焦后自动获取名称和图标
        const websiteUrlInput = document.getElementById('websiteUrl');
        const websiteNameInput = document.getElementById('websiteName');
        websiteUrlInput.addEventListener('input', () => {
            clearTimeout(this.websiteInfoTimer);
            document.getElementById('urlStatus').textContent = '';
            const value = websiteUrlInput.value.trim();
            if (!value || !this.websiteManager.normalizeSiteUrl(value)) return;
            this.websiteInfoTimer = setTimeout(() => {
                this.websiteManager.fetchWebsiteInfo(value);
            }, 650);
        });
        websiteUrlInput.addEventListener('blur', () => {
            clearTimeout(this.websiteInfoTimer);
            const value = websiteUrlInput.value.trim();
            const parsed = this.websiteManager.normalizeSiteUrl(value);
            if (!parsed) return;
            // 省略协议时补全为完整地址，保证表单校验和保存都能通过
            if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(value)) {
                websiteUrlInput.value = parsed.href;
            }
            // 同一地址已抓取过则不重复请求（fetchWebsiteInfo 内部也有去重）
            this.websiteManager.fetchWebsiteInfo(parsed.href);
        });
        // 名称被用户手动修改后，自动抓取只填图标
        websiteNameInput.addEventListener('input', () => {
            const form = document.getElementById('websiteForm');
            form.dataset.nameTouched = '1';
            delete form.dataset.nameAutoFilled;
        });

        // 图标大小：面板数值 + 主界面实时预览（仅改 DOM，不落盘）
        document.getElementById('iconSize').addEventListener('input', (e) => {
            const size = e.target.value;
            document.getElementById('currentIconSize').textContent = `${size}%`;
            this.websiteManager.syncEditPreview();
        });

        // 底色/透明只影响面板预览，保存时才写入数据
        document.getElementById('iconBgColor').addEventListener('input', (e) => {
            const color = e.target.value;
            document.getElementById('currentBgColor').textContent = color;
            this.websiteManager.updateIconPreview(document.getElementById('websiteIcon').value, color);
            this.websiteManager.syncEditPreview();
        });

        // 设置透明底色（仅预览，保存后生效）
        document.getElementById('setTransparentBtn').addEventListener('click', () => {
            document.getElementById('currentBgColor').textContent = 'transparent';
            this.websiteManager.updateIconPreview(document.getElementById('websiteIcon').value, 'transparent');
            this.websiteManager.syncEditPreview();
        });

        // 一键适配：读取当前图标，取边缘主色作为图标底色（仅预览，保存后生效）
        document.getElementById('adaptIconBgBtn').addEventListener('click', () => {
            this.websiteManager.adaptIconBgColor();
        });

        // Esc 关闭编辑面板并回滚未保存的改动
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            const engineModal = document.getElementById('addEngineModal');
            if (engineModal && (engineModal.classList.contains('show') || engineModal.style.display === 'flex' || engineModal.style.display === 'block')) {
                this.searchEngineManager.hideAddEngineModal();
                return;
            }
            const websiteContent = document.getElementById('settings-website-content');
            if (websiteContent && websiteContent.classList.contains('active')) {
                this.websiteManager.hideAddWebsiteModal();
            }
        });

        // 引擎表单提交
        document.getElementById('engineForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEngineFormSubmit();
        });

        // 取消添加引擎
        document.getElementById('cancelAddEngine').addEventListener('click', () => {
            this.searchEngineManager.hideAddEngineModal();
        });

        // 背景设置
        document.getElementById('bgFile').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.backgroundManager.handleFileUpload(file);
            }
        });

        document.getElementById('removeBg').addEventListener('click', () => {
            this.backgroundManager.removeBackgroundImage();
        });

        // 设置菜单中的添加网站按钮
        document.getElementById('addWebsiteFromSettings').addEventListener('click', () => {
            this.websiteManager.showAddWebsiteModal();
        });



        // 小猫换壁纸按钮
        document.getElementById('catWallpaperBtn').addEventListener('click', () => {
            // 主动换图：必应源会换到另一张历史图
            this.backgroundManager.getRandomWallpaper({ rotate: true });
        });
        
        // 更换壁纸按钮
        const changeWallpaperBtn = document.getElementById('changeWallpaper');
        if (changeWallpaperBtn) {
            changeWallpaperBtn.addEventListener('click', () => {
                this.backgroundManager.getRandomWallpaper({ rotate: true });
            });
        }
        
        // 移除自动调用getRandomWallpaper的逻辑，确保只有在用户主动点击时才获取新壁纸

        // 文字显示开关
        const showWebsiteNamesToggle = document.getElementById('showWebsiteNames');
        showWebsiteNamesToggle.addEventListener('change', (e) => {
            const settings = this.dataManager.getData('settings');
            settings.showWebsiteNames = e.target.checked;
            this.dataManager.saveData('settings', settings);
            this.websiteManager.renderWebsites();
            
            // 更新开关样式
            const toggleLabel = e.target.parentElement;
            const toggleThumb = toggleLabel.querySelector('.toggle-thumb');
            const toggleTrack = toggleLabel.querySelector('.toggle-track');
            if (e.target.checked) {
                toggleTrack.style.backgroundColor = '#4285f4';
                toggleThumb.style.transform = 'translateX(26px)';
            } else {
                toggleTrack.style.backgroundColor = '#ccc';
                toggleThumb.style.transform = 'translateX(0)';
            }
        });
        
        // 初始更新开关样式
        const initialToggleLabel = showWebsiteNamesToggle.parentElement;
        const initialToggleThumb = initialToggleLabel.querySelector('.toggle-thumb');
        const initialToggleTrack = initialToggleLabel.querySelector('.toggle-track');
        if (showWebsiteNamesToggle.checked) {
            initialToggleTrack.style.backgroundColor = '#4285f4';
            initialToggleThumb.style.transform = 'translateX(26px)';
        } else {
            initialToggleTrack.style.backgroundColor = '#ccc';
            initialToggleThumb.style.transform = 'translateX(0)';
        }
        
        // 目标打开方式 - 搜索结果
        const openSearchInNewTabToggle = document.getElementById('openSearchInNewTab');
        openSearchInNewTabToggle.addEventListener('change', (e) => {
            const settings = this.dataManager.getData('settings');
            settings.openSearchInNewTab = e.target.checked;
            this.dataManager.saveData('settings', settings);
            
            // 更新开关样式
            const toggleLabel = e.target.parentElement;
            const toggleThumb = toggleLabel.querySelector('.toggle-thumb');
            const toggleTrack = toggleLabel.querySelector('.toggle-track');
            if (e.target.checked) {
                toggleTrack.style.backgroundColor = '#4285f4';
                toggleThumb.style.transform = 'translateX(26px)';
            } else {
                toggleTrack.style.backgroundColor = '#ccc';
                toggleThumb.style.transform = 'translateX(0)';
            }
        });
        
        // 初始更新搜索结果开关样式
        const initialOpenSearchInNewTabToggleLabel = openSearchInNewTabToggle.parentElement;
        const initialOpenSearchInNewTabToggleThumb = initialOpenSearchInNewTabToggleLabel.querySelector('.toggle-thumb');
        const initialOpenSearchInNewTabToggleTrack = initialOpenSearchInNewTabToggleLabel.querySelector('.toggle-track');
        if (openSearchInNewTabToggle.checked) {
            initialOpenSearchInNewTabToggleTrack.style.backgroundColor = '#4285f4';
            initialOpenSearchInNewTabToggleThumb.style.transform = 'translateX(26px)';
        } else {
            initialOpenSearchInNewTabToggleTrack.style.backgroundColor = '#ccc';
            initialOpenSearchInNewTabToggleThumb.style.transform = 'translateX(0)';
        }
        
        // 目标打开方式 - 网站
        const openWebsiteInNewTabToggle = document.getElementById('openWebsiteInNewTab');
        openWebsiteInNewTabToggle.addEventListener('change', (e) => {
            const settings = this.dataManager.getData('settings');
            settings.openWebsiteInNewTab = e.target.checked;
            this.dataManager.saveData('settings', settings);
            
            // 更新开关样式
            const toggleLabel = e.target.parentElement;
            const toggleThumb = toggleLabel.querySelector('.toggle-thumb');
            const toggleTrack = toggleLabel.querySelector('.toggle-track');
            if (e.target.checked) {
                toggleTrack.style.backgroundColor = '#4285f4';
                toggleThumb.style.transform = 'translateX(26px)';
            } else {
                toggleTrack.style.backgroundColor = '#ccc';
                toggleThumb.style.transform = 'translateX(0)';
            }
        });
        
        // 初始更新网站开关样式
        const initialOpenWebsiteInNewTabToggleLabel = openWebsiteInNewTabToggle.parentElement;
        const initialOpenWebsiteInNewTabToggleThumb = initialOpenWebsiteInNewTabToggleLabel.querySelector('.toggle-thumb');
        const initialOpenWebsiteInNewTabToggleTrack = initialOpenWebsiteInNewTabToggleLabel.querySelector('.toggle-track');
        if (openWebsiteInNewTabToggle.checked) {
            initialOpenWebsiteInNewTabToggleTrack.style.backgroundColor = '#4285f4';
            initialOpenWebsiteInNewTabToggleThumb.style.transform = 'translateX(26px)';
        } else {
            initialOpenWebsiteInNewTabToggleTrack.style.backgroundColor = '#ccc';
            initialOpenWebsiteInNewTabToggleThumb.style.transform = 'translateX(0)';
        }
        
        // 网站图标大小调节
        const websiteIconSizeSlider = document.getElementById('websiteIconSize');
        const iconSizeValue = document.getElementById('iconSizeValue');
        if (websiteIconSizeSlider && iconSizeValue) {
            // 设置滑块的最小值和最大值
            websiteIconSizeSlider.min = 80;
            websiteIconSizeSlider.max = 250;
            
            // 初始值设置
            const settings = this.dataManager.getData('settings');
            const initialIconSize = settings.websiteIconSize || 120;
            websiteIconSizeSlider.value = initialIconSize;
            iconSizeValue.textContent = formatRelativePercent(initialIconSize, 120);
            
            // 滑块变化事件
            websiteIconSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                iconSizeValue.textContent = formatRelativePercent(size, 120);
                this.updateWebsiteIconSize(size);
            });
        }
        
        // 文字颜色调节
        const websiteNameColorPicker = document.getElementById('websiteNameColor');
        if (websiteNameColorPicker) {
            // 滑块变化事件
            websiteNameColorPicker.addEventListener('input', (e) => {
                const color = e.target.value;
                this.updateWebsiteNameColor(color);
            });
        }
        
        // 文字大小调节
        const websiteNameSizeSlider = document.getElementById('websiteNameSize');
        const nameSizeValue = document.getElementById('nameSizeValue');
        if (websiteNameSizeSlider && nameSizeValue) {
            // 初始值设置
            const settings = this.dataManager.getData('settings');
            const initialNameSize = settings.websiteNameSize || 14;
            websiteNameSizeSlider.value = initialNameSize;
            nameSizeValue.textContent = `${initialNameSize}px`;
            
            // 滑块变化事件
            websiteNameSizeSlider.addEventListener('input', (e) => {
                const size = parseInt(e.target.value);
                nameSizeValue.textContent = `${size}px`;
                this.updateWebsiteNameSize(size);
            });
        }
        
        // 网站列间距调节
        const websiteColumnGapSlider = document.getElementById('websiteColumnGap');
        const websiteColumnGapValue = document.getElementById('websiteColumnGapValue');
        if (websiteColumnGapSlider && websiteColumnGapValue) {
            // 初始值设置
            const settings = this.dataManager.getData('settings');
            const initialColumnGap = settings.layout?.columnGap || 105;
            websiteColumnGapSlider.value = initialColumnGap;
            websiteColumnGapValue.textContent = formatRelativePercent(initialColumnGap, 105);
            
            // 滑块变化事件
            websiteColumnGapSlider.addEventListener('input', (e) => {
                const gap = parseInt(e.target.value);
                websiteColumnGapValue.textContent = formatRelativePercent(gap, 105);
                this.updateWebsiteColumnGap(gap);
            });
        }
        
        // 网站行间距调节
        const websiteRowGapSlider = document.getElementById('websiteRowGap');
        const websiteRowGapValue = document.getElementById('websiteRowGapValue');
        if (websiteRowGapSlider && websiteRowGapValue) {
            // 初始值设置
            const settings = this.dataManager.getData('settings');
            const initialRowGap = settings.layout?.rowGap || 58;
            websiteRowGapSlider.value = initialRowGap;
            websiteRowGapValue.textContent = formatRelativePercent(initialRowGap, 58);
            
            // 滑块变化事件
            websiteRowGapSlider.addEventListener('input', (e) => {
                const gap = parseInt(e.target.value);
                websiteRowGapValue.textContent = formatRelativePercent(gap, 58);
                this.updateWebsiteRowGap(gap);
            });
        }
        
        // 翻页动画选择（分段按钮，选择结果写入 settings.pageTransition）
        const transitionButtons = document.querySelectorAll('.page-transition-btn');
        const currentTransition = (this.dataManager.getData('settings') || {}).pageTransition || 'slide';
        transitionButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.transition === currentTransition);
            btn.addEventListener('click', () => {
                const value = btn.dataset.transition || 'slide';
                const settings = this.dataManager.getData('settings');
                settings.pageTransition = value;
                this.dataManager.saveData('settings', settings);
                transitionButtons.forEach(item => {
                    item.classList.toggle('active', item === btn);
                });
            });
        });
        
        // 壁纸源选择器事件监听
        const wallpaperSource = document.getElementById('wallpaperSource');
        const customWallpaperSource = document.getElementById('customWallpaperSource');
        const customWallpaperUrl = document.getElementById('customWallpaperUrl');
        const editWallpaperSourceBtn = document.getElementById('editWallpaperSourceBtn');
        
        if (wallpaperSource) {
            wallpaperSource.addEventListener('change', (e) => {
                this.handleWallpaperSourceChange(e.target.value);
                
                // 显示/隐藏自定义壁纸源输入框
                if (e.target.value === 'custom') {
                    customWallpaperSource.style.display = 'block';
                } else {
                    customWallpaperSource.style.display = 'none';
                }
            });
        }
        
        // 自定义壁纸源输入框事件监听
        if (customWallpaperUrl) {
            customWallpaperUrl.addEventListener('input', (e) => {
                this.updateCustomWallpaperUrl(e.target.value);
            });
        }
        
        // 编辑壁纸源按钮事件监听
        if (editWallpaperSourceBtn) {
            editWallpaperSourceBtn.addEventListener('click', () => {
                this.showEditWallpaperSourceModal();
            });
        }
        
        // 关闭编辑壁纸源弹窗事件
        const closeEditWallpaperSource = document.getElementById('closeEditWallpaperSource');
        const cancelEditWallpaperSource = document.getElementById('cancelEditWallpaperSource');
        const editWallpaperSourceModal = document.getElementById('editWallpaperSourceModal');
        
        if (closeEditWallpaperSource) {
            closeEditWallpaperSource.addEventListener('click', () => {
                this.hideEditWallpaperSourceModal();
            });
        }
        
        if (cancelEditWallpaperSource) {
            cancelEditWallpaperSource.addEventListener('click', () => {
                this.hideEditWallpaperSourceModal();
            });
        }
        
        // 点击弹窗外部关闭
        if (editWallpaperSourceModal) {
            editWallpaperSourceModal.addEventListener('click', (e) => {
                if (e.target === editWallpaperSourceModal) {
                    this.hideEditWallpaperSourceModal();
                }
            });
        }
        
        // 单个壁纸源编辑弹窗事件
        const closeSingleWallpaperSourceEdit = document.getElementById('closeSingleWallpaperSourceEdit');
        const cancelSingleWallpaperSourceEdit = document.getElementById('cancelSingleWallpaperSourceEdit');
        const singleWallpaperSourceEditModal = document.getElementById('singleWallpaperSourceEditModal');
        const singleWallpaperSourceEditForm = document.getElementById('singleWallpaperSourceEditForm');
        
        if (closeSingleWallpaperSourceEdit) {
            closeSingleWallpaperSourceEdit.addEventListener('click', () => {
                this.hideSingleWallpaperSourceModal();
            });
        }
        
        if (cancelSingleWallpaperSourceEdit) {
            cancelSingleWallpaperSourceEdit.addEventListener('click', () => {
                this.hideSingleWallpaperSourceModal();
            });
        }
        
        if (singleWallpaperSourceEditForm) {
            singleWallpaperSourceEditForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSingleWallpaperSourceEditSubmit();
            });
        }
        
        // 点击弹窗外部关闭
        if (singleWallpaperSourceEditModal) {
            singleWallpaperSourceEditModal.addEventListener('click', (e) => {
                if (e.target === singleWallpaperSourceEditModal) {
                    this.hideSingleWallpaperSourceModal();
                }
            });
        }
        
        // 添加新壁纸源弹窗事件
        const closeAddWallpaperSource = document.getElementById('closeAddWallpaperSource');
        const cancelAddWallpaperSource = document.getElementById('cancelAddWallpaperSource');
        const addWallpaperSourceModal = document.getElementById('addWallpaperSourceModal');
        const addWallpaperSourceForm = document.getElementById('addWallpaperSourceForm');
        
        if (closeAddWallpaperSource) {
            closeAddWallpaperSource.addEventListener('click', () => {
                this.hideAddWallpaperSourceModal();
            });
        }
        
        if (cancelAddWallpaperSource) {
            cancelAddWallpaperSource.addEventListener('click', () => {
                this.hideAddWallpaperSourceModal();
            });
        }
        
        if (addWallpaperSourceForm) {
            addWallpaperSourceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddWallpaperSourceSubmit();
            });
        }
        
        // 点击弹窗外部关闭
        if (addWallpaperSourceModal) {
            addWallpaperSourceModal.addEventListener('click', (e) => {
                if (e.target === addWallpaperSourceModal) {
                    this.hideAddWallpaperSourceModal();
                }
            });
        }

        // 移除重复的点击事件监听器，已在setupEventListeners中实现该功能
        // 保留注释，说明功能已在其他位置实现
        
        // 延迟设置布局事件监听器，防止DOM元素未加载导致的错误
        setTimeout(() => {
            try {
                // 布局预设按钮事件监听
                this.setupLayoutPresetEvents();
            } catch (error) {
                console.error('Error setting up layout preset events:', error);
            }
        }, 150);
        
        // 搜索框设置初始化
        this.initSearchBoxSettings();
        
        // 位置调整（搜索框 / 网站图标上下位置）初始化
        this.initLayoutOffsetSettings();
        
        // 恢复默认设置按钮事件监听
        const resetToDefaultsBtn = document.getElementById('resetToDefaultsBtn');
        if (resetToDefaultsBtn) {
            resetToDefaultsBtn.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }
        
        // 数据备份按钮事件监听
        const backupDataBtn = document.getElementById('backupDataBtn');
        if (backupDataBtn) {
            backupDataBtn.addEventListener('click', () => {
                this.exportDataBackup();
            });
        }
        
        // 数据导入按钮事件监听
        const importDataBtn = document.getElementById('importDataBtn');
        const importDataFile = document.getElementById('importDataFile');
        if (importDataBtn && importDataFile) {
            // 点击按钮触发文件选择
            importDataBtn.addEventListener('click', () => {
                importDataFile.click();
            });
            
            // 文件选择变化事件
            importDataFile.addEventListener('change', (e) => {
                this.handleDataImport(e);
            });
        }
    }
    
    // 初始化搜索框设置
    initSearchBoxSettings() {
        // 应用初始搜索框设置
        this.applySearchBoxSettings();
        
        // 设置事件监听
        this.setupSearchBoxEvents();
    }
    
    // 设置搜索框事件监听
    setupSearchBoxEvents() {
        const radiusSlider = document.getElementById('searchBoxRadius');
        const radiusValue = document.getElementById('radiusValue');
        const opacitySlider = document.getElementById('searchBoxOpacity');
        const opacityValue = document.getElementById('opacityValue');
        const heightSlider = document.getElementById('searchBoxHeight');
        const heightValue = document.getElementById('heightValue');
        const widthSlider = document.getElementById('searchBoxWidth');
        const widthValue = document.getElementById('widthValue');
        const blurSlider = document.getElementById('searchBoxBlur');
        const blurValue = document.getElementById('blurValue');
        
        const settings = this.dataManager.getData('settings');
        
        // 圆角滑块事件监听
        if (radiusSlider && radiusValue) {
            // 初始值设置（按默认圆角 40px 换算为相对百分比）
            const initialRadius = settings.searchBoxRadius ?? 40;
            radiusSlider.value = initialRadius;
            radiusValue.textContent = formatRelativePercent(initialRadius, 40);
            
            // 滑块变化事件
            radiusSlider.addEventListener('input', (e) => {
                const radius = parseInt(e.target.value);
                radiusValue.textContent = formatRelativePercent(radius, 40);
                this.updateSearchBoxRadius(radius);
            });
        }
        
        // 透明度滑块事件监听
        if (opacitySlider && opacityValue) {
            // 初始值设置
            const initialOpacity = settings.searchBoxOpacity ?? 30;
            opacitySlider.value = initialOpacity;
            opacityValue.textContent = `${initialOpacity}%`;
            
            // 滑块变化事件
            opacitySlider.addEventListener('input', (e) => {
                const opacity = parseInt(e.target.value);
                opacityValue.textContent = `${opacity}%`;
                this.updateSearchBoxOpacity(opacity);
            });
        }
        
        // 高度滑块事件监听
        if (heightSlider && heightValue) {
            // 初始值设置（按默认高度 65px 换算为相对百分比）
            const initialHeight = settings.searchBoxHeight ?? 65;
            heightSlider.value = initialHeight;
            heightValue.textContent = formatRelativePercent(initialHeight, 65);
            
            // 滑块变化事件
            heightSlider.addEventListener('input', (e) => {
                const height = parseInt(e.target.value);
                heightValue.textContent = formatRelativePercent(height, 65);
                this.updateSearchBoxHeight(height);
            });
        }
        
        // 宽度滑块事件监听
        if (widthSlider && widthValue) {
            // 初始值设置
            const initialWidth = settings.searchBoxWidth ?? 35;
            widthSlider.value = initialWidth;
            widthValue.textContent = `${initialWidth}%`;
            
            // 滑块变化事件
            widthSlider.addEventListener('input', (e) => {
                const width = parseInt(e.target.value);
                widthValue.textContent = `${width}%`;
                this.updateSearchBoxWidth(width);
            });
        }
        
        // 模糊度滑块事件监听（与透明度相互独立）
        if (blurSlider && blurValue) {
            const initialBlur = settings.searchBoxBlur ?? 22;
            blurSlider.value = initialBlur;
            blurValue.textContent = `${Number(initialBlur)}px`;
            
            blurSlider.addEventListener('input', (e) => {
                const blur = parseInt(e.target.value, 10);
                blurValue.textContent = `${blur}px`;
                this.updateSearchBoxBlur(blur);
            });
        }
    }
    
    // 更新搜索框圆角
    updateSearchBoxRadius(radius) {
        // 验证圆角值在有效范围内
        const validRadius = Math.max(0, Math.min(40, radius));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        settings.searchBoxRadius = validRadius;
        this.dataManager.saveData('settings', settings);
        
        // 应用设置
        this.applySearchBoxRadius(validRadius);
    }
    
    // 更新搜索框透明度
    updateSearchBoxOpacity(opacity) {
        // 验证透明度值在有效范围内
        const validOpacity = Math.max(30, Math.min(100, opacity));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        settings.searchBoxOpacity = validOpacity;
        this.dataManager.saveData('settings', settings);
        
        // 应用设置
        this.applySearchBoxOpacity(validOpacity);
    }
    

    
    // 更新搜索框高度
    updateSearchBoxHeight(height) {
        // 验证高度值在有效范围内
        const validHeight = Math.max(40, Math.min(100, height));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        settings.searchBoxHeight = validHeight;
        this.dataManager.saveData('settings', settings);
        
        // 应用设置
        this.applySearchBoxHeight(validHeight);
    }
    
    // 更新搜索框宽度
    updateSearchBoxWidth(width) {
        // 验证宽度值在有效范围内
        const validWidth = Math.max(20, Math.min(100, width));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        settings.searchBoxWidth = validWidth;
        this.dataManager.saveData('settings', settings);
        
        // 应用设置
        this.applySearchBoxWidth(validWidth);
    }
    
    // 更新搜索框模糊度（独立于透明度）
    updateSearchBoxBlur(blur) {
        const validBlur = Math.max(0, Math.min(30, blur));
        
        const settings = this.dataManager.getData('settings');
        settings.searchBoxBlur = validBlur;
        this.dataManager.saveData('settings', settings);
        
        this.applySearchBoxBlur(validBlur);
    }
    
    // 位置调整：把偏移值限制在允许范围内（单位为 vh，保留 0.1 精度）
    clampLayoutOffset(value) {
        const num = Number(value);
        if (!Number.isFinite(num)) return 0;
        return Math.min(30, Math.max(-10, Math.round(num * 10) / 10));
    }
    
    // 位置调整：应用 CSS 变量（无单位数值，由 CSS 换算为 vh）
    applyLayoutOffsets(searchOffsetY, iconsOffsetY) {
        const settings = this.dataManager.getData('settings');
        const layout = settings.layout || {};
        const search = searchOffsetY === undefined
            ? this.clampLayoutOffset(layout.searchOffsetY ?? 0)
            : this.clampLayoutOffset(searchOffsetY);
        const icons = iconsOffsetY === undefined
            ? this.clampLayoutOffset(layout.iconsOffsetY ?? 0)
            : this.clampLayoutOffset(iconsOffsetY);
        
        document.documentElement.style.setProperty('--search-offset-y', `${search}`);
        document.documentElement.style.setProperty('--icons-offset-y', `${icons}`);
    }
    
    // 位置调整：初始化滑块、实时预览与重置按钮
    initLayoutOffsetSettings() {
        const searchSlider = document.getElementById('searchOffsetY');
        const searchValue = document.getElementById('searchOffsetYValue');
        const iconsSlider = document.getElementById('iconsOffsetY');
        const iconsValue = document.getElementById('iconsOffsetYValue');
        const resetBtn = document.getElementById('resetLayoutOffsetsBtn');
        
        const settings = this.dataManager.getData('settings');
        const layout = settings.layout || {};
        const searchOffset = this.clampLayoutOffset(layout.searchOffsetY ?? 0);
        const iconsOffset = this.clampLayoutOffset(layout.iconsOffsetY ?? 0);
        
        if (searchSlider) {
            searchSlider.value = searchOffset;
            searchSlider.addEventListener('input', (e) => {
                const value = this.clampLayoutOffset(e.target.value);
                if (searchValue) searchValue.textContent = formatOffsetPercent(value);
                this.updateSearchOffsetY(value);
            });
        }
        if (searchValue) searchValue.textContent = formatOffsetPercent(searchOffset);
        
        if (iconsSlider) {
            iconsSlider.value = iconsOffset;
            iconsSlider.addEventListener('input', (e) => {
                const value = this.clampLayoutOffset(e.target.value);
                if (iconsValue) iconsValue.textContent = formatOffsetPercent(value);
                this.updateIconsOffsetY(value);
            });
        }
        if (iconsValue) iconsValue.textContent = formatOffsetPercent(iconsOffset);
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetLayoutOffsets());
        }
        
        this.applyLayoutOffsets(searchOffset, iconsOffset);
    }
    
    // 位置调整：更新搜索框上下位置并持久化
    updateSearchOffsetY(value) {
        const validValue = this.clampLayoutOffset(value);
        const settings = this.dataManager.getData('settings');
        if (!settings.layout) settings.layout = {};
        settings.layout.searchOffsetY = validValue;
        this.dataManager.saveData('settings', settings);
        this.applyLayoutOffsets();
    }
    
    // 位置调整：更新网站图标上下位置并持久化
    updateIconsOffsetY(value) {
        const validValue = this.clampLayoutOffset(value);
        const settings = this.dataManager.getData('settings');
        if (!settings.layout) settings.layout = {};
        settings.layout.iconsOffsetY = validValue;
        this.dataManager.saveData('settings', settings);
        this.applyLayoutOffsets();
    }
    
    // 位置调整：重置两个滑块到默认位置
    resetLayoutOffsets() {
        const settings = this.dataManager.getData('settings');
        if (!settings.layout) settings.layout = {};
        settings.layout.searchOffsetY = 0;
        settings.layout.iconsOffsetY = 0;
        this.dataManager.saveData('settings', settings);
        
        const searchSlider = document.getElementById('searchOffsetY');
        const searchValue = document.getElementById('searchOffsetYValue');
        const iconsSlider = document.getElementById('iconsOffsetY');
        const iconsValue = document.getElementById('iconsOffsetYValue');
        if (searchSlider) searchSlider.value = 0;
        if (searchValue) searchValue.textContent = '0%';
        if (iconsSlider) iconsSlider.value = 0;
        if (iconsValue) iconsValue.textContent = '0%';
        
        this.applyLayoutOffsets(0, 0);
    }
    
    // 应用搜索框设置
    applySearchBoxSettings() {
        const settings = this.dataManager.getData('settings');
        const searchBox = document.querySelector('.search-container');
        const searchContainer = document.querySelector('.new-search-box');
        
        // 临时移除过渡效果，避免初始加载时的抖动
        if (searchBox) {
            searchBox.style.transition = 'none';
        }
        if (searchContainer) {
            searchContainer.style.transition = 'none';
        }
        
        // 应用圆角设置
        const radius = settings.searchBoxRadius ?? 40;
        this.applySearchBoxRadius(radius);
        
        // 应用透明度设置
        const opacity = settings.searchBoxOpacity ?? 30;
        this.applySearchBoxOpacity(opacity);
        
        // 应用高度设置
        const height = settings.searchBoxHeight ?? 65;
        this.applySearchBoxHeight(height);
        
        // 应用宽度设置
        const width = settings.searchBoxWidth ?? 35;
        this.applySearchBoxWidth(width);
        
        // 应用模糊度设置（与透明度相互独立）
        const blur = settings.searchBoxBlur ?? 22;
        this.applySearchBoxBlur(blur);
        
        // 延迟恢复过渡效果，确保初始样式已应用
        setTimeout(() => {
            if (searchBox) {
                searchBox.style.transition = 'all 0.3s ease';
            }
            if (searchContainer) {
                searchContainer.style.transition = 'none';
            }
        }, 50);
    }
    
    // 应用搜索框圆角
    applySearchBoxRadius(radius) {
        const searchBox = document.querySelector('.search-container');
        
        // 验证圆角值在有效范围内
        const validRadius = Math.max(0, Math.min(40, radius));
        const borderRadius = `${validRadius}px`;
        
        // 只应用到搜索框容器，不再应用到内部元素
        if (searchBox) {
            searchBox.style.borderRadius = borderRadius;
        }
    }
    
    // 应用搜索框透明度（通过 CSS 变量控制玻璃拟态底色）
    applySearchBoxOpacity(opacity) {
        const searchBox = document.querySelector('.search-container');
        
        // 验证透明度值在有效范围内
        const validOpacity = Math.max(30, Math.min(100, opacity));
        const opacityValue = validOpacity / 100;
        
        // 清除历史遗留的内联背景，改用 CSS 变量驱动渐变/毛玻璃
        if (searchBox) {
            searchBox.style.background = '';
        }
        document.documentElement.style.setProperty('--search-alpha', opacityValue.toFixed(2));
    }
    

    
    // 应用搜索框高度
    applySearchBoxHeight(height) {
        const searchBox = document.querySelector('.search-container');
        const searchInput = document.querySelector('.search-input');
        const engineSelector = document.querySelector('.search-engine-selector');
        
        // 验证高度值在有效范围内
        const validHeight = Math.max(40, Math.min(100, height));
        const heightValue = `${validHeight}px`;
        
        // 应用到搜索框容器与输入区；搜索按钮高度由 CSS 控制，保持统一背景上的独立图标尺寸
        if (searchBox) {
            searchBox.style.height = heightValue;
        }
        if (searchInput) {
            searchInput.style.height = heightValue;
            searchInput.style.lineHeight = heightValue;
        }
        if (engineSelector) {
            engineSelector.style.height = heightValue;
        }
    }
    
    // 应用搜索框宽度
    applySearchBoxWidth(width) {
        const searchContainer = document.querySelector('.new-search-box');
        
        // 验证宽度值在有效范围内
        const validWidth = Math.max(20, Math.min(100, width));
        
        // 应用到搜索容器
        if (searchContainer) {
            searchContainer.style.width = `${validWidth}%`;
        }
    }
    
    // 应用搜索框模糊度：0 时是一个真正的无模糊值
    applySearchBoxBlur(blur) {
        const validBlur = Math.max(0, Math.min(30, Number(blur) || 0));
        document.documentElement.style.setProperty('--search-blur', `${validBlur}px`);
    }
    
    // 恢复默认设置
    resetToDefaults() {
        // 显示确认提示
        if (confirm('确定要恢复默认设置吗？此操作将清除所有自定义设置，恢复到初始状态。')) {
            // 清除所有存储的数据
            localStorage.clear();
            
            // 关闭设置模态框
            this.hideSettingsModal();
            
            // 刷新页面以应用默认设置
            location.reload();
        }
    }

    // 导出数据备份
    exportDataBackup() {
        try {
            // 获取所有用户数据
            const backupData = {
                websites: this.dataManager.getData('websites'),
                settings: this.dataManager.getData('settings'),
                searchEngines: this.dataManager.getData('searchEngines'),
                background: this.dataManager.getData('background'),
                wallpaperSources: this.dataManager.getData('wallpaperSources'),
                currentSearchEngine: this.dataManager.getData('currentSearchEngine'),
                backupTime: new Date().toISOString()
            };

            // 将数据转换为JSON字符串
            const jsonString = JSON.stringify(backupData, null, 2);
            
            // 创建Blob对象
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `imow-backup-${new Date().toISOString().slice(0, 10)}.json`;
            
            // 触发下载
            document.body.appendChild(a);
            a.click();
            
            // 清理
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // 提示用户备份成功
            alert('数据备份成功！备份文件已下载。');
        } catch (error) {
            console.error('导出数据备份失败:', error);
            alert('导出数据备份失败，请检查浏览器控制台获取详细信息。');
        }
    }
    
    // 处理数据导入
    handleDataImport(event) {
        try {
            const file = event.target.files[0];
            if (!file) {
                return;
            }
            
            // 验证文件类型
            if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                alert('请选择有效的JSON备份文件！');
                return;
            }
            
            // 确认用户意愿
            if (!confirm('确定要导入数据吗？此操作将覆盖当前所有设置和网站数据。')) {
                // 清空文件选择
                event.target.value = '';
                return;
            }
            
            // 读取文件内容
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // 解析JSON数据
                    const importedData = JSON.parse(e.target.result);
                    
                    // 验证数据结构
                    if (!this.validateBackupData(importedData)) {
                        alert('备份文件格式不正确！请确保是从iMow新标签页导出的备份文件。');
                        return;
                    }
                    
                    // 保存数据到localStorage
                    this.saveImportedData(importedData);
                    
                    // 提示用户导入成功并刷新页面
                    alert('数据导入成功！页面将刷新以应用新设置。');
                    location.reload();
                } catch (error) {
                    console.error('解析JSON文件失败:', error);
                    alert('解析备份文件失败，请检查文件格式是否正确。');
                } finally {
                    // 清空文件选择
                    event.target.value = '';
                }
            };
            
            reader.onerror = () => {
                console.error('读取文件失败');
                alert('读取备份文件失败，请重试。');
                // 清空文件选择
                event.target.value = '';
            };
            
            reader.readAsText(file);
        } catch (error) {
            console.error('处理数据导入失败:', error);
            alert('处理数据导入失败，请检查浏览器控制台获取详细信息。');
            // 清空文件选择
            event.target.value = '';
        }
    }
    
    // 验证备份数据格式
    validateBackupData(data) {
        // 检查关键数据项
        const requiredKeys = ['websites', 'settings', 'searchEngines'];
        return requiredKeys.every(key => data.hasOwnProperty(key));
    }
    
    // 保存导入的数据
    saveImportedData(data) {
        // 保存所有数据项
        const dataKeys = ['websites', 'settings', 'searchEngines', 'background', 'wallpaperSources', 'currentSearchEngine'];
        dataKeys.forEach(key => {
            if (data.hasOwnProperty(key)) {
                this.dataManager.saveData(key, data[key]);
            }
        });
    }

    // 渲染初始数据
    renderInitialData() {
        this.websiteManager.renderWebsites();
        // 初始化搜索功能
        this.searchEngineManager.setupSearch();
    }

    // 显示设置弹窗
    showSettingsModal() {
        document.getElementById('settingsModal').style.display = 'block';
        this.renderSettings();
    }

    // 隐藏设置弹窗
    hideSettingsModal() {
        // 直接关闭模态框，不需要切换内容
        document.getElementById('settingsModal').style.display = 'none';
    }

    // 渲染设置内容
    renderSettings() {
        // 更新文字显示开关状态
        const settings = this.dataManager.getData('settings');
        const showWebsiteNamesCheckbox = document.getElementById('showWebsiteNames');
        if (showWebsiteNamesCheckbox) {
            showWebsiteNamesCheckbox.checked = settings.showWebsiteNames;
        }
        
        // 更新网站图标大小设置
        const websiteIconSizeSlider = document.getElementById('websiteIconSize');
        const iconSizeValue = document.getElementById('iconSizeValue');
        if (websiteIconSizeSlider && iconSizeValue) {
            // 与 HTML 滑块范围保持一致
            websiteIconSizeSlider.min = 80;
            websiteIconSizeSlider.max = 250;
            
            const iconSize = settings.websiteIconSize || 120;
            websiteIconSizeSlider.value = iconSize;
            iconSizeValue.textContent = formatRelativePercent(iconSize, 120);
        }
        
        // 更新文字颜色设置
        const websiteNameColorPicker = document.getElementById('websiteNameColor');
        if (websiteNameColorPicker) {
            websiteNameColorPicker.value = settings.websiteNameColor || '#ffffff';
        }
        
        // 更新搜索结果打开方式设置
        const openSearchInNewTabToggle = document.getElementById('openSearchInNewTab');
        if (openSearchInNewTabToggle) {
            openSearchInNewTabToggle.checked = settings.openSearchInNewTab || false;
        }
        
        // 更新网站打开方式设置
        const openWebsiteInNewTabToggle = document.getElementById('openWebsiteInNewTab');
        if (openWebsiteInNewTabToggle) {
            openWebsiteInNewTabToggle.checked = settings.openWebsiteInNewTab || false;
        }
        
        // 更新文字大小设置
        const websiteNameSizeSlider = document.getElementById('websiteNameSize');
        const nameSizeValue = document.getElementById('nameSizeValue');
        if (websiteNameSizeSlider && nameSizeValue) {
            const nameSize = settings.websiteNameSize || 14;
            websiteNameSizeSlider.value = nameSize;
            nameSizeValue.textContent = `${nameSize}px`;
        }
        
        // 更新翻页动画选择状态（导入备份/恢复默认后也能同步）
        const pageTransitionButtons = document.querySelectorAll('.page-transition-btn');
        const activeTransition = settings.pageTransition || 'slide';
        pageTransitionButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.transition === activeTransition);
        });

        // 更新网站布局设置
        const layout = settings.layout || { rows: 2, columns: 5 };
        
        // 更新搜索框设置
        const radiusSlider = document.getElementById('searchBoxRadius');
        const radiusValue = document.getElementById('radiusValue');
        const opacitySlider = document.getElementById('searchBoxOpacity');
        const opacityValue = document.getElementById('opacityValue');
        const heightSlider = document.getElementById('searchBoxHeight');
        const heightValue = document.getElementById('heightValue');
        const widthSlider = document.getElementById('searchBoxWidth');
        const widthValue = document.getElementById('widthValue');
        const blurSlider = document.getElementById('searchBoxBlur');
        const blurValue = document.getElementById('blurValue');
        
        // 更新圆角滑块和数值
        if (radiusSlider && radiusValue) {
            const radius = settings.searchBoxRadius ?? 40;
            radiusSlider.value = radius;
            radiusValue.textContent = formatRelativePercent(radius, 40);
        }
        
        // 更新透明度滑块和数值
        if (opacitySlider && opacityValue) {
            const opacity = settings.searchBoxOpacity ?? 30;
            opacitySlider.value = opacity;
            opacityValue.textContent = `${opacity}%`;
        }
        
        // 更新高度滑块和数值
        if (heightSlider && heightValue) {
            const height = settings.searchBoxHeight ?? 65;
            heightSlider.value = height;
            heightValue.textContent = formatRelativePercent(height, 65);
        }
        
        // 更新宽度滑块和数值
        if (widthSlider && widthValue) {
            const width = settings.searchBoxWidth ?? 35;
            widthSlider.value = width;
            widthValue.textContent = `${width}%`;
        }
        
        // 更新模糊度滑块和数值
        if (blurSlider && blurValue) {
            const blur = settings.searchBoxBlur ?? 22;
            blurSlider.value = blur;
            blurValue.textContent = `${blur}px`;
        }
        
        // 更新位置调整滑块与数值（并同步当前偏移）
        const searchOffsetSlider = document.getElementById('searchOffsetY');
        const searchOffsetValue = document.getElementById('searchOffsetYValue');
        const iconsOffsetSlider = document.getElementById('iconsOffsetY');
        const iconsOffsetValue = document.getElementById('iconsOffsetYValue');
        const searchOffset = this.clampLayoutOffset(settings.layout?.searchOffsetY ?? 0);
        const iconsOffset = this.clampLayoutOffset(settings.layout?.iconsOffsetY ?? 0);
        if (searchOffsetSlider && searchOffsetValue) {
            searchOffsetSlider.value = searchOffset;
            searchOffsetValue.textContent = formatOffsetPercent(searchOffset);
        }
        if (iconsOffsetSlider && iconsOffsetValue) {
            iconsOffsetSlider.value = iconsOffset;
            iconsOffsetValue.textContent = formatOffsetPercent(iconsOffset);
        }
        this.applyLayoutOffsets(searchOffset, iconsOffset);
        
        // 更新网站间距滑块和数值
        // 初始化网站列间距滑块
        const websiteColumnGapSlider = document.getElementById('websiteColumnGap');
        const websiteColumnGapValue = document.getElementById('websiteColumnGapValue');
        if (websiteColumnGapSlider && websiteColumnGapValue) {
            const columnGap = settings.layout?.columnGap || 105;
            websiteColumnGapSlider.value = columnGap;
            websiteColumnGapValue.textContent = formatRelativePercent(columnGap, 105);
        }
        
        // 初始化网站行间距滑块
        const websiteRowGapSlider = document.getElementById('websiteRowGap');
        const websiteRowGapValue = document.getElementById('websiteRowGapValue');
        if (websiteRowGapSlider && websiteRowGapValue) {
            const rowGap = settings.layout?.rowGap || 58;
            websiteRowGapSlider.value = rowGap;
            websiteRowGapValue.textContent = formatRelativePercent(rowGap, 58);
        }
        
        // 渲染壁纸源选择器
        this.renderWallpaperSourceSelector();
        
        // 设置当前壁纸缩略图
        this.updateCurrentWallpaperThumbnail();
        
        // 设置下载按钮事件监听
        this.setupDownloadButtonListener();
    }
    
    // 更新当前壁纸缩略图
    updateCurrentWallpaperThumbnail() {
        const background = this.backgroundManager.background;
        const thumbnail = document.getElementById('currentWallpaperThumbnail');
        if (thumbnail) {
            if (background.image) {
                thumbnail.src = background.image;
                thumbnail.style.display = 'block';
            } else {
                thumbnail.style.display = 'none';
            }
        }
    }
    
    // 设置下载按钮事件监听
    setupDownloadButtonListener() {
        const downloadBtn = document.getElementById('downloadWallpaperBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadWallpaper();
            });
        }
    }
    
    // 下载当前壁纸
    async downloadWallpaper() {
        // 优先使用内存中的当前壁纸，保证与页面显示一致
        let imageUrl = this.backgroundManager.background.image || null;
        
        if (imageUrl) {
            console.log('Downloading wallpaper from:', imageUrl);
            
            // 尝试使用浏览器下载API
            if (typeof chrome !== 'undefined' && chrome.downloads && chrome.downloads.download) {
                try {
                    chrome.downloads.download({
                        url: imageUrl,
                        filename: `wallpaper_${Date.now()}.jpg`,
                        saveAs: true
                    }, (downloadId) => {
                        if (chrome.runtime.lastError) {
                            console.log('浏览器下载API错误，在新标签页中打开');
                            window.open(imageUrl, '_blank');
                        } else {
                            console.log('Download started successfully, downloadId:', downloadId);
                        }
                    });
                } catch (error) {
                    console.log('浏览器下载API异常，在新标签页中打开:', error);
                    window.open(imageUrl, '_blank');
                }
            } else {
                // 如果浏览器API不可用，直接在新标签页打开
                console.log('浏览器下载API不可用，在新标签页中打开');
                window.open(imageUrl, '_blank');
            }
        } else {
            console.log('No wallpaper URL available for download');
        }
    }
    
    // 渲染壁纸源选择器
    renderWallpaperSourceSelector() {
        const settings = this.dataManager.getData('settings');
        const wallpaperSource = document.getElementById('wallpaperSource');
        const customWallpaperSource = document.getElementById('customWallpaperSource');
        const customWallpaperUrl = document.getElementById('customWallpaperUrl');
        
        if (wallpaperSource) {
            // 清空现有选项
            wallpaperSource.innerHTML = '';
            
            // 添加壁纸源选项
            settings.wallpaper.sources.forEach(source => {
                const option = document.createElement('option');
                option.value = source.id;
                option.textContent = source.name;
                wallpaperSource.appendChild(option);
            });
            
            // 设置当前选择
            wallpaperSource.value = settings.wallpaper.source;
        }
        
        // 设置自定义壁纸源URL
        if (customWallpaperUrl) {
            const customSource = settings.wallpaper.sources.find(source => source.id === 'custom');
            customWallpaperUrl.value = customSource ? customSource.url : '';
        }
    }

    // 处理网站表单提交
    async handleWebsiteFormSubmit() {
        const form = document.getElementById('websiteForm');
        const iconInput = document.getElementById('websiteIcon');
        const iconStatus = document.getElementById('iconStatus');
        const iconValue = iconInput.value.trim();

        // 用户已点保存：作废仍在进行的自动抓取，避免其异步结果回写名称/图标
        this.websiteManager.siteInfoSeq = (this.websiteManager.siteInfoSeq || 0) + 1;
        this.websiteManager.iconFetchSeq = (this.websiteManager.iconFetchSeq || 0) + 1;

        // 手动输入且尚未校验过的图标，保存前必须通过真实加载校验
        if (iconValue && iconValue !== form.dataset.iconValidatedValue) {
            if (iconStatus) {
                iconStatus.innerHTML = '<span style="color: #4285f4;">正在校验图标地址...</span>';
            }
            try {
                const result = await this.websiteManager.validateIconUrl(iconValue, 6000);
                form.dataset.iconValidatedValue = iconValue;
                form.dataset.iconResolvedValue = result.value;
                delete form.dataset.iconError;
            } catch (error) {
                delete form.dataset.iconResolvedValue;
                form.dataset.iconError = error.message;
                if (iconStatus) {
                    iconStatus.innerHTML = `<span style="color: #ea4335;">图标地址不可用：${error.message}，请修正后再保存</span>`;
                }
                iconInput.focus();
                this.websiteManager.updateIconPreview(iconValue);
                return;
            }
        }
        
        // 获取底色，透明底色特殊处理
        const currentBgColor = document.getElementById('currentBgColor').textContent;
        
        const websiteData = {
            name: document.getElementById('websiteName').value,
            url: document.getElementById('websiteUrl').value,
            // 优先保存校验时解析出的 DataURL，避免跨域/防盗链导致图标后续加载失败
            icon: form.dataset.iconResolvedValue || iconValue,
            // 添加图标编辑选项
            iconSize: parseInt(document.getElementById('iconSize').value), // 保存单个网站的图标缩放比例
            iconBgColor: currentBgColor
        };

        const editId = form.dataset.editId;
        if (editId) {
            // 编辑模式：写入数据后必须重绘主界面
            // 名称、网址（点击链接闭包）、图标大小/底色都来自渲染时的快照，
            // 只更新数据不会反映到 DOM（此前因此出现“保存成功但主界面名称不变”）
            this.websiteManager.updateWebsite(parseInt(editId), websiteData);
            this.websiteManager.renderWebsites();
        } else {
            // 添加模式
            this.websiteManager.addWebsite(websiteData);
            this.websiteManager.renderWebsites();
        }
        
        // 提交成功：丢弃编辑快照，避免关闭面板时把刚保存的数据回滚
        this.websiteManager.editSnapshot = null;
        this.websiteManager.hideAddWebsiteModal();
    }

    // 处理引擎表单提交
    handleEngineFormSubmit() {
        const form = document.getElementById('engineForm');
        // 提交即作废在途自动抓取，避免异步结果覆盖用户提交值
        this.searchEngineManager.engineInfoSeq = (this.searchEngineManager.engineInfoSeq || 0) + 1;
        const engineData = {
            name: document.getElementById('engineName').value,
            url: document.getElementById('engineUrl').value,
            icon: document.getElementById('engineIcon').value || '' // 添加自定义图标字段
        };

        const editId = form.dataset.editId;
        if (editId) {
            // 编辑模式
            this.searchEngineManager.updateEngine(parseInt(editId), engineData);
        } else {
            // 添加模式
            this.searchEngineManager.addEngine(engineData);
        }
        
        this.searchEngineManager.hideAddEngineModal();
    }


    
    // 设置布局预设按钮事件监听
    setupLayoutPresetEvents() {
        const presetBtns = document.querySelectorAll('.layout-preset-btn');
        const customBtn = document.getElementById('customLayoutBtn');
        
        // 只在找到预设按钮时才设置事件监听器
        if (presetBtns.length > 0) {
            // 保存当前实例的引用
            const self = this;
            
            presetBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // 检查是否是自定义按钮
                    if (btn.id === 'customLayoutBtn') {
                        // 自定义按钮点击事件 - 打开弹窗
                        self.showCustomLayoutModal();
                    } else {
                        // 普通预设按钮点击事件
                        const rows = parseInt(btn.dataset.rows);
                        const columns = parseInt(btn.dataset.columns);
                        self.updateLayout(rows, columns);
                        
                        // 更新按钮状态
                        presetBtns.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                    }
                });
            });
            
            // 根据当前布局激活对应的预设按钮
            const settings = this.dataManager.getData('settings');
            const layout = settings.layout || { rows: 2, columns: 5 };
            const targetBtn = Array.from(presetBtns).find(btn => 
                btn.dataset.rows == layout.rows && btn.dataset.columns == layout.columns
            );
            
            if (targetBtn) {
                presetBtns.forEach(b => b.classList.remove('active'));
                targetBtn.classList.add('active');
            } else if (customBtn) {
                // 如果没有匹配的预设，激活自定义按钮
                presetBtns.forEach(b => b.classList.remove('active'));
                customBtn.classList.add('active');
            }
        }
        
        // 尝试设置自定义布局弹窗事件，但添加try-catch保护
        try {
            // 设置自定义布局弹窗事件
            this.setupCustomLayoutModalEvents();
        } catch (error) {
            console.error('Error setting up custom layout modal events:', error);
        }
    }
    
    // 设置自定义布局事件
    setupCustomLayoutModalEvents() {
        // 此函数已废弃，事件监听器现在在showCustomLayoutModal函数中设置
    }
    
    // 显示自定义布局内容
    showCustomLayoutModal() {
        // 确保设置窗口已经显示
        document.getElementById('settingsModal').style.display = 'block';
        
        // 获取当前布局设置
        const settings = this.dataManager.getData('settings');
        const layout = settings.layout || { rows: 2, columns: 5 };
        
        // 设置输入框初始值
        const rowsInput = document.getElementById('customRows');
        const columnsInput = document.getElementById('customColumns');
        rowsInput.value = layout.rows;
        columnsInput.value = layout.columns;
        
        // 切换到自定义布局内容
        this.switchToCustomLayoutContent();
    }
    
    // 隐藏自定义布局内容，返回设置主界面
    hideCustomLayoutModal() {
        // 重置表单数据
        document.getElementById('customLayoutForm').reset();
        
        // 返回设置主界面
        // 确保只切换内容显示，不关闭设置模态框
        const settingsMainContent = document.getElementById('settings-main-content');
        const customLayoutContent = document.getElementById('settings-custom-layout-content');
        
        // 更新标题
        document.getElementById('settingsTitle').textContent = '设置';
        
        // 切换内容显示
        settingsMainContent.classList.add('active');
        customLayoutContent.classList.remove('active');
    }
    
    // 切换到自定义布局内容
    switchToCustomLayoutContent() {
        // 不显示返回按钮
        
        // 更新标题
        document.getElementById('settingsTitle').textContent = '自定义布局';
        
        // 切换内容显示
        document.getElementById('settings-main-content').classList.remove('active');
        document.getElementById('settings-website-content').classList.remove('active');
        document.getElementById('settings-custom-layout-content').classList.add('active');
    }
    
    // 保存自定义布局
    saveCustomLayout() {
        const rows = parseInt(document.getElementById('customRows').value);
        const columns = parseInt(document.getElementById('customColumns').value);
        
        if (!isNaN(rows) && !isNaN(columns) && rows >= 1 && rows <= 5 && columns >= 3 && columns <= 8) {
            this.updateLayout(rows, columns);
            
            // 更新按钮状态
            const presetBtns = document.querySelectorAll('.layout-preset-btn');
            const customBtn = document.getElementById('customLayoutBtn');
            presetBtns.forEach(btn => btn.classList.remove('active'));
            customBtn.classList.add('active');
            
            // 关闭弹窗
            this.hideCustomLayoutModal();
        } else {
            alert('请输入有效的数值：行数1-5，每行网站数量3-8');
        }
    }
    
    // 更新布局
    updateLayout(rows, columns) {
        // 验证范围
        if (rows < 1 || rows > 5 || columns < 3 || columns > 8) {
            return;
        }
        
        const settings = this.dataManager.getData('settings');
        // 保留已有间距设置，避免切换布局后间距被重置为 undefined
        const previousLayout = settings.layout || {};
        settings.layout = {
            ...previousLayout,
            rows: rows,
            columns: columns
        };
        this.dataManager.saveData('settings', settings);
        this.websiteManager.renderWebsites();
    }
    
    // 处理壁纸源变化 - 确保切换后立即生效
    handleWallpaperSourceChange(sourceId) {
        console.log(`开始切换壁纸源到${sourceId}`);
        
        // 更新settings中的壁纸源
        const settings = this.dataManager.getData('settings');
        settings.wallpaper.source = sourceId;
        this.dataManager.saveData('settings', settings);
        
        // 更新BackgroundManager实例中的currentSourceId属性
        this.backgroundManager.currentSourceId = sourceId;
        // 切换源时清除上一次的失败提示
        this.backgroundManager.clearWallpaperStatus();
        
        // 检查localStorage中是否已经有与新壁纸源关联的保存壁纸
        const storedBackgrounds = localStorage.getItem('backgrounds');
        let hasSavedWallpaper = false;
        
        if (storedBackgrounds) {
            try {
                const parsedData = JSON.parse(storedBackgrounds);
                // 检查是否有与新壁纸源关联的保存壁纸
                if (parsedData && parsedData[sourceId] && parsedData[sourceId].image && parsedData[sourceId].image.trim() !== '') {
                    console.log(`切换壁纸源到${sourceId}，使用已保存的壁纸`);
                    // 直接应用保存的壁纸
                    this.backgroundManager.background.image = parsedData[sourceId].image;
                    this.backgroundManager.background.color = parsedData[sourceId].color || 'transparent';
                    // 恢复该源自己的元数据，切换回来后“换一张”才能避开当前这张
                    this.backgroundManager.backgroundMeta = parsedData[sourceId].meta || null;
                    this.backgroundManager.applyBackground();
                    this.backgroundManager.updateWallpaperThumbnail();
                    hasSavedWallpaper = true;
                    return;
                }
            } catch (error) {
                console.error('解析localStorage中的壁纸数据失败:', error);
            }
        }
        
        // 如果没有保存的壁纸，直接从新壁纸源获取一张，确保切换立即可见
        if (!hasSavedWallpaper) {
            console.log(`切换壁纸源到${sourceId}，没有保存的壁纸，开始获取新壁纸`);
            // 切到新源时取该源的第一张，不做轮换
            this.backgroundManager.getRandomWallpaper({ rotate: false });
        }
    }
    
    // 更新自定义壁纸URL
    updateCustomWallpaperUrl(url) {
        const settings = this.dataManager.getData('settings');
        const customSource = settings.wallpaper.sources.find(source => source.id === 'custom');
        if (customSource) {
            customSource.url = url;
            this.dataManager.saveData('settings', settings);
        }
    }
    
    // 更新网站图标大小
    updateWebsiteIconSize(size) {
        // 验证图标大小在有效范围内（80-250px）
        const validSize = Math.max(80, Math.min(250, size));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        settings.websiteIconSize = validSize;
        this.dataManager.saveData('settings', settings);
        
        // 重新渲染网站，应用新的图标大小
        this.websiteManager.renderWebsites();
    }
    
    // 更新文字颜色
    updateWebsiteNameColor(color) {
        // 更新设置
        const settings = this.dataManager.getData('settings');
        settings.websiteNameColor = color;
        this.dataManager.saveData('settings', settings);
        
        // 重新渲染网站，应用新的名称颜色
        this.websiteManager.renderWebsites();
    }
    
    // 更新文字大小
    updateWebsiteNameSize(size) {
        // 验证名称大小在有效范围内
        const validSize = Math.max(8, Math.min(24, size));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        settings.websiteNameSize = validSize;
        this.dataManager.saveData('settings', settings);
        
        // 重新渲染网站，应用新的名称大小
        this.websiteManager.renderWebsites();
    }
    
    // 更新网站列间距
    updateWebsiteColumnGap(gap) {
        // 验证间距值在有效范围内
        const validGap = Math.max(1, Math.min(200, gap));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        if (!settings.layout) {
            settings.layout = { rows: 2, columns: 6, rowGap: 58 };
        }
        settings.layout.columnGap = validGap;
        this.dataManager.saveData('settings', settings);
        
        // 重新渲染网站网格，应用新的间距设置
        this.websiteManager.renderWebsites();
    }
    
    // 更新网站行间距
    updateWebsiteRowGap(gap) {
        // 验证间距值在有效范围内
        const validGap = Math.max(1, Math.min(200, gap));
        
        // 更新设置
        const settings = this.dataManager.getData('settings');
        if (!settings.layout) {
            settings.layout = { rows: 2, columns: 6, columnGap: 105 };
        }
        settings.layout.rowGap = validGap;
        this.dataManager.saveData('settings', settings);
        
        // 重新渲染网站网格，应用新的间距设置
        this.websiteManager.renderWebsites();
    }
    

    
    // 显示编辑壁纸源弹窗
    showEditWallpaperSourceModal() {
        const modal = document.getElementById('editWallpaperSourceModal');
        this.renderWallpaperSourcesList();
        modal.style.display = 'block';
    }
    
    // 隐藏编辑壁纸源弹窗
    hideEditWallpaperSourceModal() {
        const modal = document.getElementById('editWallpaperSourceModal');
        modal.style.display = 'none';
    }
    
    // 渲染壁纸源列表
    renderWallpaperSourcesList() {
        const settings = this.dataManager.getData('settings');
        const sources = settings.wallpaper.sources;
        const container = document.getElementById('wallpaperSourcesList');
        
        container.innerHTML = '';
        
        sources.forEach((source, index) => {
            const sourceItem = document.createElement('div');
            sourceItem.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px;
                margin-bottom: 10px;
                background: #f9f9f9;
                border-radius: 8px;
                border: 1px solid #ddd;
            `;
            
            const sourceInfo = document.createElement('div');
            sourceInfo.style.cssText = `
                flex: 1;
            `;
            
            const sourceName = document.createElement('div');
            sourceName.style.cssText = `
                font-weight: bold;
                margin-bottom: 4px;
            `;
            sourceName.textContent = source.name;
            
            const sourceActions = document.createElement('div');
            sourceActions.style.cssText = `
                display: flex;
                gap: 8px;
                margin-left: 10px;
            `;
            
            // 编辑按钮：仅自定义壁纸源可编辑，内置源统一使用中文名称
            const editBtn = document.createElement('button');
            if (source.id.startsWith('custom')) {
                editBtn.textContent = '编辑';
                editBtn.style.cssText = `
                    padding: 6px 12px;
                    background: #4285f4;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                `;
                editBtn.addEventListener('click', () => {
                    this.editWallpaperSource(source.id);
                });
            }
            
            // 删除按钮（所有壁纸源都可删除）
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '删除';
            deleteBtn.style.cssText = `
                padding: 6px 12px;
                background: #ea4335;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                opacity: 1;
                pointer-events: auto;
            `;
            deleteBtn.addEventListener('click', () => {
                this.deleteWallpaperSource(source.id);
            });
            
            sourceInfo.appendChild(sourceName);
            if (source.id.startsWith('custom')) {
                sourceActions.appendChild(editBtn);
            }
            sourceActions.appendChild(deleteBtn);
            sourceItem.appendChild(sourceInfo);
            sourceItem.appendChild(sourceActions);
            
            container.appendChild(sourceItem);
        });
        
        // 添加“添加壁纸源”按钮
        const addBtn = document.createElement('button');
        addBtn.textContent = '+ 添加壁纸源';
        addBtn.style.cssText = `
            width: 100%;
            padding: 10px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            transition: all 0.3s ease;
        `;
        addBtn.addEventListener('mouseover', () => {
            addBtn.style.background = '#3367d6';
            addBtn.style.transform = 'translateY(-2px)';
        });
        addBtn.addEventListener('mouseout', () => {
            addBtn.style.background = '#4285f4';
            addBtn.style.transform = 'translateY(0)';
        });
        addBtn.addEventListener('click', () => {
            this.showAddWallpaperSourceModal();
        });
        container.appendChild(addBtn);
    }
    
    // 编辑壁纸源
    editWallpaperSource(sourceId) {
        const settings = this.dataManager.getData('settings');
        const source = settings.wallpaper.sources.find(s => s.id === sourceId);
        
        if (source) {
            // 显示单个壁纸源编辑弹窗
            this.showSingleWallpaperSourceEditModal(source);
        }
    }
    
    // 显示单个壁纸源编辑弹窗
    showSingleWallpaperSourceEditModal(source) {
        // 保存当前编辑的源ID到实例变量
        this.currentEditingSourceId = source.id;
        
        // 填充表单数据
        document.getElementById('editSourceName').value = source.name;
        document.getElementById('editSourceUrl').value = source.url;
        
        // 显示弹窗
        const modal = document.getElementById('singleWallpaperSourceEditModal');
        modal.style.display = 'block';
    }
    
    // 隐藏单个壁纸源编辑弹窗
    hideSingleWallpaperSourceModal() {
        const modal = document.getElementById('singleWallpaperSourceEditModal');
        modal.style.display = 'none';
        // 清空当前编辑的源ID
        this.currentEditingSourceId = null;
    }
    
    // 处理单个壁纸源编辑表单提交
    handleSingleWallpaperSourceEditSubmit() {
        const settings = this.dataManager.getData('settings');
        const source = settings.wallpaper.sources.find(s => s.id === this.currentEditingSourceId);
        
        if (source) {
            // 获取表单数据
            const name = document.getElementById('editSourceName').value.trim();
            const url = document.getElementById('editSourceUrl').value.trim();
            
            if (name && url) {
                // 更新源数据
                source.name = name;
                source.url = url;
                
                // 保存设置
                this.dataManager.saveData('settings', settings);
                
                // 关闭弹窗
                this.hideSingleWallpaperSourceModal();
                
                // 更新壁纸源列表
                this.renderWallpaperSourcesList();
                
                // 重新渲染壁纸源选择器
                this.renderWallpaperSourceSelector();
            }
        }
    }
    
    // 显示添加新壁纸源弹窗
    showAddWallpaperSourceModal() {
        const modal = document.getElementById('addWallpaperSourceModal');
        modal.style.display = 'block';
    }
    
    // 隐藏添加新壁纸源弹窗
    hideAddWallpaperSourceModal() {
        const modal = document.getElementById('addWallpaperSourceModal');
        modal.style.display = 'none';
        // 重置表单
        document.getElementById('addWallpaperSourceForm').reset();
    }
    
    // 处理添加新壁纸源表单提交
    handleAddWallpaperSourceSubmit() {
        const settings = this.dataManager.getData('settings');
        
        // 获取表单数据
        const name = document.getElementById('newSourceName').value.trim();
        const url = document.getElementById('newSourceUrl').value.trim();
        
        if (name && url) {
            // 创建新的壁纸源对象
            const newSource = {
                id: `custom-${Date.now()}`, // 生成唯一ID
                name: name,
                url: url,
                type: 'random'
            };
            
            // 添加到壁纸源列表
            settings.wallpaper.sources.push(newSource);
            
            // 设置为当前使用的壁纸源
            settings.wallpaper.source = newSource.id;
            
            // 保存设置
            this.dataManager.saveData('settings', settings);
            
            // 关闭弹窗
            this.hideAddWallpaperSourceModal();
            
            // 重新渲染壁纸源选择器
            this.renderWallpaperSourceSelector();
            
            // 同步当前源，并立即获取一张新壁纸
            this.backgroundManager.currentSourceId = newSource.id;
            this.backgroundManager.getRandomWallpaper();
        }
    }
    
    // 删除壁纸源
    deleteWallpaperSource(sourceId) {
        const settings = this.dataManager.getData('settings');
        const source = settings.wallpaper.sources.find(s => s.id === sourceId);
        
        if (source) {
            const confirmDelete = confirm(`确定要删除壁纸源"${source.name}"吗？`);
            if (confirmDelete) {
                // 从列表中移除
                settings.wallpaper.sources = settings.wallpaper.sources.filter(s => s.id !== sourceId);
                
                // 如果当前使用的是被删除的源，切换到默认源
                if (settings.wallpaper.source === sourceId) {
                    // 如果还有剩余的源，使用第一个，否则使用默认源
                    settings.wallpaper.source = settings.wallpaper.sources.length > 0 ? settings.wallpaper.sources[0].id : 'bingdaily';
                }
                
                this.dataManager.saveData('settings', settings);
                this.renderWallpaperSourcesList();
                // 重新渲染壁纸源选择器
                this.renderWallpaperSourceSelector();
            }
        }
    }
}

// 移除重复的toggleEngineDropdown函数和冲突的事件监听器
// 保留第1-21行定义的toggleEngineDropdown函数，使用CSS类来控制下拉列表的显示和隐藏

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // DOMContentLoaded 已保证 DOM 就绪，立即初始化：
    // 之前的 100ms 延迟 + 150ms 首屏动画会让图标在刷新后约 0.25~1 秒才出现，造成"闪一下"
    const app = new NewTabApp();
    
    // 显式调用一次网站渲染，确保网站能显示
    app.websiteManager.renderWebsites();
    
    // 一次性添加所有事件监听器，确保DOM已经完全加载
    setupAllEventListeners(app);

    // 滑块精确操作：数值可直接编辑、键盘可微调（不改变各滑块的 ID / 范围 / 持久化字段）
    setupPreciseSliderControls();
});

// 设置面板滑块：点击数值直接输入 + 键盘微调
// - 数值列按"当前显示单位"输入（% / px），提交时换算回滑块原始值并做范围钳制、按步长对齐
// - 整数滑块保留浏览器原生方向键（±1 步长），Home/End 到极值
// - 小数滑块（上下位置）：方向键 ±0.5，Shift+方向键 ±0.1，避免 1px 拖动跨度过大
function setupPreciseSliderControls() {
    const sliders = document.querySelectorAll('#settingsModal input[type="range"]');

    sliders.forEach((slider) => {
        if (slider.dataset.preciseReady === '1') return;
        slider.dataset.preciseReady = '1';

        const step = Number(slider.step) || 1;
        const isFineStep = step > 0 && step < 1;

        if (isFineStep) {
            slider.addEventListener('keydown', (e) => {
                const dirs = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 };
                const dir = dirs[e.key];
                if (!dir) return;
                e.preventDefault();
                const delta = (e.shiftKey ? step : step * 5) * dir;
                const min = Number(slider.min);
                const max = Number(slider.max);
                const next = Math.min(max, Math.max(min, Math.round((Number(slider.value) + delta) * 10) / 10));
                if (String(next) === String(slider.value)) return;
                slider.value = String(next);
                slider.dispatchEvent(new Event('input', { bubbles: true }));
            });
        }

        const valueEl = slider.parentElement ? slider.parentElement.querySelector('.setting-value') : null;
        if (!valueEl) return;

        valueEl.setAttribute('contenteditable', 'true');
        valueEl.setAttribute('role', 'textbox');
        valueEl.setAttribute('inputmode', 'decimal');
        valueEl.setAttribute('spellcheck', 'false');
        valueEl.setAttribute('title', '点击输入精确数值，回车或失焦生效');
        valueEl.classList.add('setting-value--editable');

        // 显示值 → 滑块真实值的换算系数（如 100% 对应 105px 时系数为 100/105）
        let scale = 1;
        const readNumber = (text) => {
            const match = String(text).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
            return match ? Number(match[0]) : NaN;
        };

        valueEl.addEventListener('focus', () => {
            const shown = readNumber(valueEl.textContent);
            const actual = Number(slider.value);
            scale = (Number.isFinite(shown) && shown !== 0 && Number.isFinite(actual) && actual !== 0)
                ? shown / actual
                : 1;
            // 编辑时显示原始数值，避免 % / px 后缀干扰输入
            valueEl.textContent = String(actual);
            const range = document.createRange();
            range.selectNodeContents(valueEl);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });

        const commitValue = () => {
            const typed = readNumber(valueEl.textContent);
            if (!Number.isFinite(typed)) {
                // 非法输入：让原监听器重绘当前值
                slider.dispatchEvent(new Event('input', { bubbles: true }));
                return;
            }
            const min = Number(slider.min);
            const max = Number(slider.max);
            const unit = Number(slider.step) || 1;
            let actual = typed / (scale || 1);
            actual = Math.min(max, Math.max(min, actual));
            actual = Math.round(actual / unit) * unit;
            actual = Math.min(max, Math.max(min, Number(actual.toFixed(4))));
            slider.value = String(actual);
            // 走原有 input 处理器：更新显示文本、持久化并应用样式
            slider.dispatchEvent(new Event('input', { bubbles: true }));
        };

        valueEl.addEventListener('blur', commitValue);
        valueEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                valueEl.blur();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                slider.dispatchEvent(new Event('input', { bubbles: true }));
                valueEl.blur();
            }
        });
    });
}

// 一次性添加所有事件监听器的函数
function setupAllEventListeners(app) {
    console.log('Setting up all event listeners...');
    
    // 获取自定义布局相关按钮
    const cancelCustomLayoutBtn = document.getElementById('cancelCustomLayout');
    const saveCustomLayoutBtn = document.getElementById('saveCustomLayout');
    const customLayoutBtn = document.getElementById('customLayoutBtn');
    
    // 获取添加网站相关按钮
    const cancelAddWebsiteBtn = document.getElementById('cancelAddWebsite');
    
    console.log('cancelCustomLayoutBtn:', cancelCustomLayoutBtn);
    console.log('saveCustomLayoutBtn:', saveCustomLayoutBtn);
    console.log('customLayoutBtn:', customLayoutBtn);
    console.log('cancelAddWebsiteBtn:', cancelAddWebsiteBtn);
    

    
    // 添加网站取消按钮点击事件
    if (cancelAddWebsiteBtn) {
        cancelAddWebsiteBtn.addEventListener('click', () => {
            console.log('Cancel add website button clicked!');
            app.websiteManager.hideAddWebsiteModal();
        });
    }
    
    // 自定义布局按钮点击事件
    if (customLayoutBtn) {
        customLayoutBtn.addEventListener('click', () => {
            console.log('Custom layout button clicked!');
            app.showCustomLayoutModal();
        });
    }
    
    // 自定义布局取消按钮点击事件
    if (cancelCustomLayoutBtn) {
        cancelCustomLayoutBtn.addEventListener('click', () => {
            console.log('Cancel custom layout button clicked!');
            app.hideCustomLayoutModal();
        });
    }
    
    // 自定义布局保存按钮点击事件
    if (saveCustomLayoutBtn) {
        saveCustomLayoutBtn.addEventListener('click', () => {
            console.log('Save custom layout button clicked!');
            app.saveCustomLayout();
        });
    }
    
    console.log('All event listeners setup complete!');
}