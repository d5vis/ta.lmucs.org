import { Metadata } from 'next'
import MarkdownPreview from '@/components/resources/MarkdownPreview'

export const metadata: Metadata = { title: 'Printing | LMUCS' }

export default function Print() {
  return (
    <div className="flex flex-col">
      <MarkdownPreview
        title="Printing"
        url="https://ta-onboarding-next.vercel.app/api/markdown/printing"
      />
      <div className="px-8 pb-6 lg:pl-72">
        <a
          href="/print/list"
          className="inline-block text-md text-lmublue hover:underline hover:bg-accent/10 dark:hover:bg-accent/20 rounded px-2 py-1"
        >
          → View Spring 2026 SR PROJ poster list
        </a>
      </div>
    </div>
  )
}
