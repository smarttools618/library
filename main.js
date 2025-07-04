// JavaScript for Al Maktaba Project

let allDocumentaries = [];
// --- Global State ---
let currentUILanguage = 'ar'; // Default UI language
let state = { category: 'all', videoLang: 'all', channel: 'all', search: '', order: 'new' };
// --- Infinite Scroll State ---
let currentFilteredVideos = [];
let currentPage = 1;
const videosPerPage = 12;
let isLoading = false;
let isAppInitialized = false;

// --- Translation Dictionary ---
const translations = {
    ar: {
        pageTitle: "المكتبة",
        logoText: "المكتبة",
        languageBtn: "العربية",
        helpBtnLabel: "مساعدة و تواصل",
        instructionsBtnLabel: "تعليمات",
        resetFilters: "إعادة تعيين الفلاتر",
        videoCountLabel: "عدد الوثائقيات",
        searchPlaceholder: "ابحث عن وثائقي...",
        filterByCategoryTitle: "تصفية حسب التصنيف",
        resetFiltersTitle: "إعادة تعيين الفلاتر",
        changeLangTitle: "لغة الفيديو",
        filterByChannelTitle: "اختيار القناة",
        contactUs: "تواصل معنا",
        contactUsPrompt: "لأية استفسارات أو اقتراحات، يمكنكم التواصل معنا عبر:",
        facebookPage: "صفحتنا على فيسبوك",
        noResultsFound: "لا توجد نتائج تطابق بحثك.",
        noResultsReset: "إعادة تعيين الفلاتر",
        orderNewest: "الأحدث",
        orderOldest: "الأقدم",
        allCategories: "كل التصنيفات",
        allChannels: "كل القنوات",
        allLangs: "كل اللغات",
        category_history: "التاريخ",
        category_science: "العلوم",
        category_technology: "التقنية",
        category_nature: "الطبيعة والحياة البرية",
        category_cars: "السيارات",
        category_society: "مجتمعات وثقافات",
        channel_dw: "وثائقية DW",
        channel_natgeo: "ناشيونال جيوغرافيك أبوظبي",
        channel_netflix: "Netflix",
        filterBy: "تصفية حسب",
        summaryCategory: "التصنيف",
        summaryVideoLang: "لغة الفيديو",
        summaryChannel: "القناة",
        summaryOrder: "الترتيب",
        orderNew: "الأحدث أولاً",
        orderOld: "الأقدم أولاً",
        disclaimerTitle: "تنويه هام",
        disclaimerText: "موقع \"المكتبة\" هو مُجمِّع للمحتوى الوثائقي المتاح للعموم. الآراء الواردة في الفيديوهات تخص صانعيها فقط ولا تعبر عن وجهة نظرنا. جميع الحقوق محفوظة لأصحابها الأصليين.",
        disclaimerOk: "موافق",
        instructionsModalTitle: "كيفية الاستخدام",
        instructionsDesktopTitle: "واجهة سطح المكتب",
        instructionsDesktop1: "استخدم الشريط الجانبي على اليمين للتصفية حسب التصنيف أو لغة الفيديو.",
        instructionsDesktop2: "استخدم شريط البحث وأزرار القنوات لتخصيص بحثك.",
        instructionsDesktop3: "رتّب النتائج باستخدام أزرار \"الأحدث\" و \"الأقدم\".",
        instructionsMobileTitle: "واجهة الجوال",
        instructionsMobile1: "استخدم الأزرار العائمة في أسفل اليمين:",
        instructionsMobileFilter: "تصفية حسب التصنيف",
        instructionsMobileLang: "تصفية حسب لغة الفيديو",
        instructionsMobileChannel: "تصفية حسب القناة",
        instructionsMobileReset: "إعادة تعيين كل الفلاتر",
        instructionsMobile2: "يظهر شريط البحث وأزرار الترتيب في أعلى المحتوى.",
        donateBtnText: "ادعمنا – تبرع"
    },
    en: {
        pageTitle: "The Library",
        logoText: "The Library",
        languageBtn: "English",
        helpBtnLabel: "Help & Contact",
        instructionsBtnLabel: "Instructions",
        resetFilters: "Reset Filters",
        videoCountLabel: "Documentaries",
        searchPlaceholder: "Search for a documentary...",
        filterByCategoryTitle: "Filter by Category",
        resetFiltersTitle: "Reset Filters",
        changeLangTitle: "Video Language",
        filterByChannelTitle: "Filter by Channel",
        contactUs: "Contact Us",
        contactUsPrompt: "For any inquiries or suggestions, you can contact us via:",
        facebookPage: "Our Facebook Page",
        noResultsFound: "No results match your search.",
        noResultsReset: "Reset Filters",
        orderNewest: "Newest",
        orderOldest: "Oldest",
        allCategories: "All Categories",
        allChannels: "All Channels",
        allLangs: "All Languages",
        category_history: "History",
        category_science: "Science",
        category_technology: "Technology",
        category_nature: "Nature & Wildlife",
        category_cars: "Cars",
        category_society: "Society & Cultures",
        channel_dw: "DW Documentary",
        channel_natgeo: "National Geographic Abu Dhabi",
        channel_netflix: "Netflix",
        filterBy: "Filter by",
        summaryCategory: "Category",
        summaryVideoLang: "Video Lang",
        summaryChannel: "Channel",
        summaryOrder: "Order",
        orderNew: "Newest First",
        orderOld: "Oldest First",
        disclaimerTitle: "Important Disclaimer",
        disclaimerText: "\"The Library\" only aggregates publicly available documentaries. Opinions in the videos belong to their creators and do not represent our views. All rights reserved to their original owners.",
        disclaimerOk: "OK",
        instructionsModalTitle: "How to Use",
        instructionsDesktopTitle: "Desktop View",
        instructionsDesktop1: "Use the sidebar on the right to filter by category or video language.",
        instructionsDesktop2: "Use the search bar and channel buttons to refine your search.",
        instructionsDesktop3: "Sort results using the 'Newest' and 'Oldest' buttons.",
        instructionsMobileTitle: "Mobile View",
        instructionsMobile1: "Use the floating buttons at the bottom right:",
        instructionsMobileFilter: "Filter by Category",
        instructionsMobileLang: "Filter by Video Language",
        instructionsMobileChannel: "Filter by Channel",
        instructionsMobileReset: "Reset all filters",
        instructionsMobile2: "The search bar and sort buttons appear at the top of the content.",
        donateBtnText: "Support Us – Donate"
    }
};

