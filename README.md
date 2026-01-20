# The Quiet Observer 🏛️

A minimalist, bilingual philosophy blog. Write in Markdown, sync with Python, and read in peace.

## Getting Started

Since the blog fetches content dynamically, use a local server to view it:

1. Start a simple server:
   ```bash
   python3 -m http.server 8000
   ```
2. Visit `http://localhost:8000`.

## How to Add a Post

1. Create Markdown files in `posts/` as `id.en.md` and `id.ko.md`.
2. Start the file with `# Title` and `###### Date`.
3. Update the post list:
   ```bash
   python3 build.py
   ```

© 2025 The Quiet Observer.