import { Metadata } from 'next'
import MarkdownPreview from '@/components/resources/MarkdownPreview'

export const metadata: Metadata = { title: 'Printing | LMUCS' }

export default function Print() {
  return (
    <MarkdownPreview
      title="Printing"
      url="https://ta-onboarding-next.vercel.app/api/markdown/printing"
    />
  )
}
