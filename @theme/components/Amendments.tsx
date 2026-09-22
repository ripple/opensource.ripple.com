import * as React from 'react';
import type { Node } from '@markdoc/markdoc'
import { Link } from '@redocly/theme/components/Link/Link'

function shieldsIoEscape(s: string) : string {
  return s.trim()
    .replace(/-/g, '--')
    .replace(/_/g, '__')
    .replace(/%/g, '%25')
}

export function Badge(props: {
    children: React.ReactNode
    color: string
    href: string
}) {
    const DEFAULT_COLORS : {[key:string] :string} = {
      "open for voting": "80d0e0",
      "expected": "blue",
      "enabled": "green",
      "obsolete": "red",
      "removed in": "red",
      "new in": "blue",
      "updated in": "blue",
      "in development": "lightgrey",
      "inactive": "lightgrey",
    }

    let childstrings = ""

    React.Children.forEach(props.children, (child, index) => {
      if (typeof child == "string") {
        childstrings += child
      }
    })

    const parts = childstrings.split(":")
    const left : string = shieldsIoEscape(parts[0])
    const right : string = shieldsIoEscape(parts.slice(1).join(":"))

    let color = props.color
    if (!color) {
      if (DEFAULT_COLORS.hasOwnProperty(left.toLowerCase())) {
        color = DEFAULT_COLORS[left.toLowerCase()]
      } else {
        color = "lightgrey"
      }
    }

    let badge_url = `https://img.shields.io/badge/${left}-${right}-${color}.svg`

    if (props.href) {
      return (
        <Link to={props.href}>
          <img src={badge_url} alt={childstrings} className="shield" />
        </Link>
      )
    } else {
      return (
        <img src={badge_url} alt={childstrings} className="shield" />
      )
    }
}

function AmendmentBadge(props: { name: string }) {
  // Heavily stripped down version of the badge;
  // doesn't support live status or link to details.
  const message = "Status"
  const color = "blue"
  const badgeUrl = `https://img.shields.io/badge/${props.name}-${message}-${color}`

  return <img src={badgeUrl} alt={props.name + " " + message} className="shield" />
}

export function AmendmentDisclaimer(props: {
  // Heavily stripped-down version of the disclaimer used on XRPL.org;
  // this one doesn't fetch live amendment status or support translation.
  name: string,
  compact: boolean,
  statusOnly: boolean,
  mode: string
}) {
  const amendmentName = props.compact ? props.name : props.name+" amendment"

  if (props.statusOnly) {
    return (
      <AmendmentBadge name={props.name} />
    )
  }

  if (props.compact) {
    return (
      <>
        {amendmentName}
        {" "}
        <AmendmentBadge name={props.name} />
      </>
    )
  }

  if (props.mode === "updated") {
    return (
      <p><em>Updated by the
      (
        {amendmentName}
        {". "}
        <AmendmentBadge name={props.name} />
      )</em></p>
    )
  }
  
  return (
    <p><em>Requires the (
      {amendmentName}
      {". "}
      <AmendmentBadge name={props.name} />
    )</em></p>
  )
}

export function amendmentDisclaimerForLlms(node: Node): string {
  const {
    name,
    compact,
    statusOnly,
    mode } = node.attributes

  if (statusOnly || compact) {
    return `_${name}_`
  }
  if (mode == "Updated") {
    return `_Updated by the ${name} amendment._`
  }
  return `_Requires the ${name} amendment._`
}
