import React, { ReactNode } from 'react'

interface Section {
  heading: string
  content: string[]
}

function isHeadingLine(line: string): boolean {
  const t = line.trim()
  if (!t) return false
  // Must not contain a colon followed by content (key: value pattern)
  const hasKeyValue = /:.+/.test(t)
  return (
    t.length <= 50 &&
    !hasKeyValue &&
    !t.match(/https?:\/\//) &&
    !t.includes('@') &&
    !t.startsWith('*') &&
    !t.startsWith(' ') &&
    !t.match(/^\d+\./) &&
    !t.endsWith('.') &&
    !t.endsWith('!') &&
    !t.endsWith('?') &&
    !t.endsWith(':') &&
    !t.endsWith(')') &&
    !t.startsWith('(')
  )
}

function isHeadingBlock(trimmed: string): boolean {
  const isSingleLine = trimmed.split('\n').length <= 2
  const isShort = trimmed.length <= 80
  const hasNoUrl = !trimmed.match(/https?:\/\//)
  const hasNoEmail = !trimmed.includes('@')
  const isNotList = !trimmed.startsWith('*') && !trimmed.startsWith(' ') && !trimmed.match(/^\d+\./)
  const isNotSentence = !trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?') && !trimmed.endsWith(':')
  return isSingleLine && isShort && hasNoUrl && hasNoEmail && isNotList && isNotSentence
}

export function parseSections(text: string): Section[] {
  const cleaned = text
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/_{10,}[\s\S]*$/, '')
    .trim()

  // Split on double newlines first, then further split multi-line blocks
  // on embedded heading-like lines (short, standalone, no URL/email/list markers)
  const rawBlocks = cleaned.split(/\n{2,}/)
  const blocks: string[] = []
  for (const raw of rawBlocks) {
    const lines = raw.split('\n')
    if (lines.length <= 2) {
      blocks.push(raw)
      continue
    }
    // Scan for embedded headings within multi-line blocks
    let buffer: string[] = []
    for (const line of lines) {
      if (isHeadingLine(line)) {
        if (buffer.length > 0) {
          blocks.push(buffer.join('\n'))
          buffer = []
        }
        blocks.push(line)
      } else {
        buffer.push(line)
      }
    }
    if (buffer.length > 0) {
      blocks.push(buffer.join('\n'))
    }
  }

  const sections: Section[] = []
  let current: Section | null = null

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue

    if (isHeadingBlock(trimmed)) {
      current = { heading: trimmed, content: [] }
      sections.push(current)
    } else if (current) {
      current.content.push(trimmed)
    }
  }

  return sections
}

export function autoLinkText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)
  return parts.map((part, i) => {
    if (part.match(/^https?:\/\//)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lmublue hover:underline"
        >
          {part}
        </a>
      )
    }
    if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-lmublue hover:underline">
          {part}
        </a>
      )
    }
    return part
  })
}

function boldAllCaps(text: string, keyPrefix: number) {
  const parts = text.split(/(\b[A-Z][A-Z]+\b)/g)
  return parts.map((part, j) => {
    if (/^[A-Z]{2,}$/.test(part)) {
      return <strong key={`${keyPrefix}-${j}`}>{part}</strong>
    }
    return part
  })
}

export function autoLinkTextWithBoldCaps(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)
  return parts.map((part, i) => {
    if (part.match(/^https?:\/\//)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lmublue hover:underline"
        >
          {part}
        </a>
      )
    }
    if (part.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-lmublue hover:underline">
          {part}
        </a>
      )
    }
    return boldAllCaps(part, i)
  })
}