const elements = {
    htmlEl: document.documentElement,
    themeToggle: document.getElementById('theme-toggle'),
    videoGrid: document.getElementById('video-grid'),
    videoCountEl: document.getElementById('video-count'),
    videoCountContainer: document.getElementById('video-count-container'),
    contentTitle: document.getElementById('content-title'),
    filterForm: document.getElementById('filter-form'),
    categoryFilters: document.getElementById('category-filters'),
    videoLangFilters: document.getElementById('video-lang-filters'),
    desktopResetBtn: document.getElementById('desktop-reset-btn'),
    floatingControls: document.getElementById('floating-controls'),
    floatingCategoryBtn: document.getElementById('floating-category-btn'),
    headerLangBtn: document.getElementById('header-lang-btn'),
    floatingResetBtn: document.getElementById('floating-reset-btn'),
    filterModal: document.getElementById('filter-modal'),
    filterModalTitle: document.getElementById('filter-modal-title'),
    filterModalOptions: document.getElementById('filter-modal-options'),
    closeFilterModalBtn: document.getElementById('close-filter-modal-btn'),
    playerModal: document.getElementById('player-modal'),
    playerContainer: document.getElementById('player-container'),
    playerTitle: document.getElementById('player-title'),
    closePlayerBtn: document.getElementById('close-player-modal'),
    selectedFiltersSummary: document.getElementById('selected-filters-summary'),
    helpBtn: document.getElementById('help-btn'),
    helpModal: document.getElementById('help-modal'),
    closeHelpBtn: document.getElementById('close-help-modal'),
    instructionsBtn: document.getElementById('instructions-btn'),
    floatingInstructionsBtn: document.getElementById('floating-instructions-btn'),
    instructionsModal: document.getElementById('instructions-modal'),
    closeInstructionsBtn: document.getElementById('close-instructions-modal'),
    searchInput: document.getElementById('search-input'),
    scrollTrigger: document.getElementById('scroll-trigger'),
    loader: document.getElementById('loader'),
    langSelectionModal: document.getElementById('lang-selection-modal'),
    floatingVideoLangBtn: document.getElementById('floating-video-lang-btn'),
    disclaimerModal: document.getElementById('disclaimer-modal'),
    disclaimerOkBtn: document.getElementById('disclaimer-ok-btn')
};

