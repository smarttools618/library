// JavaScript extracted from index.html

let allDocumentaries = [];
// --- Infinite Scroll & Search State ---
let currentFilteredVideos = [];
let currentPage = 1;
const videosPerPage = 12;
let isLoading = false;

function fetchDocumentariesAndInit() {
    fetch('videos.json')
        .then(response => {
            if (!response.ok) { throw new Error('Network response was not ok'); }
            return response.json();
        })
        .then(data => {
            allDocumentaries = data;
            document.dispatchEvent(new Event('videosLoaded'));
        })
        .catch(err => {
            console.error('Error loading videos.json:', err);
            document.getElementById('video-grid').innerHTML = `<div class="no-results" style="grid-column: 1 / -1;"><i class="fas fa-exclamation-triangle"></i><p>فشل تحميل البيانات. الرجاء المحاولة مرة أخرى لاحقاً.</p></div>`;
        });
}

document.addEventListener('DOMContentLoaded', fetchDocumentariesAndInit);

document.addEventListener('videosLoaded', function () {
    const elements = {
        htmlEl: document.documentElement,
        themeToggle: document.getElementById('theme-toggle'),
        videoGrid: document.getElementById('video-grid'),
        videoCountEl: document.getElementById('video-count'),
        contentTitle: document.getElementById('content-title'),
        filterForm: document.getElementById('filter-form'),
        categoryFilters: document.getElementById('category-filters'),
        // langFilters removed from sidebar, so skip it
        desktopResetBtn: document.getElementById('desktop-reset-btn'),
        floatingCategoryBtn: document.getElementById('floating-category-btn'),
        // floatingLangBtn may not exist
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
        // NEW: Search and Infinite Scroll elements
        searchInput: document.getElementById('search-input'),
        scrollTrigger: document.getElementById('scroll-trigger'),
        loader: document.getElementById('loader'),
    };

    const flags = {
        ar: 'https://cdn.countryflags.com/thumbs/saudi-arabia/flag-round-500.png',
        en: `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3e%3cclipPath id='a'%3e%3cpath d='M0,0 v30 h60 v-30 z'/%3e%3c/clipPath%3e%3cpath d='M0,0 v30 h60 v-30 z' fill='%2300247d'/%3e%3cpath d='M0,0 L60,30 M60,0 L0,30' stroke='%23fff' stroke-width='6' clip-path='url(%23a)'/%3e%3cpath d='M0,0 L60,30 M60,0 L0,30' stroke='%23cf142b' stroke-width='4' clip-path='url(%23a)'/%3e%3cpath d='M30,0 v30 M0,15 h60' stroke='%23fff' stroke-width='10'/%3e%3cpath d='M30,0 v30 M0,15 h60' stroke='%23cf142b' stroke-width='6'/%3e%3c/svg%3e`,
        fr: `data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'%3e%3crect width='900' height='600' fill='%23ED2939'/%3e%3crect width='600' height='600' fill='%23fff'/%3e%3crect width='300' height='600' fill='%23002395'/%3e%3c/svg%3e`
    };

    const maps = {
        category: {
            name: 'التصنيف',
            options: {
                all: { name: 'كل التصنيفات', icon: 'fa-grip' },
                history: { name: 'التاريخ', icon: 'fa-scroll' },
                science: { name: 'العلوم', icon: 'fa-flask-vial' },
                technology: { name: 'التقنية', icon: 'fa-satellite-dish' },
                "الطبيعة والحياة البرية": { name: 'الطبيعة والحياة البرية', icon: 'fa-leaf' },
                "مجتمعات وثقافات": { name: 'مجتمعات وثقافات', icon: 'fa-people-group' }
            }
        },
        lang: {
            name: 'اللغة',
            options: {
                all: { name: 'كل اللغات', icon: 'fa-language' },
                ar: { name: 'العربية', icon: flags.ar },
                en: { name: 'English', icon: flags.en },
                fr: { name: 'Français', icon: flags.fr }
            }
        }
    };

    let state = { category: 'all', lang: 'all', search: '' };

    const renderVideos = (docs) => {
        docs.forEach((doc, index) => {
            const card = document.createElement('div');
            card.className = 'video-card';
            card.dataset.videoId = doc.id;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `تشغيل فيديو: ${doc.title}`);
            // Stagger the animation for newly loaded items
            card.style.animationDelay = `${index * 50}ms`;
            card.innerHTML = `
            <div class="video-thumbnail">
                <img src="https://i.ytimg.com/vi/${doc.id}/hqdefault.jpg" alt="${doc.title}" loading="lazy">
                <div class="video-thumbnail-overlay"><i class="fas fa-play play-icon"></i></div>
                <span class="video-duration">${doc.duration}</span>
            </div>
            <div class="video-info">
                <div class="category-icon"><i class="fas ${maps.category.options[doc.category].icon}"></i></div>
                <div class="video-details"><div class="video-title">${doc.title}</div></div>
            </div>
        `;
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

        setTimeout(() => { // Simulate network delay for loader visibility
            renderVideos(videosToLoad);
            currentPage++;
            isLoading = false;
            elements.loader.style.display = 'none';
            // Hide loader if no more videos to load
            if (end >= currentFilteredVideos.length) {
                elements.loader.style.display = 'none';
            }
        }, 300);
    };

    const updateUI = () => {
        const searchTerm = state.search.toLowerCase();
        currentFilteredVideos = allDocumentaries.filter(doc =>
            (state.category === 'all' || doc.category === state.category) &&
            (state.lang === 'all' || doc.lang === state.lang) &&
            (doc.title.toLowerCase().includes(searchTerm))
        );

        elements.videoGrid.innerHTML = ''; // Clear existing grid
        currentPage = 1; // Reset page count

        if (currentFilteredVideos.length === 0) {
            elements.videoGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-video-slash"></i>
                <p>لا توجد نتائج تطابق بحثك.</p>
                <button class="no-results-reset-btn" id="no-results-reset-btn">
                    <i class="fas fa-sync-alt"></i><span>إعادة تعيين الفلاتر</span>
                </button>
            </div>`;
        } else {
            loadMoreVideos();
        }

        elements.videoCountEl.textContent = `${currentFilteredVideos.length}`;
        elements.contentTitle.textContent = generateContentTitle();
        updateSelectedFiltersSummary();
    };

    const resetFilters = () => {
        state.category = 'all';
        state.lang = 'all';
        state.search = '';
        elements.searchInput.value = '';
        // Update radio buttons in form
        ['category', 'lang'].forEach(type => {
            const radio = elements.filterForm.querySelector(`input[name="${type}"][value="all"]`);
            if (radio) radio.checked = true;
            updateFloatingButton(type);
        });
        updateUI();
    };

    // --- Intersection Observer for Infinite Scroll ---
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !isLoading) {
            const totalLoaded = (currentPage - 1) * videosPerPage;
            if (totalLoaded < currentFilteredVideos.length) {
                loadMoreVideos();
            }
        }
    }, { rootMargin: "0px 0px 200px 0px" });

    observer.observe(elements.scrollTrigger);

    const setupEventListeners = () => {
        // Remove floating language button on small screens
        function handleFloatingLangBtn() {
            if (window.innerWidth <= 1024) {
                const btn = document.getElementById('floating-lang-btn');
                if (btn) btn.style.display = 'none';
            } else {
                const btn = document.getElementById('floating-lang-btn');
                if (btn) btn.style.display = '';
            }
        }
        handleFloatingLangBtn();
        window.addEventListener('resize', handleFloatingLangBtn);
        elements.searchInput.addEventListener('input', e => {
            state.search = e.target.value;
            updateUI();
        });

        elements.desktopResetBtn.addEventListener('click', resetFilters);
        elements.floatingResetBtn.addEventListener('click', resetFilters);
        elements.videoGrid.addEventListener('click', e => {
            if (e.target.closest('#no-results-reset-btn')) resetFilters();
        });

        // The rest of your event listeners (modals, player, etc.)
        const floatingControls = document.getElementById('floating-controls');
        const openFilterModal = (filterType) => {
            const map = maps[filterType];
            elements.filterModalTitle.textContent = map.name;
            elements.filterModalOptions.innerHTML = renderFilterOptions(filterType, map);
            const currentInput = elements.filterModalOptions.querySelector(`input[value="${state[filterType]}"]`);
            if (currentInput) currentInput.checked = true;
            openModal(elements.filterModal, () => elements.closeFilterModalBtn.focus());
        };
        if (floatingControls) {
            floatingControls.addEventListener('click', function (e) {
                const btn = e.target.closest('button');
                if (!btn || btn.id === 'floating-reset-btn') return;
                e.preventDefault();
                if (btn.id === 'floating-category-btn') openFilterModal('category');
                if (btn.id === 'floating-lang-btn') openFilterModal('lang');
            });
        }
        elements.filterForm.addEventListener('change', e => {
            if (state.hasOwnProperty(e.target.name)) {
                state[e.target.name] = e.target.value;
                updateUI();
                // Hide sidebar on mobile/tablet after selecting a category (permanently until user reopens)
                if (window.innerWidth <= 1024 && e.target.name === 'category') {
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) sidebar.style.display = 'none';
                }
            }
    // Optionally, add a way to reopen the sidebar on mobile (e.g., a floating button)
        // Advanced search: search by title, category, and duration
        elements.searchInput.addEventListener('input', e => {
            const searchTerm = e.target.value.trim().toLowerCase();
            currentFilteredVideos = allDocumentaries.filter(doc => {
                return (
                    (state.category === 'all' || doc.category === state.category) &&
                    (
                        doc.title.toLowerCase().includes(searchTerm) ||
                        (doc.category && doc.category.toLowerCase().includes(searchTerm)) ||
                        (doc.duration && doc.duration.includes(searchTerm))
                    )
                );
            });
            elements.videoGrid.innerHTML = '';
            currentPage = 1;
            if (currentFilteredVideos.length === 0) {
                elements.videoGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-video-slash"></i>
                    <p>لا توجد نتائج تطابق بحثك.</p>
                    <button class="no-results-reset-btn" id="no-results-reset-btn">
                        <i class="fas fa-sync-alt"></i><span>إعادة تعيين الفلاتر</span>
                    </button>
                </div>`;
            } else {
                loadMoreVideos();
            }
            elements.videoCountEl.textContent = `${currentFilteredVideos.length} وثائقيات`;
            elements.contentTitle.textContent = generateContentTitle();
            updateSelectedFiltersSummary();
        });
        });
        elements.closeFilterModalBtn.addEventListener('click', () => closeModal(elements.filterModal));
        elements.filterModal.addEventListener('click', e => {
            if (e.target === elements.filterModal) closeModal(elements.filterModal);
        });
        elements.filterModalOptions.addEventListener('change', e => {
            if (state.hasOwnProperty(e.target.name)) {
                state[e.target.name] = e.target.value;
                updateUI();
                closeModal(elements.filterModal);
            }
        });
        const openPlayer = (card) => {
            const doc = allDocumentaries.find(d => d.id === card.dataset.videoId);
            if (doc) {
                // Always clear any previous iframe before creating a new one
                elements.playerContainer.innerHTML = '';
                elements.playerContainer.innerHTML = `<iframe src="${doc.embed}?autoplay=1&rel=0" title="${doc.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                elements.playerTitle.textContent = doc.title;
                openModal(elements.playerModal, () => elements.closePlayerBtn.focus());
            }
        };
        elements.videoGrid.addEventListener('click', e => {
            const card = e.target.closest('.video-card');
            if (card) openPlayer(card);
        });
        elements.videoGrid.addEventListener('keydown', e => {
            const card = e.target.closest('.video-card');
            if (card && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault(); openPlayer(card);
            }
        });
        elements.closePlayerBtn.addEventListener('click', () => closeModal(elements.playerModal));
        elements.playerModal.addEventListener('click', e => {
            if (e.target === elements.playerModal) closeModal(elements.playerModal);
        });
        // Stop video playback when closing the player modal
        const stopPlayer = () => {
            elements.playerContainer.innerHTML = '';
        };
        elements.closePlayerBtn.addEventListener('click', stopPlayer);
        elements.playerModal.addEventListener('click', e => {
            if (e.target === elements.playerModal) stopPlayer();
        });
        elements.helpBtn.addEventListener('click', () => openModal(elements.helpModal, () => elements.closeHelpBtn.focus()));
        elements.closeHelpBtn.addEventListener('click', () => closeModal(elements.helpModal));
        elements.helpModal.addEventListener('click', e => {
            if (e.target === elements.helpModal) closeModal(elements.helpModal);
        });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (elements.playerModal.classList.contains('active')) {
                    closeModal(elements.playerModal);
                    elements.playerContainer.innerHTML = '';
                }
                if (elements.filterModal.classList.contains('active')) closeModal(elements.filterModal);
                if (elements.helpModal.classList.contains('active')) closeModal(elements.helpModal);
            }
        });
        window.addEventListener('resize', updateSelectedFiltersSummary);
        elements.themeToggle.addEventListener('click', () => {
            const newTheme = elements.htmlEl.dataset.theme === 'light' ? 'dark' : 'light';
            elements.htmlEl.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    };

    const init = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        elements.htmlEl.dataset.theme = savedTheme;

        elements.categoryFilters.innerHTML = renderSidebarFilterOptions('category', maps.category);
        // Don't render lang filters in sidebar if not present

        setupEventListeners();
        updateUI();
    };

    // Helper functions that don't depend on state but are used in init flow
    const renderIcon = (icon, altText) => (typeof icon === 'string' && icon.startsWith('fa-')) ? `<i class="fas ${icon} filter-icon"></i>` : `<img src="${icon}" class="filter-icon flag-icon" alt="${altText} flag">`;
    const renderSidebarFilterOptions = (group, map) => {
        let html = `<legend>${map.name}</legend><div class="filter-options">`;
        for (const [key, value] of Object.entries(map.options)) {
            html += `<input type="radio" id="${group}-${key}" name="${group}" value="${key}" ${key === 'all' ? 'checked' : ''}><label for="${group}-${key}">${renderIcon(value.icon, value.name)} ${value.name}</label>`;
        }
        return html + `</div>`;
    };
    const renderFilterOptions = (group, map) => {
        let html = `<legend>${map.name}</legend><div class="filter-options">`;
        for (const [key, value] of Object.entries(map.options)) {
            html += `<input type="radio" id="${group}-${key}-modal" name="${group}" value="${key}"><label for="${group}-${key}-modal">${renderIcon(value.icon, value.name)} ${value.name}</label>`;
        }
        return html + `</div>`;
    };
    const updateFloatingButton = (type) => {
        let btn = document.getElementById(`floating-${type}-btn`);
        if (!btn) return;
        const iconContainer = btn.querySelector('.floating-icon-container');
        const currentOption = maps[type].options[state[type]];
        const defaultOption = maps[type].options['all'];
        btn.classList.toggle('is-active', state[type] !== 'all');
        const iconToShow = state[type] === 'all' ? defaultOption.icon : currentOption.icon;
        const altText = state[type] === 'all' ? defaultOption.name : currentOption.name;
        if (iconContainer) iconContainer.innerHTML = renderIcon(iconToShow, altText);
    };
    const updateSelectedFiltersSummary = () => {
        if (window.innerWidth > 1024) {
            elements.selectedFiltersSummary.style.display = 'none'; return;
        }
        const cat = maps.category.options[state.category]?.name || '';
        const lang = maps.lang.options[state.lang]?.name || '';
        let summaryParts = [];
        if (state.category !== 'all') summaryParts.push(`التصنيف: <b>${cat}</b>`);
        if (state.lang !== 'all') summaryParts.push(`اللغة: <b>${lang}</b>`);
        if (summaryParts.length === 0) {
            elements.selectedFiltersSummary.innerHTML = 'عرض كل التصنيفات واللغات';
        } else {
            elements.selectedFiltersSummary.innerHTML = summaryParts.join(' | ');
        }
        elements.selectedFiltersSummary.style.display = 'block';
    };
    const generateContentTitle = () => {
        const catName = maps.category.options[state.category].name;
        const langName = maps.lang.options[state.lang].name;
        if (state.category === 'all' && state.lang === 'all') return 'كل الوثائقيات';
        if (state.category !== 'all' && state.lang === 'all') return catName;
        if (state.category === 'all' && state.lang !== 'all') return `وثائقيات (${langName})`;
        return `${catName} (${langName})`;
    };
    const openModal = (modalElement, onOpen) => {
        modalElement.classList.add('active'); document.body.style.overflow = 'hidden'; if (onOpen) onOpen();
    };
    const closeModal = (modalElement) => {
        modalElement.classList.remove('active'); document.body.style.overflow = '';
    };

    init();
});
