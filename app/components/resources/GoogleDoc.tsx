'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  generateGoogleDocsEmbedUrl,
  generateGoogleDocsUrl,
} from '@/app/utils/googleDocs'

interface GoogleDocProps {
  documentId: string
  title: string
}

export default function GoogleDoc(props: GoogleDocProps) {
  const [isPortrait, setIsPortrait] = useState(false)
  const [iframeDimensions, setIframeDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth)
      setIframeDimensions({
        width: window.innerWidth * 0.75,
        height: window.innerHeight * 0.73,
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (isPortrait) {
      window.location.replace(generateGoogleDocsUrl(props.documentId))
    }
  }, [isPortrait, props.documentId])

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center gap-4 rounded-2xl p-8">
      <iframe
        className="dark:invert dark:hue-rotate-[170deg] dark:brightness-[0.88] dark:saturate-[0.5] border border-dashed border-border dark:border-gray-300 rounded-xl"
        src={generateGoogleDocsEmbedUrl(props.documentId)}
        title={props.title}
        width={iframeDimensions.width}
        height={iframeDimensions.height}
      ></iframe>
    </Card>
  )
}
