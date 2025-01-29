'use client'
import { useEffect, useState } from 'react'
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
    <div className="motion-blur-in w-full h-full flex flex-col lg:flex-row items-start justify-center gap-6 px-8 py-6">
      <h1 className="text-left text-5xl w-full md:max-w-64 text-lmublue font-[family-name:var(--font-metric-bold)]">
        {props.title}
      </h1>
      <iframe
        className="dark:invert dark:hue-rotate-[170deg] dark:brightness-[0.88] dark:saturate-[0.5] w-full border border-dashed border-border dark:border-gray-300 bg-white rounded-2xl"
        src={generateGoogleDocsEmbedUrl(props.documentId)}
        title={props.title}
        width={iframeDimensions.width}
        height={iframeDimensions.height}
      ></iframe>
    </div>
  )
}
