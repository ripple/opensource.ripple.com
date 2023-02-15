# Home page

Usually, the home page is something fancy.

However, it can be a plain markdown file.

## Plain markdown home page

To make a plain markdown home page, create a file named `index.md` in your root directory.

It will take precedence over the `index.mdx`.

You may need to hard refresh the home page to see it.

## Add sidebar to home page

To add the sidebar to the home page, you must add the home page to the sidebar.

Open `sidebars.yaml` and add a link to "Home".

```yaml
training:
  - page: index.md
    label: Home
```

Now, change remove that link and delete your `index.md` file.

## MDX pages

MDX allows using React components within markdown files with the file extension `.mdx`.

Open the `index.mdx` file and spend a few minutes reviewing the structure.

If you do want the sidebar navigation with the MDX file, be sure you remove or comment this line, or you will see two top nav bars.

```jsx mdx
<NavBar location={props.location} standalone={false} />
```

### Change Jumbotron text

Let's change the Jumbotron text within the H1 and H2 header components.

```md
<Jumbotron>
  <NavBar location={props.location} standalone={false} />
  <H1>Redocly training</H1>
  <H2>A starter developer portal with training exercises</H2>
```

Next, let's change the buttons.
There is one button enabled.
Let's enable another button.

```md
  <Flex p={20} justifyContent="center">
    <Button inversed large to="https://app.redoc.ly">
      Redocly app
    </Button>
    <Button inversed transparent large to="developer-portal/index.md">
      Get started
    </Button>
```

You'll notice the `inversed`, `transparent`, `large`, and `to` properties on some of those buttons.

Each component has specific properties available to toggle on/off, or to supply with specific values which controls the look or behavior of the component.
More on that topic in our component library documentation.

Components and custom components can be used to make fancy **fancy** pages (limited only by the creativity of your designs).

### Add Jumbotron in the middle of the page

Now, we would like to see what a second Jumbotron would look like in the middle of the page.
We want to call out some tutorials we've worked hard on, and think that would be a good way to do it.

We will start by copying the existing Jumbotron code and edit the H1 and H2 according to our preferences.

```md
<Jumbotron>
  <NavBar location={props.location} standalone={false} />
  <H1>Tutorials</H1>
  <H2>Get setup faster...</H2>
  <Flex p={20} justifyContent="center">
    {/* <Button inversed large to="https://app.redoc.ly">
      Redocly app
    </Button> */}
    <Button inversed transparent large to="developer-portal/index.md">
      Get started
    </Button>
    {/* <Button inversed transparent large>
      Workflows
    </Button> */}
  </Flex>
</Jumbotron>
```

Next, we don't want that navbar or the buttons on this jumbotron, so we delete those.

```md
<Jumbotron>
  <H1>Tutorials</H1>
  <H2>Get setup faster...</H2>
</Jumbotron>
```

We'll paste that right above the section header.

```md
  <Jumbotron>
    <H1>Tutorials</H1>
    <H2>Get setup faster...</H2>
  </Jumbotron>
  <SectionHeader>
    <Emphasis>Need help? </Emphasis>
    Try our training exercises.
  </SectionHeader>
```

Now, we'll try to modify the style of the Jumbotron further.

The component has various properties that can be adjusted including.

Here is an excerpt of properties available.

| Property         | Description                             |
| ---------------- | --------------------------------------- |
| `bgColor`        | Background color                        |
| `bgImage`        | Background image                        |
| `parallaxEffect` | Boolean value to enable parallax effect |

After experimenting, we end up with.

```md
  <Jumbotron parallaxEffect bgImage={icon1}>
    <H1>Tutorials</H1>
    <H2>Get setup faster...</H2>
  </Jumbotron>
```

Notice the usage of the `{icon1}` as the image is imported near the top of the file.

Try to import a different image and use that as the `bgImage`.

MDX is not limited to the home page.
Use it for any page where you want extended usage of React components.
