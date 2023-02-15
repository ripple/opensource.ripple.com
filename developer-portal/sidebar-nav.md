---
title: Control your left sidebar navigation
---

# Sidebar training exercises

It's hard to dive in without reading the [sidebar docs](https://docs.redoc.ly/developer-portal/sidebar-nav/).
Do that before continuing to the exercises.

## Add/remove a page to the sidebar

When a page is linked from the sidebar, it will render with the sidebar.
When a page is not linked from the sidebar, it will render without any sidebar.

Open the [upgrade page](upgrade.md) in a new tab.

Notice it renders without any sidebar.

### Add the upgrade page to the sidebar

```yaml Before
training:
  - group: Developer portal starter
    expanded: true
    pages:
      - label: Training exercises
        page: developer-portal/index.md
      - separator: This is a separator
      - label: Setup
        page: developer-portal/setup.md
      - label: Markdown
        page: developer-portal/markdown.md
```

```yaml After
training:
  - group: Developer portal starter
    expanded: true
    pages:
      - label: Training exercises
        page: developer-portal/index.md
      - separator: This is a separator
      - label: Setup
        page: developer-portal/setup.md
      - label: Upgrade
        page: developer-portal/upgrade.md
      - label: Markdown
        page: developer-portal/markdown.md
```

Now, load the upgrade screen and see the sidebar.

## Sidebar nesting-levels

Sidebar nesting is controlled by the `group` keyword.
Groups can be nested within each other up to 7 levels deep.

Move the upgrade page to display at the very bottom of the sidebar on the left-most side underneath the Petstore reference section.

:::attention
Pay attention to the indentation spacing.
:::

```yaml
- group: Petstore reference
  expanded: false
  pages:
    - page: openapi/reference.page.yaml/*
- label: Upgrade
  page: developer-portal/upgrade.md
```

## Changing labels

Let's change the label on that from `Upgrade` to `Upgrade instructions`.

```yaml
- label: Upgrade instructions
  page: developer-portal/upgrade.md
```

## Adding a separator

Add a separator above the upgrade instructions page.

```yaml
- separator: Admin
- label: Upgrade instructions
  page: developer-portal/upgrade.md
```

## Add deep nesting in the sidebar

Let's move the upgrade instructions into nested groups.
An important thing to note is that changing the sidebar nesting does not change the URL path structure.

We will change it to this here.
It shows us how we can nest groups.
Groups can contain groups and pages.
This is deeper nesting than you will ever need.

```yaml
- group: Admin
  expanded: true
  pages:
    - group: Routine
      expanded: true
      pages:
        - group: Rock
          expanded: true
          pages:
            - group: Paper
              expanded: true
              pages:
                - group: Scissors
                  expanded: true
                  pages:
                    - group: 1-2-3
                      expanded: true
                      pages:
                        - group: Go
                          expanded: true
                          pages:
                            - label: Upgrading
                              page: developer-portal/upgrade.md
```

## Add another sidebar

A page should appear in zero or one sidebars.

At the top-level of the sidebar is a key (`training` in our starter project here).

Your developer portal may have more than one sidebar.

See that demo in the `sidebars.yaml`.

```yaml
alternative:
  - page: developer-portal/sidebar-alternative.md
    label: Alternative sidebar example
```

Visit the [sidebar alternatives page](sidebar-alternative.md) to see it.
