'use client'

import { useState } from 'react'
import { Link2, Share2, ExternalLink } from 'lucide-react'

interface ShareBarProps {
  url: string
  title: string
  accentColor?: string
}

export default function ShareBar({ url, title, accentColor = '#a855f7' }: ShareBarProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function handleTwitter() {
    const text = encodeURIComponent(`${title} — check this out on Stagefront`)
    const shareUrl = encodeURIComponent(url)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank')
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  const btnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: copied ? accentColor : '#94a3b8',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    transition: 'color 0.15s, border-color 0.15s',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <button
        onClick={handleCopy}
        style={{ ...btnStyle, color: copied ? accentColor : '#94a3b8' }}
        title="Copy link"
      >
        <Link2 style={{ width: 13, height: 13 }} />
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      <button
        onClick={handleTwitter}
        style={btnStyle}
        title="Share on X / Twitter"
      >
        <ExternalLink style={{ width: 13, height: 13 }} />
        <span className="hidden sm:inline">Share</span>
      </button>

      <button
        onClick={handleShare}
        style={btnStyle}
        title="Share"
      >
        <Share2 style={{ width: 13, height: 13 }} />
      </button>
    </div>
  )
}