const flags = {
    ar: 'https://cdn.countryflags.com/thumbs/saudi-arabia/flag-round-500.png',
    en: `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3e%3cclipPath id='a'%3e%3cpath d='M0,0 v30 h60 v-30 z'/%3e%3c/clipPath%3e%3cpath d='M0,0 v30 h60 v-30 z' fill='%2300247d'/%3e%3cpath d='M0,0 L60,30 M60,0 L0,30' stroke='%23fff' stroke-width='6' clip-path='url(%23a)'/%3e%3cpath d='M0,0 L60,30 M60,0 L0,30' stroke='%23cf142b' stroke-width='4' clip-path='url(%23a)'/%3e%3cpath d='M30,0 v30 M0,15 h60' stroke='%23fff' stroke-width='10'/%3e%3cpath d='M30,0 v30 M0,15 h60' stroke='%23cf142b' stroke-width='6'/%3e%3c/svg%3e`,
};

// --- Disclaimer Update ---
function updateDisclaimer(lang) {
    const T = translations[lang];
    // Update disclaimer in footer
    const footer = document.getElementById('disclaimer-footer');
    if (footer) {
        const title = footer.querySelector('[data-translate-key="disclaimerTitle"]');
        const text = footer.querySelector('[data-translate-key="disclaimerText"]');
        if (title) title.textContent = T.disclaimerTitle;
        if (text) text.textContent = T.disclaimerText;
    }
}


// --- App Initialization & Core Logic ---

const closeModal = (modalElement) => {
    if (!modalElement) return;
    modalElement.classList.remove('active');
    document.body.style.overflow = '';
    
    if (modalElement.id === 'player-modal') {
        elements.playerContainer.innerHTML = '';
    }
    
    if (modalElement.id === 'lang-selection-modal' && !isAppInitialized) {
        // If user closes modal without choosing, default to 'ar'
        initializeApp('ar');
    }
};

const openModal = (modalElement) => {
    if (!modalElement) return;
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const applyTranslations = (lang) => {
    currentUILanguage = lang;
    const translationSet = translations[lang];

    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (translationSet[key]) {
            const prop = el.hasAttribute('title') ? 'title' : (el.tagName === 'INPUT' ? 'placeholder' : 'textContent');
            el[prop] = translationSet[key];
        }
    });

    elements.htmlEl.lang = lang;
    elements.htmlEl.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    updateDisclaimer(lang);

    // Set video language filter to match UI language
    state.videoLang = lang;

    if (isAppInitialized) {
        updateUI();
    }
    // Dispatch event so donation button updates
    document.dispatchEvent(new Event('langChanged'));
};

function fetchDocumentariesAndInit() {
    Promise.all([
        fetch('videos.json').then(r => r.json()),
        fetch('videos-en.json').then(r => r.json())
    ]).then(([ar, en]) => {
        allDocumentaries = [...ar, ...en];
        document.dispatchEvent(new Event('videosLoaded'));
    }).catch(err => {
        console.error('Error loading videos:', err);
        if (elements.videoGrid) {
            elements.videoGrid.innerHTML = `<div class="no-results" style="grid-column: 1 / -1;"><i class="fas fa-exclamation-triangle"></i><p>Failed to load data. Please try again later.</p></div>`;
        }
    });
}

