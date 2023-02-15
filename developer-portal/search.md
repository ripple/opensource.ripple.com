# Search

We can enable, disable, or change the order the search box appears.

Also, the actual search index functionality does not work in the development server environment.

## Disable the search box

Open the `siteConfig.yaml`.

```yaml before
- search: true
```

```yaml after
#  - search: true
```

The `#` acts as a "comment" token for the rest of the yaml line.

## Enable the search box

Now, we remove the `#` comment, or add back the line.

```yaml
nav:
  - label: Training exercises
    page: developer-portal/index.md

  - label: External docs
    href: https://docs.redoc.ly/developer-portal/introduction/

  - search: true
```

Notice that search is defined within the `nav` section.

## Display search first

We move `search` first in the `nav` definition.

```yaml
nav:
  - search: true

  - label: Training exercises
    page: developer-portal/index.md

  - label: External docs
    href: https://docs.redoc.ly/developer-portal/introduction/
```

Notice the change on the top navigation.
