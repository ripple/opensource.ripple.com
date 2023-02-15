---
title: Configuration
---

# Configuration

This page describes how to organize the files and folders and how to configure the look and feel of the **Portal**.

---

## Overview

To start working with **Redocly Portal**, please get familiar with the following:

- The [Markdown](https://www.markdownguide.org/basic-syntax/) syntax. We recommend using [**Visual Studio Code**](https://code.visualstudio.com/) for writing and maintaining your files.
- File management basics.

## Organizing content

### Folders

The following special folders will be created automatically within your project:

1. **images**/ – you can keep your images in this folder.
2. **node_modules**/ – do not remove or modify the contents of this folder. It contains the software library dependencies.

We recommend creating folders based on your content, and then organizing the content within one root folder:

```bash
[_folder_name_]/
```

**Important**: The folder naming influences the URL paths of the published website.

### File types

**Markdown files**

A regular Markdown file ends with a `.md` file extension. Use regular Markdown files when your content doesn't require any special components.

**MDX files**

An MDX extension file ends with a `.mdx` file extension. Learn more about [using MDX here](mdx.mdx).

**Special files**

The following files must be kept at the top level of the project structure.
If needed, you can change the contents of these files to configure look and feel of the **Portal**.

| File              | Description                                                                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.mdx`       | The home page of the **Portal**.                                                                                                                                                                                    |
| `siteConfig.yaml` | In this file, you can do the following: <br> <ul><li>Set up persistent navigation and logo.</li><li>Declare API definitions and stylesheets.</li><li>Add custom scripts.</li><li>Set up google analytics.</li></ul> |
| `theme.ts`        | Controls the fonts and colors used throughout the **Portal**.                                                                                                                                                       |
| `sidebars.yaml`   | Controls the [sidebar navigation](./sidebar-nav.md) among contents.                                                                                                                                                 |
| `favicon.png`     | Displays the favicon.                                                                                                                                                                                               |

For more details, see [Customizing Portal](./custom-portal.md).

Also, you can include your OpenAPI `.yaml` or `.json` file directly in the **Portal** to be able to generate the API reference pages.

For more details, see [Integrating API Reference](./redoc-integration.md).