function setupInitialListeners() {

    // Only one event listener for langSelectionModal
    elements.langSelectionModal.addEventListener('click', e => {
        // If click outside modal content, close modal (only if already initialized)
        if (e.target === elements.langSelectionModal) {
            if (isAppInitialized) closeModal(elements.langSelectionModal);
            return;
        }
        // If click on a language button, set language and close modal
        const btn = e.target.closest('.lang-choice-btn');
        if (btn) {
            if (!isAppInitialized) {
                initializeApp(btn.dataset.lang);
            } else {
                applyTranslations(btn.dataset.lang);
                closeModal(elements.langSelectionModal);
            }
        }
    });
    
    document.addEventListener('keydown', e => { 
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.player-modal.active, .filter-modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // Responsive: hide header lang button on <=1024px, show only floating lang button
    function updateLangBtnVisibility() {
        if (window.innerWidth <= 1024) {
            if (elements.headerLangBtn) elements.headerLangBtn.style.display = 'none';
            if (elements.floatingVideoLangBtn) elements.floatingVideoLangBtn.style.display = '';
        } else {
            if (elements.headerLangBtn) elements.headerLangBtn.style.display = '';
            if (elements.floatingVideoLangBtn) elements.floatingVideoLangBtn.style.display = '';
        }
    }
    window.addEventListener('resize', updateLangBtnVisibility);
    updateLangBtnVisibility();

    if (elements.headerLangBtn) {
        elements.headerLangBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(elements.langSelectionModal);
        });
    }
    if (elements.floatingVideoLangBtn) {
        elements.floatingVideoLangBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(elements.langSelectionModal);
        });
    }

    if (elements.disclaimerModal) {
        elements.disclaimerOkBtn.addEventListener('click', () => closeModal(elements.disclaimerModal));
        elements.disclaimerModal.addEventListener('click', e => {
            if (e.target === elements.disclaimerModal) closeModal(elements.disclaimerModal);
        });
    }
}

const getMaps = () => {
    const T = translations[currentUILanguage];
    return {
        category: {
            name: T.summaryCategory,
            options: {
                all: { name: T.allCategories, icon: 'fa-grip' },
                history: { name: T.category_history, icon: 'fa-scroll' },
                science: { name: T.category_science, icon: 'fa-flask-vial' },
                technology: { name: T.category_technology, icon: 'fa-satellite-dish' },
                nature: { name: T.category_nature, icon: 'fa-leaf' },
                cars: { name: T.category_cars, icon: 'fa-car' },
                society: { name: T.category_society, icon: 'fa-people-group' }
            }
        },
        videoLang: {
            name: T.summaryVideoLang,
            options: {
                all: { name: T.allLangs, icon: 'fa-globe' },
                ar: { name: 'العربية', icon: flags.ar },
                en: { name: 'English', icon: flags.en },
            }
        },
        channel: {
            name: T.summaryChannel,
            options: {
                all: { name: T.allChannels, icon: 'fa-tv' },
                dw: { name: T.channel_dw, icon: `<svg/>` },
                natgeo: { name: T.channel_natgeo, icon: `<svg/>` },
                netflix: { name: T.channel_netflix, icon: `<svg/>` }
            }
        },
        uiLang: {
            name: T.languageBtn,
            options: {
                ar: { name: 'العربية', icon: flags.ar },
                en: { name: 'English', icon: flags.en },
            }
        }
    };
};

const renderIcon = (icon, altText) => {
    if (icon.startsWith('<svg')) return `<div class="filter-icon"></div>`;
    if (icon.startsWith('fa-')) return `<i class="fas ${icon} filter-icon"></i>`;
    return `<img src="${icon}" class="filter-icon flag-icon" alt="${altText} flag">`;
};

const renderFilterOptions = (group, map) => {
    let html = `<legend>${map.name}</legend><div class="filter-options">`;
    for (const [key, value] of Object.entries(map.options)) {
        html += `<input type="radio" id="${group}-${key}-modal" name="${group}" value="${key}"><label for="${group}-${key}-modal">${renderIcon(value.icon, value.name)} ${value.name}</label>`;
    }
    return html + `</div>`;
};

