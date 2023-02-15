# Page table of contents

When the `siteConfig.yaml` file has `toc: {enable: true}` then a page table of contents will appear on the right-hand side when there is more than one header.

For your training exercise, you will try to disable the page table of contacts by default across the website.

Go into the `siteConfig.yaml` file and change `toc: {enable: true}` to `toc: {enable: false}`. ✅

Be sure to save the `siteConfig.yaml`. Did you notice the page table of contents disappear?

Now, enable it on this page, without enabling it across every page by default.

To do that, you'll need to learn about front matter.
Front matter is at the top of a markdown file before the displayed content.
You can control the title tags, meta keywords and description tags, and more.
We will use it to enable the table of contents.

Add this snippet to the very top of the page.

```md
---
toc:
  enable: true
---
```

✅✅✅

Now, we'll try the reverse.

In `siteConfig.yaml`, change to `toc: {enable: true}`.

Then try and disable the page table of contents on this page.

Could you figure it out?

Great!

You can also control the depth of the toc:

```yaml
toc:
  enable: true
  maxDepth: 2 # will set the max depth for heading level 2
```

# Rock

I like rocks.

# Paper

I love paper.

# Scissors

Ugh... I am left-handed.
