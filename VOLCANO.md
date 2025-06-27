# Ripple Open Source

The [Open Source Projects site](https://opensource.ripple.com) provides information on open source projects that Ripple engineers are working on, including in-progress documentation for features that are in development, especially proposed changes and extensions to the [XRP Ledger](https://xrpl.org) protocol.

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

Documentation is in `docs/`, and custom components and templates are in `components/` and `@theme/`. For proposed XRP Ledger features, we try to match the documentation style of the [xrpl-dev-portal](https://github.com/XRPLF/xrpl-dev-portal/), to minimize the effort of porting docs to that site when they are accepted into the general XRP Ledger codebase.

PRs from within the repo get a preview build automatically. (In the automated checks section, under **Project preview** click the "..." and "→ View details".) PRs from outside forks do not get a preview build, for security reasons. The site automatically deploys to production when changes are merged to the `main` branch.


## License

This work is licensed under a [Creative Commons Attribution 4.0 International License][cc-by].

[cc-by]: http://creativecommons.org/licenses/by/4.0/