const renderSidebarFilterOptions = (group, map, container) => {
    let html = `<legend>${map.name}</legend><div class="filter-options">`;
    for (const [key, value] of Object.entries(map.options)) {
        html += `<input type="radio" id="${group}-${key}" name="${group}" value="${key}" ${state[group] === key ? 'checked' : ''}><label for="${group}-${key}">${renderIcon(value.icon, value.name)} ${value.name}</label>`;
    }
    html += `</div>`;
    container.innerHTML = html;
};

const renderChannelButtons = () => {
    const maps = getMaps();
    const container = document.getElementById('channel-filters-container');
    if (!container) return;
    
    let html = `<div class="filter-options channel-options-horizontal">`;
    for (const [key, value] of Object.entries(maps.channel.options)) {
         const isActive = state.channel === key;
         html += `<button type="button" class="channel-option-btn${isActive ? ' active' : ''}" data-value="${key}"><span class="channel-label">${value.name}</span></button>`;
    }
    html += `</div>`;
    container.innerHTML = html;
    
    container.addEventListener('click', e => {
        const btn = e.target.closest('.channel-option-btn');
        if (btn) {
            state.channel = btn.dataset.value;
            updateUI();
        }
    });
};

const renderVideos = (docs) => {
    docs.forEach((doc, index) => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.dataset.videoId = doc.id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.style.animationDelay = `${index * 50}ms`;
        const categoryIcon = getMaps().category.options[doc.category]?.icon || 'fa-question-circle';
        const channelName = getMaps().channel.options[doc.channel]?.name || doc.channel;
        card.innerHTML = `
        <div class="video-thumbnail">
            <img src="https://i.ytimg.com/vi/${doc.id}/hqdefault.jpg" alt="${doc.title}" loading="lazy">
            <div class="video-thumbnail-overlay"><i class="fas fa-play play-icon"></i></div>
            <span class="video-duration">${doc.duration}</span>
        </div>
        <div class="video-info">
            <div class="category-icon"><i class="fas ${categoryIcon}"></i></div>
            <div class="video-details">
                <div class="video-title">${doc.title}</div>
                <div class="video-meta">
                    <span class="video-channel"><i class="fas fa-tv"></i> ${channelName || ''}</span>
                    <span class="video-date"><i class="fas fa-calendar"></i> ${doc.date || ''}</span>
                </div>
            </div>
        </div>`;
        elements.videoGrid.appendChild(card);
    });
};

const loadMoreVideos = () => {
    if (isLoading) return;
    isLoading = true;
    elements.loader.style.display = 'block';

    const start = (currentPage - 1) * videosPerPage;
    const end = start + videosPerPage;
    const videosToLoad = currentFilteredVideos.slice(start, end);

    setTimeout(() => {
        renderVideos(videosToLoad);
        currentPage++;
        isLoading = false;
        elements.loader.style.display = 'none';
    }, 300);
};

const generateContentTitle = () => {
    const T = translations[currentUILanguage];
    const maps = getMaps();
    const catName = maps.category.options[state.category]?.name || T.allCategories;
    if (state.category === 'all') return T.allCategories;
    return catName;
};

const updateCounter = (count) => {
    const numberEl = elements.videoCountContainer.querySelector('[data-id="count-number"]');
    const labelEl = elements.videoCountContainer.querySelector('[data-id="count-label"]');
    numberEl.textContent = count;
    
    if (elements.htmlEl.dir === 'ltr') {
        elements.videoCountContainer.prepend(numberEl);
        elements.videoCountContainer.append(labelEl);
    } else {
        elements.videoCountContainer.prepend(labelEl);
        elements.videoCountContainer.append(numberEl);
    }
};

