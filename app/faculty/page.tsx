import GoogleSlides from '@/components/resources/GoogleSlides'

const RESOURCE_DOCUMENT_ID =
  '2PACX-1vTdyFvGRqePNnh7nR4xhPoj1M95dK-fObFws4riRT3lGSzR3T4PGrqnKKbiL0LE9XEiwQEBlq7tWQR3'

export default function Resources() {
  return <GoogleSlides documentId={RESOURCE_DOCUMENT_ID} title="Faculty" />
}
