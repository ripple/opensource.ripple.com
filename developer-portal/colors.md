# Colors

> “Color is a power which directly influences the soul.” - Wassily Kandinsky

Colors are set within the `theme.ts` file.
The `theme.ts` file contains a typescript variable named `theme` which controls the colors, styles and typography.

```ts
export const theme = {
```

The included `theme.ts` includes all of the configuration options (most are commented out as default settings with two slashes `//`).
Uncomment them to override the theme.

## Change the primary color

Find this section of the theme file.

```ts
  colors: {
    // tonalOffset: 0.2,
    primary: {
      main: '#227a88',
      // light: ({ colors }) => lighten(colors.tonalOffset, colors.primary.main),
      // dark: ({ colors }) => darken(colors.tonalOffset, colors.primary.main),
      // contrastText: ({ colors }) => readableColor(colors.primary.main),
    },
```

Change the color.
Not sure what to change it to?
Try randomly guessing a hexadecimal value (0-9 and a-f are valid values).
It also accepts human friendly colors like `orange`.

## Change the primary text color

Or not...

```ts
    text: {
      primary: '#424242',
      // secondary: '#4e566d',
    },
```

## Change the footer background color

Pick a color.

Or change any other colors you want.

```ts
    footer: {
      main: '#424242',
      // main: ({ colors }) => colors.primary.main,
      contrastText: 'white'
    },
```

## Free time

Play with some various colors.

Notice you can use typescript to calculate colors, if you wish.
That is beyond the scope of this training exercise.