const updateSelectedFiltersSummary = () => {
    const T = translations[currentUILanguage];
    const maps = getMaps();
    const summary = [];
    if (state.category !== 'all') summary.push(`${T.summaryCategory}: <b>${maps.category.options[state.category]?.name || ''}</b>`);
    if (state.videoLang !== 'all') summary.push(`${T.summaryVideoLang}: <b>${maps.videoLang.options[state.videoLang]?.name || ''}</b>`);
    if (state.channel !== 'all') summary.push(`${T.summaryChannel}: <b>${maps.channel.options[state.channel]?.name || state.channel}</b>`);
    summary.push(`${T.summaryOrder}: <b>${state.order === 'new' ? T.orderNew : T.orderOld}</b>`);
    
    elements.selectedFiltersSummary.innerHTML = summary.join(' | ');
    const isAnyFilterActive = state.category !== 'all' || state.channel !== 'all' || state.videoLang !== 'all';
    elements.selectedFiltersSummary.style.display = (window.innerWidth <= 1024 && isAnyFilterActive) ? 'block' : 'none';
};

const renderOrderButton = () => {
    const T = translations[currentUILanguage];
    const orderPlaceholder = document.getElementById('order-btn-placeholder');
    orderPlaceholder.innerHTML = `<div class="order-controls">
        <button class="order-btn ${state.order === 'new' ? 'active' : ''}" data-order="new"><i class="fas fa-sort-amount-down-alt"></i> ${T.orderNewest}</button>
        <button class="order-btn ${state.order === 'old' ? 'active' : ''}" data-order="old"><i class="fas fa-sort-amount-up"></i> ${T.orderOldest}</button>
    </div>`;
};