export function renderListBlock(block: string, textRenderer: (text: string) => React.ReactNode[] = autoLinkText) {
  const lines = block.split('\n')
  const isOrdered = /^\d+\./.test(lines[0]?.trim() ?? '')

  const items: { text: string; indent: number }[] = lines
    .filter((l) => l.trim())
    .map((line) => {
      const indent = line.search(/\S/)
      const text = line.replace(/^\s*(\d+\.\s*|\*\s*)/, '').trim()
      return { text, indent }
    })

  const grouped: { text: string; indent: number; children: { text: string; indent: number; children: string[] }[] }[] = []
  for (const item of items) {
    if (item.indent <= 0) {
      grouped.push({ text: item.text, indent: item.indent, children: [] })
    } else if (grouped.length > 0) {
      const parent = grouped[grouped.length - 1]
      const lastChild = parent.children[parent.children.length - 1]
      if (lastChild && item.indent > lastChild.indent) {
        lastChild.children.push(item.text)
      } else {
        parent.children.push({ text: item.text, indent: item.indent, children: [] })
      }
    }
  }

  const ListTag = isOrdered ? 'ol' : 'ul'
  const listClass = isOrdered
    ? 'list-decimal list-inside text-md space-y-3'
    : 'list-disc list-inside text-md space-y-2 ml-4'

  return (
    <ListTag className={listClass}>
      {grouped.map((item, i) => (
        <li key={i} className="ml-4 text-md">
          {textRenderer(item.text)}
          {item.children.length > 0 && (
            <ul className="list-disc list-inside ml-8 mt-1 space-y-1 text-md">
              {item.children.map((child, j) => (
                <li key={j}>
                  {textRenderer(child.text)}
                  {child.children.length > 0 && (
                    <ul className="list-disc list-inside ml-8 mt-1 space-y-1 text-md">
                      {child.children.map((grandchild, k) => (
                        <li key={k}>{textRenderer(grandchild)}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ListTag>
  )
}

export async function fetchGoogleDoc(docId: string): Promise<string> {
  const url = `https://docs.google.com/document/d/${docId}/export?format=txt`
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      cache: 'no-store',
    })
    return await response.text()
  } catch (error) {
    console.error('[GoogleDocPage] Fetch failed:', error)
    return ''
  }
}

interface GoogleDocPageProps {
  title: string
  docId: string
  skipFirstSection?: boolean
  sectionHeadingColor?: (heading: string) => string
  filterContent?: (content: string) => string
  extraSections?: ReactNode
  backLink?: { href: string; label: string }
  boldTopLevel?: boolean
  boldCaps?: boolean
  parentHeadings?: string[]
}

export default async function GoogleDocPage({
  title,
  docId,
  skipFirstSection = true,
  sectionHeadingColor,
  filterContent,
  extraSections,
  backLink,
  boldTopLevel = false,
  boldCaps = false,
  parentHeadings = [],
}: GoogleDocPageProps) {
  const text = await fetchGoogleDoc(docId)
  let sections = parseSections(text)

  if (skipFirstSection) {
    sections = sections.slice(1)
  }

  const getHeadingColor = sectionHeadingColor ?? (() => 'text-lmublue')
  const renderText = boldCaps ? autoLinkTextWithBoldCaps : autoLinkText

  return (
    <div className="motion-preset-blur-up w-full h-full flex flex-col lg:flex-row items-start justify-center gap-4 px-8 py-6 text-left">
      <h1 className="text-left text-4xl lg:text-5xl transition-all w-full md:max-w-64 text-lmublue font-[family-name:var(--font-metric-bold)]">
        {title}
      </h1>
      <div className="motion-blur-in flex flex-col w-full gap-6">
        {sections.map((section, i) => {
          const isParent = parentHeadings.length > 0 &&
            parentHeadings.some(h => section.heading.toLowerCase().includes(h.toLowerCase()))
          return (
          <section key={i} className={`flex flex-col gap-3 ${isParent ? 'mt-4' : ''}`}>
            {isParent ? (
              <h2
                className="text-3xl font-[family-name:var(--font-metric-bold)] text-lmucrimson"
              >
                {section.heading}
              </h2>
            ) : (
              <h3
                className={`text-xl font-[family-name:var(--font-metric-bold)] ${getHeadingColor(section.heading)}`}
              >
                {section.heading}
              </h3>
            )}
            {section.content.map((block, j) => {
              const processed = filterContent ? filterContent(block) : block
              if (!processed) return null
              if (processed.match(/^\d+\./) || processed.startsWith('*')) {
                return (
                  <div key={j} className={boldTopLevel ? '[&>ol>li]:font-bold [&>ol>li>ul]:font-normal [&>ul>li]:font-bold [&>ul>li>ul]:font-normal' : ''}>
                    {renderListBlock(processed, renderText)}
                  </div>
                )
              }
              return (
                <p key={j} className="text-md">
                  {renderText(processed)}
                </p>
              )
            })}
          </section>
          )
        })}

        {extraSections}

        {backLink && (
          <div className="pt-2">
            <a href={backLink.href} className="text-lmublue hover:underline text-md">
              {backLink.label}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
