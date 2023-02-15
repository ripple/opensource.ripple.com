---
title: Organizing files
---

# Organizing files

This page describes the file types used in **Redocly Portal** and their organization specifics.

---

When you create new content, start by creating a file within a folder.
For details on file types used in **Redocly Portal**, see [Configuration](configuration.md).

## Files organization sample

Your files should be organized into folders. The folder naming is reflected in the URL path.

```bash
├── ./README.md
├── ./contact.mdx
├── ./faq.md
├── ./favicon.png
├── ./images
│   ├── ./images/book-management.svg
│   ├── ./images/external-link-dark.svg
│   ├── ./images/found-or-private.svg
│   ├── ./images/icon1.png
│   ├── ./images/icon3.png
│   ├── ./images/launch-fast.svg
│   ├── ./images/logo.png
│   └── ./images/logo.svg
├── ./index.mdx
├── ./openapi
│   └── ./openapi/petstore.yaml
├── ./package.json
├── ./reference.page.yaml
├── ./sidebars.yaml
├── ./siteConfig.yaml
├── ./theme.ts
├── ./developer-portal
│   ├── ./developer-portal/creating-files.md
│   ├── ./developer-portal/development-tips.md
│   ├── ./developer-portal/footer-navigation.md
│   ├── ./developer-portal/installation.md
│   ├── ./developer-portal/introduction.md
│   ├── ./developer-portal/markdown-extensions.mdx
│   ├── ./developer-portal/markdown.md
│   ├── ./developer-portal/redoc-integration.md
│   ├── ./developer-portal/sidebar-nav.md
│   └── ./developer-portal/top-navigation.md
└── ./yarn.lock
```

In this example, most of my content is organized into the `developer-portal` folder.

The more content you create, the more you may want to organize it into more sub-folders.
