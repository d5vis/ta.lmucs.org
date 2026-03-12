import Link from 'next/link'

const DOC_ID = '1bsez0RG6WlQ0DrGxtBAaXXmlmPKF0mH3MkK6r1UD0WY'
const EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`

interface Section {
  heading: string
  content: string[]
}

function parseSections(text: string): Section[] {
  // Remove BOM and trailing link/divider
  const cleaned = text
    .replace(/^\uFEFF/, '')
    .replace(/\r\n/g, '\n')
    .replace(/_{10,}[\s\S]*$/, '')
    .trim()

  // Split on double newlines to find sections
  const blocks = cleaned.split(/\n{2,}/)
  const sections: Section[] = []
  let current: Section | null = null

  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue

    // Headings are standalone lines with no leading whitespace, no list markers
    const isHeading =
      !trimmed.startsWith('*') &&
      !trimmed.startsWith(' ') &&
      !trimmed.match(/^\d+\./) &&
      trimmed.split('\n').length <= 2 &&
      !trimmed.includes('@')

    if (isHeading) {
      current = { heading: trimmed, content: [] }
      sections.push(current)
    } else if (current) {
      current.content.push(trimmed)
    }
  }

  return sections
}

function autoLinkText(text: string) {
  // Turn URLs into clickable links and emails into mailto links
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

function renderListBlock(block: string) {
  const lines = block.split('\n')
  const isOrdered = /^\d+\./.test(lines[0]?.trim() ?? '')

  const items: { text: string; indent: number }[] = lines
    .filter((l) => l.trim())
    .map((line) => {
      const indent = line.search(/\S/)
      const text = line.replace(/^\s*(\d+\.\s*|\*\s*)/, '').trim()
      return { text, indent }
    })

  // Group into top-level items with sub-items
  const grouped: { text: string; children: string[] }[] = []
  for (const item of items) {
    if (item.indent <= 0) {
      grouped.push({ text: item.text, children: [] })
    } else if (grouped.length > 0) {
      grouped[grouped.length - 1].children.push(item.text)
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
          {autoLinkText(item.text)}
          {item.children.length > 0 && (
            <ul className="list-disc list-inside ml-8 mt-1 space-y-1 text-md">
              {item.children.map((child, j) => (
                <li key={j}>{autoLinkText(child)}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ListTag>
  )
}

function sectionHeadingColor(heading: string) {
  const lower = heading.toLowerCase()
  if (lower.includes('problem') || lower.includes('avoid')) {
    return 'text-lmucrimson'
  }
  return 'text-lmublue'
}

export default async function Posters() {
  let text = ''
  try {
    const response = await fetch(EXPORT_URL, {
      redirect: 'follow',
      cache: 'no-store',
    })
    text = await response.text()
  } catch (error) {
    console.error('[Posters] Fetch failed:', error)
  }
  const sections = parseSections(text)

  // Skip the first section (title)
  const displaySections = sections.slice(1)

  return (
    <div className="motion-preset-blur-up w-full h-full flex flex-col lg:flex-row items-start justify-center gap-4 px-8 py-6 text-left">
      <h1 className="text-left text-4xl lg:text-5xl transition-all w-full md:max-w-64 text-lmublue font-[family-name:var(--font-metric-bold)]">
        Poster Printing
      </h1>
      <div className="motion-blur-in flex flex-col w-full gap-6">
        {displaySections.map((section, i) => {
          return (
            <section key={i} className="flex flex-col gap-3">
              <h2
                className={`text-2xl font-[family-name:var(--font-metric-bold)] ${sectionHeadingColor(section.heading)}`}
              >
                {section.heading}
              </h2>
              {section.content.map((block, j) => {
                if (block.match(/^\d+\./) || block.startsWith('*')) {
                  return <div key={j}>{renderListBlock(block)}</div>
                }
                return (
                  <p key={j} className="text-md">
                    {autoLinkText(block)}
                  </p>
                )
              })}
            </section>
          )
        })}

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-[family-name:var(--font-metric-bold)] text-lmublue">
            Examples of Good Posters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <img
                key={n}
                src={`/images/posters/poster_example_${n}.png`}
                alt={`Poster example ${n}`}
                className="rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
              />
            ))}
          </div>
        </section>

        <div className="pt-2">
          <Link
            href="/print"
            className="text-lmublue hover:underline text-md"
          >
            ← Back to Printing
          </Link>
        </div>
      </div>
    </div>
  )
}
