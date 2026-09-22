import { Schema, Tag } from '@markdoc/markdoc';
import type { MarkdocTagSchema } from '@redocly/theme/markdoc/tags/types';
import { sourceLinkForLlms } from '../components/SourceLink';
import { ResposiveGraphicForLlms } from '../components/ResponsiveGraphic'
import { amendmentDisclaimerForLlms } from '../components/Amendments';

export const sourceLink: MarkdocTagSchema & { tagName: string } = {
    tagName: 'source-link',
    selfClosing: true,
    attributes: {
      path: {
        type: 'String',
        required: true,
      },
      name: {
        type: 'String',
        required: false,
      },
    },
    transform(node, config) {
        const attributes = node.transformAttributes(config);
        attributes["xrpld_release"] = config.variables.env.PUBLIC_XRPLD_RELEASE;
        return new Tag(this.render, attributes);
    },
    render: 'SourceLink',
    renderForLlms: sourceLinkForLlms,
};

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

export const amendmentDisclaimer: MarkdocTagSchema &  { tagName: string } = {
  tagName: 'amendment-disclaimer',
  attributes: {
    name: {
      type: 'String',
      required: true
    },
    compact: {
      type: 'Boolean',
      required: false,
      default: false
    },
    statusOnly: {
      type: 'Boolean',
      required: false,
      default: false
    },
    mode: {
      type: 'String',
      required: false,
      default: '' // empty string for "Requires ... / Added by ..."
    }
  },
  render: 'AmendmentDisclaimer',
  renderForLlms: amendmentDisclaimerForLlms,
  selfClosing: true
}

export const responsiveGraphic: MarkdocTagSchema & { tagName: string } = {
  tagName: 'responsive-graphic',
  attributes: {
    alt: {
      type: 'String',
      required: true
    },
    desktop: {
      type: 'String',
      required: true,
      resolver: 'link'
    },
    mobile: {
      type: 'String',
      required: true,
      resolver: 'link'
    }
  },
  render: 'ResponsiveGraphic',
  renderForLlms: ResposiveGraphicForLlms,
  selfClosing: true,
};
