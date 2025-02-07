import { Schema, Tag } from '@markdoc/markdoc';

export const codePageName: Schema & { tagName: string } = {
  tagName: 'code-page-name',
  attributes: {
    name: {
      type: 'String',
      required: false,
    },
  },
  transform(node, config) {
    const attributes = node.transformAttributes(config);
    attributes["name"] = config.variables.frontmatter.seo.title;
    return new Tag(this.render, attributes);
  },
  render: 'CodePageName',
  selfClosing: true,
};

export const badge: Schema & { tagName: string } = {
  tagName: 'badge',
  attributes: {
    color: {
      type: 'String',
      required: false,
      default: ""
    },
    href: {
      type: 'String',
      required: false
    },
    date: { // Not displayed, but useful for knowing how old an 'updated' badge is
      type: 'String',
      required: false
    }
  },
  render: 'Badge'
};

export const notEnabled: Schema & { tagName: string } = {
  tagName: 'not-enabled',
  render: 'NotEnabled',
  selfClosing: true,
};

export const tryIt: Schema &  { tagName: string } = {
  tagName: 'try-it',
  attributes: {
    method: {
      type: 'String',
      required: true
    },
    server: {
      type: 'String',
      required: false,
      default: ""
    }
  },
  render: 'TryIt',
  selfClosing: true
}

export const txExample: Schema &  { tagName: string } = {
  tagName: 'tx-example',
  attributes: {
    txid: {
      type: 'String',
      required: true
    },
    server: {
      type: 'String',
      required: false,
      default: ""
    }
  },
  render: 'TxExample',
  selfClosing: true
}
