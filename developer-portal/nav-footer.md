# Top nav and footers customization

The top nav and footers are defined in the `siteConfig.yaml` file.

## Change a top nav label

Let's rename the link from training exercises to training program.

```yaml Before
nav:
  - label: Training exercises
    page: developer-portal/index.md

  - label: External docs
    href: https://docs.redoc.ly/developer-portal/introduction/

  - search: true
```

```yaml After
nav:
  - label: Training program
    page: developer-portal/index.md

  - label: External docs
    href: https://docs.redoc.ly/developer-portal/introduction/

  - search: true
```

## Add a link to your favorite exercise

Add a link to a page within the developer portal with the `label` and `page` information.

```yaml
nav:
  - label: Training program
    page: developer-portal/index.md

  - label: Markdown exercises
    page: developer-portal/markdown.md

  - label: External docs
    href: https://docs.redoc.ly/developer-portal/introduction/

  - search: true
```

## Add a link to your favorite website

Add a link to your favorite external website.
Notice the `href` (instead of the `page`) and `label`.
The `href` value must be a fully qualified URL.

```yaml
nav:
  - label: Training program
    page: developer-portal/index.md

  - label: Markdown exercises
    page: developer-portal/markdown.md

  - label: Favorite website
    href: https://redoc.ly

  - label: External docs
    href: https://docs.redoc.ly/developer-portal/introduction/

  - search: true
```

## Fix the copyright notice

Our lawyer just called and said the copyright should have LLC after Redocly.
Please adjust the notice.

```yaml
footer:
  copyrightText: Copyright © Redocly 2019-2020. All right reserved.
```

```yaml
footer:
  copyrightText: Copyright © Redocly LLC 2019-2020. All right reserved.
```

## Add a footer column

Add a column in between legal and support named products.

Here is the original `footer` section.

```yaml
footer:
  copyrightText: Copyright © Redocly LLC 2019-2020. All right reserved.
  columns:
    - group: Legal
      items:
        - label: Terms of Use
          href: 'https://redoc.ly/subscription-agreement/'
        - label: Privacy Notice
          href: 'https://redoc.ly/privacy-policy/'
        - label: Cookie Notice
          href: 'https://redoc.ly/privacy-policy/'
    - group: Support
      items:
        - label: FAQ
          page: faq.md
        - label: Contact us
          page: contact.mdx
```

Each item in a group may link to either a `page` or an `href`.

```yaml
footer:
  copyrightText: Copyright © Redocly LLC 2019-2020. All right reserved.
  columns:
    - group: Legal
      items:
        - label: Terms of Use
          href: 'https://redoc.ly/subscription-agreement/'
        - label: Privacy Notice
          href: 'https://redoc.ly/privacy-policy/'
        - label: Cookie Notice
          href: 'https://redoc.ly/privacy-policy/'
    - group: Product
      items:
        - label: Reference docs
          href: 'https://docs.redoc.ly/api-reference-docs/getting-started/'
        - label: Developer portal
          href: 'https://docs.redoc.ly/developer-portal/introduction/'
        - label: CI/CD workflows
          href: 'https://docs.redoc.ly/ci-cd-workflows/'
    - group: Support
      items:
        - label: FAQ
          page: faq.md
        - label: Contact us
          page: contact.mdx
```

You may also override the navbar and footer components.
That is beyond the scope of this training program.
