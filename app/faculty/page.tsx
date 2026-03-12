import { Metadata } from 'next'
import GoogleSlides from '@/components/resources/GoogleSlides'

export const metadata: Metadata = { title: 'Faculty | LMUCS' }

const RESOURCE_DOCUMENT_ID =
  '2PACX-1vTdyFvGRqePNnh7nR4xhPoj1M95dK-fObFws4riRT3lGSzR3T4PGrqnKKbiL0LE9XEiwQEBlq7tWQR3'

export default function Resources() {
  return <GoogleSlides documentId={RESOURCE_DOCUMENT_ID} title="Faculty" />
}