const updateUI = () => {
    if (!isAppInitialized) return;
    
    const searchTerm = state.search.toLowerCase();
    currentFilteredVideos = allDocumentaries.filter(doc =>
        (state.category === 'all' || doc.category === state.category) &&
        (state.videoLang === 'all' || doc.lang === state.videoLang) &&
        (state.channel === 'all' || (doc.channel && doc.channel.toLowerCase() === state.channel.toLowerCase())) &&
        (doc.title.toLowerCase().includes(searchTerm))
    );
    
    if (state.order === 'new') {
        currentFilteredVideos.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        currentFilteredVideos.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    elements.videoGrid.innerHTML = '';
    currentPage = 1;
    if (currentFilteredVideos.length === 0) {
        const T = translations[currentUILanguage];
        elements.videoGrid.innerHTML = `<div class="no-results"><i class="fas fa-video-slash"></i><p>${T.noResultsFound}</p><button class="no-results-reset-btn" id="no-results-reset-btn"><i class="fas fa-sync-alt"></i><span>${T.noResultsReset}</span></button></div>`;
    } else {
        loadMoreVideos();
    }
    
    updateCounter(currentFilteredVideos.length);
    elements.contentTitle.innerHTML = generateContentTitle();
    updateSelectedFiltersSummary();
    renderOrderButton();
    
    const maps = getMaps();
    renderSidebarFilterOptions('category', maps.category, elements.categoryFilters);
    // Removed videoLang filter from sidebar
    renderChannelButtons();
};

const resetFilters = () => {
    state.category = 'all';
    // Always reset videoLang to the current UI language
    state.videoLang = currentUILanguage;
    state.channel = 'all';
    state.search = '';
    state.order = 'new';
    elements.searchInput.value = '';
    updateUI();
};

function setupAppEventListeners() {
    elements.searchInput.addEventListener('input', e => { state.search = e.target.value; updateUI(); });
    elements.desktopResetBtn.addEventListener('click', resetFilters);
    elements.floatingResetBtn.addEventListener('click', resetFilters);
    elements.videoGrid.addEventListener('click', e => { if (e.target.closest('#no-results-reset-btn')) resetFilters(); });
    // Only allow category filter in sidebar
    elements.filterForm.addEventListener('change', e => {
        if (e.target.name === 'category') {
            state.category = e.target.value;
            updateUI();
        }
    });
    document.getElementById('order-btn-placeholder').addEventListener('click', e => {
        const btn = e.target.closest('.order-btn');
        if(btn) { state.order = btn.dataset.order; updateUI(); }
    });
    
    const openFilterModal = (filterType) => {
        const maps = getMaps();
        const map = maps[filterType];
        const T = translations[currentUILanguage];
        elements.filterModalTitle.textContent = `${T.filterBy} ${map.name}`;
        elements.filterModalOptions.innerHTML = renderFilterOptions(filterType, map);
        const currentInput = elements.filterModalOptions.querySelector(`input[value="${state[filterType]}"]`);
        if (currentInput) currentInput.checked = true;
        openModal(elements.filterModal);
    };

    elements.floatingCategoryBtn.addEventListener('click', () => openFilterModal('category'));
    document.getElementById('floating-channel-btn').addEventListener('click', () => openFilterModal('channel'));
    
    elements.closeFilterModalBtn.addEventListener('click', () => closeModal(elements.filterModal));
    elements.filterModal.addEventListener('click', e => { if (e.target === elements.filterModal) closeModal(elements.filterModal); });
    elements.filterModalOptions.addEventListener('change', e => {
        if (state.hasOwnProperty(e.target.name)) {
            state[e.target.name] = e.target.value;
            updateUI();
            closeModal(elements.filterModal);
        }
    });
    
    elements.videoGrid.addEventListener('click', e => { 
        const card = e.target.closest('.video-card'); 
        if (card) {
            const doc = allDocumentaries.find(d => d.id === card.dataset.videoId);
            if (doc) {
                let embedUrl = doc.embed + (doc.embed.includes('?') ? '&' : '?') + 'autoplay=1';
                elements.playerContainer.innerHTML = `<iframe src="${embedUrl}&rel=0" title="${doc.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
                elements.playerTitle.textContent = doc.title;
                openModal(elements.playerModal);
            }
        }
    });

    elements.closePlayerBtn.addEventListener('click', () => closeModal(elements.playerModal));
    elements.playerModal.addEventListener('click', e => { if (e.target === elements.playerModal) closeModal(elements.playerModal); });
    
    elements.helpBtn.addEventListener('click', () => openModal(elements.helpModal));
    elements.closeHelpBtn.addEventListener('click', () => closeModal(elements.helpModal));
    elements.helpModal.addEventListener('click', e => { if (e.target === elements.helpModal) closeModal(elements.helpModal); });
    
    elements.instructionsBtn.addEventListener('click', () => openModal(elements.instructionsModal));
    elements.floatingInstructionsBtn.addEventListener('click', () => openModal(elements.instructionsModal));
    elements.closeInstructionsBtn.addEventListener('click', () => closeModal(elements.instructionsModal));
    elements.instructionsModal.addEventListener('click', e => { if (e.target === elements.instructionsModal) closeModal(elements.instructionsModal); });
    
    window.addEventListener('resize', updateSelectedFiltersSummary);
    elements.themeToggle.addEventListener('click', () => { 
        const newTheme = elements.htmlEl.dataset.theme === 'light' ? 'dark' : 'light';
        elements.htmlEl.dataset.theme = newTheme; 
        localStorage.setItem('theme', newTheme);
    });

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading && (currentPage - 1) * videosPerPage < currentFilteredVideos.length) {
            loadMoreVideos();
        }
    }, { rootMargin: "0px 0px 200px 0px" });
    if(elements.scrollTrigger) observer.observe(elements.scrollTrigger);
}

function initializeApp(lang) {
    if (allDocumentaries.length === 0) {
        document.addEventListener('videosLoaded', () => initializeApp(lang), { once: true });
        closeModal(elements.langSelectionModal);
        if (elements.loader) elements.loader.style.display = 'block';
        return;
    }

    if(isAppInitialized) {
        applyTranslations(lang);
        closeModal(elements.langSelectionModal);
        return;
    }

    isAppInitialized = true;
    // Set video language filter to match UI language on first load
    state.videoLang = lang;
    applyTranslations(lang);

    const savedTheme = localStorage.getItem('theme') || 'light';
    elements.htmlEl.dataset.theme = savedTheme;

    setupAppEventListeners();
    updateUI();
    closeModal(elements.langSelectionModal);
    openModal(elements.disclaimerModal); // Show disclaimer on first proper launch
}

// --- App Startup ---

document.addEventListener('DOMContentLoaded', () => {
    setupInitialListeners();
    openModal(elements.langSelectionModal);
    fetchDocumentariesAndInit();
});