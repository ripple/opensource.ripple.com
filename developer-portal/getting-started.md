---
title: Getting started
---

# Getting started with **Redocly Portal**

This page lists steps to install and run the **Portal**.

---

### Before you begin

Before installing the **Redocly Portal**, make sure to do the following:

- Install [`npm`](https://www.npmjs.com/get-npm) or [`yarn`](https://yarnpkg.com/lang/en/docs/install/#windows-stable). These package managers work across all the major operating systems).
- Know how to run the commands from the CLI (for example, `yarn install`). For Windows, we recommend using Git Bash.
- Know the [basic git techniques](https://docs.gitlab.com/ee/gitlab-basics/start-using-git.html) (creating a branch, committing, and in our examples, opening a pull request on GitHub.)
- Get familiar with Markdown. We recommend using the [Visual Studio Code](https://code.visualstudio.com/download) application to manage your files.

<!-- /to do: add links to additional info to the each item./
If any of these assumptions are incorrect, please let us know and we can find resources to help you acquire that knowledge. -->

### Install the Portal

1. Clone the GitHub repository shared by Redocly.

```bash
git clone <url provided by Redocly>
```

2. Install the project.

```bash
yarn install
```

:::attention Note:

If an error occurs during the installation, delete the `yarn.lock` file, and then try to install **Redocly Portal** again.

:::

```bash Remove yarn.lock
rm yarn.lock
```

```bash yarn install
yarn install
```

If the installation problem persists, please contact the [Redocly support](https://redoc.ly/contact-us).

### Run the **Portal**

```bash
yarn start
```

You can now preview your files on the local server. The corresponding address will be displayed in the terminal.
