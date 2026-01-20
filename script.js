// Configuration & Post Metadata
const config = {
    common: {
        siteTitle: "The Quiet Observer",
        siteSubtitle: "Philosophy & Thoughts",
        footerText: "© 2025 The Quiet Observer."
    },
    texts: {
        en: {
            backButton: "← Back to List",
            readMore: "Read Essay",
            loading: "Loading..."
        },
        ko: {
            backButton: "← 목록으로",
            readMore: "에세이 읽기",
            loading: "로딩 중..."
        }
    },
    posts: [] // Will be loaded from posts.json
};

// State
let currentLang = 'en';

function getLanguage() {
    const params = new URLSearchParams(window.location.search);
    return params.get('lang') === 'ko' ? 'ko' : 'en';
}

function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post');
}

function updateState(lang, postId) {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('lang', lang);
    if (postId) {
        newUrl.searchParams.set('post', postId);
    } else {
        newUrl.searchParams.delete('post');
    }
    window.history.pushState({}, '', newUrl);
    
    currentLang = lang;
    render(postId);
}

function render(postId) {
    const texts = config.texts[currentLang];
    const common = config.common;
    
    // Update Header/Footer
    document.getElementById('site-title').textContent = common.siteTitle;
    document.getElementById('site-subtitle').textContent = common.siteSubtitle;
    document.getElementById('footer-text').textContent = common.footerText;
    document.documentElement.lang = currentLang;

    // Update Language Buttons
    document.querySelectorAll('nav button').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const main = document.querySelector('main');
    
    if (postId) {
        // Render Single Post
        loadPost(postId, main, texts);
    } else {
        // Render List
        renderList(main, texts);
    }
}

function renderList(container, texts) {
    if (config.posts.length === 0) {
        container.innerHTML = `<div id="loading">${texts.loading}</div>`;
        return;
    }

    let html = `<div class="post-list">`;
    
    config.posts.forEach(post => {
        // Fallback for title if translation missing
        const title = post.title[currentLang] || post.title['en'];
        
        html += `
            <div class="post-item" onclick="updateState('${currentLang}', '${post.id}')">
                <div class="post-date">${post.date}</div>
                <h2 class="post-title">${title}</h2>
                <div class="read-more">${texts.readMore} &rarr;</div>
            </div>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
}

async function loadPost(postId, container, texts) {
    container.innerHTML = `
        <button class="back-btn" onclick="updateState('${currentLang}', null)">${texts.backButton}</button>
        <article id="post-content">
            <div id="loading">${texts.loading}</div>
        </article>
    `;
    
    try {
        const fileName = `posts/${postId}.${currentLang}.md`;
        const response = await fetch(fileName);
        
        if (!response.ok) throw new Error("Post not found");
        
        const markdown = await response.text();

        document.getElementById('post-content').innerHTML = marked.parse(markdown);
        
    } catch (error) {
        document.getElementById('post-content').innerHTML = `<p class="meta">Post not found or error loading.</p>`;
    }
}

async function init() {
    try {
        // 1. Fetch Post List
        const response = await fetch('posts.json');
        config.posts = await response.json();
    } catch (e) {
        console.error("Failed to load posts.json", e);
    }

    // 2. Initial Render
    currentLang = getLanguage();
    const postId = getPostId();
    render(postId);

    // 3. Event Listeners
    document.getElementById('site-title').addEventListener('click', () => updateState(currentLang, null));
    document.getElementById('btn-en').addEventListener('click', () => updateState('en', getPostId()));
    document.getElementById('btn-ko').addEventListener('click', () => updateState('ko', getPostId()));
}

window.addEventListener('popstate', () => {
    currentLang = getLanguage();
    render(getPostId());
});

// Start
document.addEventListener('DOMContentLoaded', init);