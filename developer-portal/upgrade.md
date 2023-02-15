# Upgrade to a different version

Make sure you have committed any changes prior to attempting an upgrade.
It's a good idea to isolate an upgrade to a single commit.

## Update package.json

Find the `@redocly/developer-portal` in the `@dependencies` section of the `package.json` file.

```json
  "dependencies": {
    "@redocly/developer-portal": "^1.1.0-beta.34"
  }
```

Update the version there (note, this may be the most current version already).

Check the [published versions on NPM](https://www.npmjs.com/package/@redocly/developer-portal).

```json
  "dependencies": {
    "@redocly/developer-portal": "^1.1.0-beta.35"
  }
```

Save the file.

## Run yarn install

```bash
yarn install
```

This command will upgrade to the newer version of the developer portal.

## Troubleshooting

If you hit a problem with the installation, you may want to try to delete your `yarn.lock` file and then `yarn install` again.
Some dependencies are pinned based on the underlying OS or node version.

```bash
rm yarn.lock
rm -rf node_modules
yarn install
yarn clean
```

Still stuck? Contact us. We're happy to help.
