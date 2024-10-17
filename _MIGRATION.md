# Manual migration instructions


## MDX files

Please, review and migrate MDX files manually:

- `index.mdx`

## RBAC

Please, review RBAC changes as the RBAC configuration format has changed completely: https://redocly.com/docs/realm/setup/concepts/rbac


## Theme

Migrate theme settings manually: https://redocly.com/docs/realm/get-started/migrate-from-legacy-portal#migrate-theme

Remove the `theme.ts` file after migration.

## Adjust config

- Consider removing the following from your redocly.yaml if you are able to solve all Markdoc and link issues:
  ```yaml
  reunite:
    ignoreMarkdocErrors: true
    ignoreLinkChecker: true
  ```

- In addition, if you want your website to be public, remove the `requiresLogin: true` from `redocly.yaml`.


## After migration

Remove this `_MIGRATION.md` file after migration.