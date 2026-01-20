# The Quiet Observer - Project Overview

This project is a personal blog designed to hold profound philosophical thoughts and essays. It focuses on a minimal design and a seamless user experience, built using Vanilla JS and Markdown.

## 🚀 Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), CSS3 (Custom Variables), HTML5
- **Content**: Markdown (`.md`) - Parallel English/Korean versions
- **Parser**: `marked.min.js` (Client-side rendering)
- **Build Tool**: Python 3 (`build.py`) - Generates post metadata (`posts.json`)
- **SEO**: Dynamic Meta Tags, `sitemap.xml`, `robots.txt`
- **Hosting**: GitHub Pages

## ✨ Key Features
1. **Dual Language Support (EN/KO)**
   - Automatic initial setup through browser language detection.
   - Permanent language choice persistence via cookies.
   - Clean language switching without URL parameters.
2. **State Persistence**
   - Last viewed page number is stored in cookies.
   - Restores the previous list state when returning from a post to the list.
3. **Advanced Pagination**
   - Displays 10 posts per page.
   - Grouped navigation in units of 5 pages.
   - Sleek SVG icons and mobile optimization (prevents horizontal scrolling).
4. **Search Engine Optimization (SEO)**
   - Dynamic updates of `<title>` and `meta description` upon loading a post.
   - Sitemaps and robot configurations based on the actual domain (`pw486.github.io/observer/`).
5. **Dark Mode**
   - System preference detection and user choice persistence via cookies.
   - Logic applied to prevent theme flashing during transitions.

## 📂 Project Structure
- `index.html`: Main layout and SEO tags.
- `style.css`: Design system and responsive layout.
- `script.js`: Routing, fetching, and state management logic.
- `posts/`: 72 high-quality essays (stored in pairs).
- `posts.json`: Post IDs, titles, and date data (auto-generated).
- `build.py`: Script to update `posts.json` by parsing Markdown headers.

## 📝 Operational Guide
1. **Adding a Post**: Create `.en.md` and `.ko.md` files in the `posts/` folder.
   - Titles must follow the `# Title` format.
   - Dates must follow the `###### January 20, 2026` (EN) or `###### 2026년 1월 20일` (KO) format.
2. **Synchronization**: After adding or modifying a post, run `python3 build.py` to update `posts.json` for the changes to appear in the list.
3. **SEO Updates**: If the list of posts changes significantly, it is recommended to regenerate the sitemap following the logic in the SEO generation scripts.