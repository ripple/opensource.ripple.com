---
title: Integrating API reference docs
---

# Integrating API reference docs into your developer portal

## Step 1: Declare your API definition(s)

Inside of `siteConfig.yaml`, declare of all of your API definitions.
The definition may be in a [multi-file format](https://redoc.ly/docs/resources/multi-file-definitions/) or already bundled. It may be in JSON or YAML format.

You'll use the key name for further reference within the developer portal.

```yaml
oasDefinitions:
  acme: ./openapi/acme.yaml
```

The value may also be a remote URL:

```yaml
oasDefinitions:
  acme: https://example.com/acme.yaml
```

And an API registry URL:

```yaml
oasDefinitions:
  acme: https://api.redoc.ly/registry/testing_acme/adam-api/1.0/bundle/main/openapi.yaml
```

The benefit of using the API registry (if you use your production "latest" snapshot URL) is that the developer portal will rebuild when that API is updated.
Your docs won't be outdated.

If you use a private registry URL, you will need to use the [openapi login command](https://redoc.ly/docs/cli/commands/login/) to log in for local development.

### Declare multiple APIs

You can also declare multiple API definitions:

```yaml
oasDefinitions:
  acme: https://api.redoc.ly/registry/testing_acme/adam-api/1.0/bundle/main/openapi.yaml
  acme-v2: https://api.redoc.ly/registry/testing_acme/adam-api/2.0/bundle/main/openapi.yaml
  my-api: https://api.redoc.ly/registry/testing_acme/my-api/1.0.0/bundle/main-branch/openapi.yaml
```

## Step 2: Add pages that reference the definitions

Manually create a file `reference.page.yaml` (you may name it differently, but it **must** have the `.page.yaml` file extension) with the following example contents:

```yaml Single API
type: reference-docs
definitionId: acme
settings:
  jsonSampleExpandLevel: 'all'
```

```yaml Multi-versions API
type: reference-docs
versions:
  - definitionId: acme
    id: v1
    title: Acme V1
    isDefault: false
  - definitionId: acme-v2
    id: v2
    title: Acme V2
    isDefault: true

settings:
  jsonSampleExpandLevel: 'all'
```

**Supported fields in `.page.yaml` files**

| Field          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`         | Must be set to `reference-docs`. This field is required.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `definitionId` | References the key(s) declared in the `siteConfig.yaml`. In this example, `acme` is declared as the key. Do not declare the `definitionId` if you declare `versions`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `versions`     | If the API has multiple versions and you want a version selector to appear then define `versions` instead of `definitionId`. The `versions` is an array with one node per version. Each node must contain a `definitionId`. It may also contain an `id`, `title`, and `isDefault` value.<br><br>The `id` is used in the URL path segment (if not defined it will default to the `definitionId` value.<br><br>The `title` is used in the select menu to display to the user (if not defined it will default to the `definitionId`.<br><br>The `isDefault` will be the version that is pre-selected (if not defined it will default to the first defined version).<br><br>The select menu will be ordered in the same way as the versions array. |
| `label`        | (optional) Define a custom label to use as the title for the API Overview page in the portal sidebar. If not defined, the value of `info.title` from the API definition is used by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `settings`     | (optional) Add any of [Redocly's settings](https://redoc.ly/docs/api-reference-docs/configuration/) to this object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

The location of the page.yaml file determines the URL path segment(s) for the API reference.
A file such as `/openapi/foo.page.yaml` will be displayed at `/openapi/foo/`.

### Set up pagination for integrated Reference docs

Your integrated Reference docs can optionally use pagination. The configuration settings and the behavior of this functionality are compatible with standalone Reference docs, ensuring a consistent user experience.

The following pagination modes are supported:

- `none` - no pagination. All content is displayed as one continuously scrolling page.

- `section` - each section is displayed as its own page. Tags and tag groups are treated as sections, so all operations grouped under one tag would be displayed on one page. In this mode, tag description text is displayed on the section page together with the operations. Every page automatically gets a **Next to...** navigation button at the bottom.

- `item` - each operation is displayed as its own page, regardless of tags and grouping. In this mode, tag description text is displayed on its own separate page. If a tag doesn't have a description, selecting the tag in the sidebar expands the group to show operations under it. Every page automatically gets a **Next to...** navigation button at the bottom.

To enable pagination, add any of the modes to the `settings` section of the `.page.yaml` file:

```yaml
type: reference-docs
definitionId: acme
settings:
  pagination: section
  showConsole: true
```

When enabled, pagination settings apply to all versions defined in the `.page.yaml` file.

Keep in mind that:

- data models always render as separate pages (in both `section` and `item` modes).

- Markdown text from the `info.description` field of the API definition always behaves like a section. In `item` mode, it is displayed all on one page, instead of split into separate pages.

:::warning **Important**

We strongly recommend you rebuild the portal after modifying pagination settings to avoid potential caching issues.
:::

### Show or hide content in integrated Reference docs

**API overview page**

By default, your integrated Reference docs will have an API overview page. This page contains basic information about the API generated from the `info` object in your API definition (the same as in standalone Reference docs).

To hide the entire API overview page, set `hideInfoSection` to `true`:

```yaml
type: reference-docs
definitionId: acme
settings:
  hideInfoSection: true
```

To hide only the download button on the API overview page, set `hideDownloadButton` to `true`:

```yaml
type: reference-docs
definitionId: acme
settings:
  hideDownloadButton: true
```

When you add Reference docs to the portal sidebar, the API overview page is automatically included as its own sidebar item. It uses the `info.title` value from the API definition as the item name. You can override this by defining a custom `label` in the `.page.yaml` file:

```yaml
type: reference-docs
definitionId: acme
label: ACME Docs Overview
settings:
  pagination: section
  showConsole: true
```

**Markdown descriptions**

By default, all Markdown text from the `info.description` field of your API definition is visible in the integrated Reference docs. To hide it, set `hideInfoDescription` to `true`:

```yaml
type: reference-docs
definitionId: acme
settings:
  hideInfoDescription: true
```

This will keep other information from the `info` section in your Reference docs (such as `externalDocs`, `version` and the download button) while hiding all Markdown from `info.description`.

**Authentication**

By default, an authentication section is added to your `info.description` and displayed in integrated Reference docs. To hide it, set `noAutoAuth` to `true`:

```yaml
type: reference-docs
definitionId: acme
settings:
  noAutoAuth: true
```

If you hide the `info` section by setting `hideInfoSection: true`, links to the authentication section from other parts of the documentation are automatically disabled, since there is no target content for them to link to.

## Step 3: Include the pages in the sidebar (or other places)

Here is an example snippet within the `sidebars.yaml`:

```yaml All operations (grouped)
pages:
  - page: reference.page.yaml
```

```yaml All operations (wildcard without the group)
pages:
  - page: reference.page.yaml/*
```

```yaml Single operation
pages:
  - page: reference.page.yaml#operation/createUsersWithArrayInput
```

The first example "All operations (grouped)" puts the API in the sidebar inside of a group labeled with the name of the API.

The second example "All operations (wildcard without the group)" puts the API in the sidebar without any explicit group. You may define a group if you wish in the sidebars.yaml.

The third example "Single operation" puts a single operation into the sidebar.

Keep in mind, any given operation can only be referenced once within the sidebars. A sidebar with both `reference.page.yaml` and `reference.page.yaml#operation/createUsersWithArrayInput` would have a conflict because the `createUsersWithArrayInput` operation is already included in the `reference.page.yaml`.

## Step 4: Render API reference docs in MDX pages

When you have declared your API definitions, you can use their `definitionId` with React components to display API reference docs in MDX pages. Pointers allow you to target and display specific parts of the API documentation.

The following components work with API reference docs:

- [JsonSchema](https://redoc.ly/docs/developer-portal/components/json-schema/)
- [OpenApiCodeSample](https://redoc.ly/docs/developer-portal/components/openapi-code-sample/)
- [OpenApiExample](https://redoc.ly/docs/developer-portal/components/openapi-example/)
- [OpenApiRequestBody](https://redoc.ly/docs/developer-portal/components/openapi-request-body/)
- [OpenApiResponse](https://redoc.ly/docs/developer-portal/components/openapi-response/)
- [OpenApiTryIt](https://redoc.ly/docs/developer-portal/components/openapi-tryit/)

They are supported by default in the portal. You can also develop your own components.

To display API reference docs in an `.mdx` file, first import the React component, such as `OpenApiResponse`:

```jsx
import { OpenApiResponse } from '@redocly/developer-portal/ui';
```

Then you can use it as follows:

**With code samples panel**

```html
<OpenApiResponse definitionId="acme" pointer="#/components/responses/CoyoteResponse" />
```

**Without code samples panel**

```html
<OpenApiResponse
  definitionId="acme"
  pointer="#/components/responses/CoyoteResponse"
  hideSamples="{true}"
/>
```
