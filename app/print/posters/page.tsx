import GoogleDocPage from '@/components/resources/GoogleDocPage'

const DOC_ID = '1bsez0RG6WlQ0DrGxtBAaXXmlmPKF0mH3MkK6r1UD0WY'

function sectionHeadingColor(heading: string) {
  const lower = heading.toLowerCase()
  if (lower.includes('problem') || lower.includes('avoid')) {
    return 'text-lmucrimson'
  }
  return 'text-lmublue'
}

function filterContent(content: string) {
  const filtered = content.split('\n').filter(
    (line) => !line.trim().match(/^\*?\s*Examples of Good Posters$/i)
  ).join('\n').trim()
  return filtered
}

const posterImages = (
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
)

export default async function Posters() {
  return (
    <GoogleDocPage
      title="Poster Printing"
      docId={DOC_ID}
      sectionHeadingColor={sectionHeadingColor}
      filterContent={filterContent}
      extraSections={posterImages}
      backLink={{ href: '/print', label: '← Back to Printing' }}
      boldTopLevel
      boldCaps
    />
  )
}
