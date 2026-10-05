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

type Amendment = {
  name: string
  rippled_version: string
  tx_hash?: string
  consensus?: string
  date?: string
  id: string
  eta?: string
  deprecated: boolean
}

type AmendmentsResponse = {
  amendments: Amendment[]
}

// Fetch a single amendments endpoint (vote or info).
async function fetchAmendmentList(endpoint: string): Promise<Amendment[]> {
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} from ${endpoint}`)
  }
  const data: AmendmentsResponse = await response.json()
  return data.amendments
}

const mainnetVoteEndpoint = 'https://vhs.prod.ripplex.io/v1/network/amendments/vote/main/'
const devnetVoteEndpoint = 'https://vhs.prod.ripplex.io/v1/network/amendments/vote/dev/'

type AmendmentStatus = {
  statusName: string,
  statusMessage: string,
  statusColor: string
}
async function getAmendmentStatus(name: string): Promise<AmendmentStatus> {
  const [devnetInfo, mainnetInfo] = await Promise.all([
    fetchAmendmentList(devnetVoteEndpoint),
    fetchAmendmentList(mainnetVoteEndpoint),
  ])
  const mainnetStatus = mainnetInfo.find(a => a.name === name)
  if (mainnetStatus) {
    if (mainnetStatus.tx_hash) return {
      statusName: "Mainnet",
      statusMessage: "Enabled",
      statusColor: "green"
    }
    if (mainnetStatus.eta || mainnetStatus.consensus) return {
      statusName: "Mainnet",
      statusMessage: "Voting",
      statusColor: "80d0e0"
    }
  }
  const devnetStatus = devnetInfo.find(a => a.name === name)
  if (devnetStatus) {
    if (devnetStatus.tx_hash) return {
      statusName: "Devnet",
      statusMessage: "Available",
      statusColor: "blue"
    }
  }
  return {
    // If it's not at least enabled on Devnet, assume that it at least
    // has an XLS. (It should, if we're using an amendmend disclaimer.)
    // But that could be misleading if amendment name has a typo.
    statusName: "XLS",
    statusMessage: "Specified",
    statusColor: "lightgray"
  }
}

function AmendmentBadge(props: { name: string }) {
  // Pared-down version of the amendment status badge, which only shows
  // the statuses from getAmendmentStatus above and not as much detail as
  // the version from xrpl.org, but it does check Devnet status.
  const [status, setStatus] = React.useState<string>('Loading')
  const [message, setMessage] = React.useState<string>('...')
  const [color, setColor] = React.useState<string>('gray')

  React.useEffect(() => {
    getAmendmentStatus(props.name).then( aStatus => {
      setStatus(aStatus.statusName)
      setMessage(aStatus.statusMessage)
      setColor(aStatus.statusColor)
    })
  }, [status,message,color])

  const href = `https://img.shields.io/badge/${shieldsIoEscape(status)}-${shieldsIoEscape(message)}-${color}`
  const altText = `${status}: ${message}`

  return <img src={href} alt={altText} className="shield" />
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
        {amendmentName} <AmendmentBadge name={props.name} />
      </>
    )
  }

  if (props.mode === "updated") {
    return (
      <p><em>
        (Updated by the {amendmentName}. <AmendmentBadge name={props.name} />)
      </em></p>
    )
  }
  
  return (
    <p><em>
      (Requires the {amendmentName}. <AmendmentBadge name={props.name} />)
    </em></p>
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
