---
title: Mermaid diagrams
---

# Mermaid diagrams

You can insert [mermaid](https://mermaidjs.github.io/) charts and diagrams directly into markdown. This allows you to adhere to the docs-as-code philosophy. To insert a diagram, create a code block and specify the `mermaid` language.

A [live mermaid diagram editor](https://mermaid.live/) can be helpful when writing diagrams.

:::attention Dependencies

Mermaid requires heavy dependencies to render, so we offload that to a microservice we host in AWS.
If you do not want to send data to our microservice, do not use Mermaid diagrams.

:::

## An example of a flowchart

To see the flowchart, you can paste this onto the Markdown page.

````md
```mermaid
graph LR
    Install --> Markdown --> Paths --> Mermaid --> ?
```
````

## Edit the flowchart

This training course won't cover the mermaid library in much depth.

We will replace the `?` in the flowchart with what's up next:

- page table of contents

Try to edit this page and replace the `?` with `TOC`.

Now, try to replace that with `Table of contents`.
You should see an error if you replaced it like this.

````md
```mermaid
graph LR
    Install --> Markdown --> Paths --> Mermaid --> Table of contents
```

Error: Parse error on line 2: ...> Mermaid --> Table of contents -----------------------^ Expecting 'SEMI', 'NEWLINE', 'EOF', 'AMP', 'START_LINK', 'LINK', got 'ALPHA'
````

The space causes mermaid to error. Fix it using this escape technique.

````md
```mermaid
graph LR
    Install --> Markdown --> Paths --> Mermaid --> TOC[Table of contents]
```
````

## Extra credit

You could spend a day trying all of the different kinds of mermaid diagrams.

You could try to reproduce the diagram on Redocly's [docs homepage](https://redocly.com/docs/).
