# The Quiet Observer 🏛️

A minimalist, philosophy blog designed for deep reflection and quiet reading.

## 🚀 Getting Started

### Prerequisites

- Python 3.x (for building the post index and local testing)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PW486/the-quiet-observer.git
   cd the-quiet-observer
   ```

2. **Start a local server**:
   ```bash
   python3 -m http.server 8000
   ```

3. **View the blog**:
   Open `http://localhost:8000` in your browser.

## ✍️ How to Add a Post

1. **Create Markdown files** in the `posts/` directory:
   - `post-id.en.md` for English.
   - `post-id.ko.md` for Korean.
   
2. **Format the content**:
   - Start with a `# Title` (H1).
   - Follow with a `###### Date` (H6, e.g., `January 20, 2026`).

3. **Regenerate the index**:
   ```bash
   python3 build.py
   ```
   This updates `posts.json`, which the frontend uses to list and load content.
