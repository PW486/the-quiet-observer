// Configuration & Post Metadata
const config = {
    common: {
        siteTitle: "The Quiet Observer",
        siteSubtitle: "Philosophy & Thoughts",
        footerText: "© 2026 The Quiet Observer."
    },
    texts: {
        en: {
            backButton: "← Back to List",
            readMore: "Read Essay",
            loading: "Loading...",
            prev: "<",
            next: ">",
            first: "«",
            last: "»"
        },
        ko: {
            backButton: "← 목록으로",
            readMore: "에세이 읽기",
            loading: "로딩 중...",
            prev: "<",
            next: ">",
            first: "«",
            last: "»"
        }
    },
    posts: [],
    postsPerPage: 10,
    pagesPerGroup: 5
};

// State
let currentLang = 'en';

function getLanguage() {
    // 1. Priority: Cookie (user's explicit choice from previous visit)
    const savedLang = getCookie('lang');
    if (savedLang) return savedLang;

    // 2. Browser language detection
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('ko')) {
        return 'ko';
    }

    // 3. Default to English
    return 'en';
}

function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post');
}

function getPage() {
    const params = new URLSearchParams(window.location.search);
    const urlPage = params.get('p');
    if (urlPage) return parseInt(urlPage);
    return parseInt(getCookie('page')) || 1;
}

function updateState(lang, postId, page = 1) {
    const newUrl = new URL(window.location);
    if (lang !== currentLang) {
        setCookie('lang', lang, 365);
        currentLang = lang;
    }
    
    if (postId) {
        newUrl.searchParams.set('post', postId);
        if (page > 1) newUrl.searchParams.set('p', page);
        else newUrl.searchParams.delete('p');
    } else {
        newUrl.searchParams.delete('post');
        if (page > 1) {
            newUrl.searchParams.set('p', page);
            setCookie('page', page, 30);
        } else {
            newUrl.searchParams.delete('p');
            setCookie('page', 1, 30);
        }
    }
    
    newUrl.searchParams.delete('lang');
    window.history.pushState({}, '', newUrl);
    window.scrollTo(0, 0);
    render(postId, page);
}

function render(postId, page) {
    const texts = config.texts[currentLang];
    const common = config.common;
    
    document.getElementById('site-title').textContent = common.siteTitle;
    document.getElementById('site-subtitle').textContent = common.siteSubtitle;
    document.getElementById('footer-text').textContent = common.footerText;
    document.documentElement.lang = currentLang;

    // Default SEO
    document.title = common.siteTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', texts.loading);

    document.querySelectorAll('nav button').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const container = document.getElementById('post-container');
    const paginationContainer = document.getElementById('pagination');
    
    if (postId) {
        paginationContainer.style.display = 'none';
        loadPost(postId, container, texts, page);
    } else {
        paginationContainer.style.display = 'flex';
        renderList(container, paginationContainer, texts, page);
    }
}

function renderList(container, paginationContainer, texts, page) {
    if (config.posts.length === 0) {
        container.innerHTML = `<div id="loading">${texts.loading}</div>`;
        paginationContainer.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(config.posts.length / config.postsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages));
    
    const start = (currentPage - 1) * config.postsPerPage;
    const end = start + config.postsPerPage;
    const pagedPosts = config.posts.slice(start, end);

    let html = `<div class="post-list">`;
    pagedPosts.forEach(post => {
        const title = post.title[currentLang] || post.title['en'];
        const date = post.date[currentLang] || post.date['en'];
        const url = `?post=${post.id}&p=${currentPage}`;
        
        html += `
            <a href="${url}" class="post-item" data-id="${post.id}">
                <div class="post-date">${date}</div>
                <h2 class="post-title">${title}</h2>
                <div class="read-more">${texts.readMore} &rarr;</div>
            </a>
        `;
    });
    html += `</div>`;
    container.innerHTML = html;

    container.querySelectorAll('.post-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            updateState(currentLang, item.dataset.id, currentPage);
        });
    });

    renderPagination(paginationContainer, totalPages, currentPage, texts);
}

function renderPagination(container, totalPages, currentPage, texts) {
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    const icons = {
        first: `<svg viewBox="0 0 24 24"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>`,
        prev: `<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
        next: `<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
        last: `<svg viewBox="0 0 24 24"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>`
    };

    const currentGroup = Math.ceil(currentPage / config.pagesPerGroup);
    const startPage = (currentGroup - 1) * config.pagesPerGroup + 1;
    const endPage = Math.min(startPage + config.pagesPerGroup - 1, totalPages);

    let html = '';
    
    // First Group Button (<<)
    if (totalPages > config.pagesPerGroup) {
        html += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="1" title="First Page">${icons.first}</button>`;
    }

    // Prev Page Button (<)
    html += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" title="Previous Page">${icons.prev}</button>`;
    
    // Page Numbers in Group
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    // Next Page Button (>)
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" title="Next Page">${icons.next}</button>`;

    // Last Group Button (>>)
    if (totalPages > config.pagesPerGroup) {
        html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${totalPages}" title="Last Page">${icons.last}</button>`;
    }
    
    container.innerHTML = html;

    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.page) {
                updateState(currentLang, null, parseInt(btn.dataset.page));
            }
        });
    });
}

async function loadPost(postId, container, texts, page) {
    container.innerHTML = `
        <button class="back-btn" id="btn-back">${texts.backButton}</button>
        <article id="post-content">
            <div id="loading">${texts.loading}</div>
        </article>
    `;

    document.getElementById('btn-back').addEventListener('click', () => {
        updateState(currentLang, null, page);
    });
    
    try {
        const fileName = `posts/${postId}.${currentLang}.md`;
        const response = await fetch(fileName);
        if (!response.ok) throw new Error("Post not found");
        const markdown = await response.text();
        document.getElementById('post-content').innerHTML = marked.parse(markdown);

        // Update Dynamic SEO
        const postTitle = document.querySelector('#post-content h1')?.textContent;
        const firstPara = document.querySelector('#post-content p')?.textContent;
        
        if (postTitle) {
            document.title = `${postTitle} | ${config.common.siteTitle}`;
        }
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && firstPara) {
            metaDesc.setAttribute('content', firstPara.substring(0, 160) + '...');
        }
        
    } catch (error) {
        document.getElementById('post-content').innerHTML = `<p class="meta">Post not found or error loading.</p>`;
    }
}

async function init() {
    try {
        const response = await fetch('posts.json');
        config.posts = await response.json();
    } catch (e) {
        console.error("Failed to load posts.json", e);
    }

    initTheme();

    currentLang = getLanguage();
    const postId = getPostId();
    const page = getPage();
    render(postId, page);

    document.getElementById('site-title').addEventListener('click', () => updateState(currentLang, null, 1));
    document.getElementById('btn-en').addEventListener('click', () => updateState('en', getPostId(), getPage()));
    document.getElementById('btn-ko').addEventListener('click', () => updateState('ko', getPostId(), getPage()));
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

function initTheme() {
    const savedTheme = getCookie('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setCookie('theme', newTheme, 365);
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

window.addEventListener('popstate', () => {
    currentLang = getLanguage();
    render(getPostId(), getPage());
});

document.addEventListener('DOMContentLoaded', init);