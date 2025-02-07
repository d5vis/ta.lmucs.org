'use client'
import { useEffect, useState } from 'react'
import { generateGoogleSlidesEmbedUrl } from '@/app/utils/googleWorkspace'

interface GoogleSlidesProps {
  documentId: string
  title: string
}

export default function GoogleSlides(props: GoogleSlidesProps) {
  const [iframeDimensions, setIframeDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const handleResize = () => {
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

  return (
    <div className="motion-preset-blur-up w-full h-full flex flex-col lg:flex-row items-start justify-center gap-6 px-8 py-6">
      <h1 className="text-left text-5xl w-full md:max-w-64 text-lmublue font-[family-name:var(--font-metric-bold)]">
        {props.title}
      </h1>
      <iframe
        className="dark:invert dark:hue-rotate-[170deg] dark:brightness-[0.88] dark:saturate-[0.5] w-full border border-dashed border-border dark:border-gray-300 bg-white rounded-2xl"
        src={generateGoogleSlidesEmbedUrl(props.documentId)}
        title={props.title}
        width={iframeDimensions.width}
        height={iframeDimensions.height}
      ></iframe>
    </div>
  )
}
