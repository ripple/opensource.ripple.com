# Typography

## Change the font

Import your font(s).
Fonts are imported in the `siteConfig.yaml` file.

```yaml
stylesheets:
  - https://fonts.googleapis.com/css?family=Roboto:300,400,600,700
```

We'll add another font.

```yaml
stylesheets:
  - https://fonts.googleapis.com/css?family=Roboto:300,400,600,700
  - https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700&display=swap
```

Add fonts from any sources (as long as you have the license to do so).

Adjust the fonts in the typography sections of `theme.ts`.

```ts
  typography: {
    fontSize: '16px',
    lineHeight: '1.5em',
    fontWeightRegular: '400',
    fontWeightBold: '600',
    fontWeightLight: '300',
    fontFamily: '"Source Sans Pro", sans-serif',
    headings: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontWeight: '600',
    },
```

Notice that "Source Sans Pro" is in quotes because of the spaces in the name.

Also, adjust the `fontSize` and experiment to find your style.
