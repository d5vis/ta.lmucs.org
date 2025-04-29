'use client'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

const CORS_PROXY_URL = 'https://corsproxy.io/?url='

const MarkdownPreview = ({ title, url }: { title: string; url: string }) => {
  const [markdown, setMarkdown] = useState<string>('')

  useEffect(() => {
    const fetchMarkdown = async () => {
      await fetch(CORS_PROXY_URL + url)
        .then(response => response.text())
        .then(text => setMarkdown(text))
    }
    fetchMarkdown()
  }, [])

  return (
    <div className="motion-preset-blur-up w-full h-full flex flex-col lg:flex-row items-start justify-center gap-4 px-8 py-6 text-left">
      <h1 className="text-left text-4xl lg:text-5xl transition-all w-full md:max-w-64 text-lmublue font-[family-name:var(--font-metric-bold)]">
        {title}
      </h1>
      {markdown ? (
        <div className="motion-blur-in flex flex-col w-full gap-2">
          <Markdown
            rehypePlugins={[[rehypeRaw]]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl text-lmublue font-[family-name:var(--font-metric-bold)]"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl text-lmublue font-[family-name:var(--font-metric-bold)]"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl text-lmublue font-[family-name:var(--font-metric-bold)]"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => <p className="text-md" {...props} />,
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside text-md" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside text-md" {...props} />
              ),
              li: ({ node, ...props }) => <li className="text-md" {...props} />,
              a: ({ node, ...props }) => (
                <a className="text-md text-lmublue" {...props} />
              ),
            }}
          >
            {markdown}
          </Markdown>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col gap-2 py-2">
          <div className="w-full h-8 rounded-xl p-2 bg-gray-200" />
          <div className="w-full h-8 rounded-xl p-2 bg-gray-200" />
          <div className="w-full h-8 rounded-xl p-2 bg-gray-200" />
          <div className="w-full h-8 rounded-xl p-2 bg-gray-200" />
          <div className="w-[80%] h-8 rounded-xl p-2 bg-gray-200" />
        </div>
      )}
    </div>
  )
}

export default MarkdownPreview
