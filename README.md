[![License](https://img.shields.io/github/license/ripple/opensource.ripple.com)](https://github.com/ripple/opensource.ripple.com/blob/main/LICENSE)

# Ripple Open Source

The [Open Source Projects site](https://opensource.ripple.com) provides information on open source projects that Ripple engineers are working on, including in-progress documentation for features that are in development.

## Contributing

Contributions from users outside Ripple are welcome but not expected. Ripple makes no promises to respond to issues and pull requests in any particular timeframe, but we welcome contributions made in good faith. If you do contribute to this repo, please abide by the [Code of Conduct](./CODE_OF_CONDUCT.md).

This repository uses [Redocly Realm](https://redocly.com/docs/realm) to serve the site. To set up a local dev environment, recent versions of Node.js and NPM are required. Install dependencies with:

```sh
npm i
```

You can start a local dev server with:

```sh
npm run start
```

Documentation is in `./docs/`, and custom components and templates are in `components/` and `@theme/`. We try to match the style guidelines for docs contributed to the [xrpl-dev-portal](https://github.com/XRPLF/xrpl-dev-portal/), to minimize the effort of porting docs to that site when they are accepted into the general XRP Ledger codebase.


## License

This work is licensed under a [Creative Commons Attribution 4.0 International License][cc-by].

[cc-by]: http://creativecommons.org/licenses/by/4.0/
