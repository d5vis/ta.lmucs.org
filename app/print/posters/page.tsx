import { Metadata } from 'next'
import Image from 'next/image'
import GoogleDocPage from '@/components/resources/GoogleDocPage'

export const metadata: Metadata = { title: 'Poster Printing | LMUCS' }

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

// Pixel sizes of public/images/posters/poster_example_1.png to _8.png, which next/image needs up front.
const POSTER_EXAMPLE_SIZES = [
  [2048, 1537],
  [2048, 1541],
  [1593, 1194],
  [1593, 1192],
  [1593, 1197],
  [1596, 1201],
  [2048, 1511],
  [2048, 1493],
]

const posterImages = (
  <section className="flex flex-col gap-3">
    <h2 className="text-2xl font-[family-name:var(--font-metric-bold)] text-lmublue">
      Examples of Good Posters
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {POSTER_EXAMPLE_SIZES.map(([width, height], index) => (
        <Image
          key={index}
          src={`/images/posters/poster_example_${index + 1}.png`}
          alt={`Poster example ${index + 1}`}
          width={width}
          height={height}
          sizes="(min-width: 640px) 50vw, 100vw"
          className="h-auto w-full rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
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
