import { readFileSync } from 'fs'
import { join } from 'path'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default function LabRules() {
  const markdownPath = join(process.cwd(), 'src', 'markdown', 'lab_rules.md')
  const markdown = readFileSync(markdownPath, 'utf-8')

  return (
    <div className="motion-preset-blur-up w-full h-full flex flex-col lg:flex-row items-start justify-center gap-4 px-8 py-6 text-left">
      <h1 className="text-left text-4xl lg:text-5xl transition-all w-full md:max-w-64 text-lmublue font-[family-name:var(--font-metric-bold)]">
        Lab Rules
      </h1>
      <div className="motion-blur-in flex flex-col w-full gap-4">
        <Markdown
          rehypePlugins={[[rehypeRaw]]}
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl text-lmublue font-[family-name:var(--font-metric-bold)] mt-6 mb-2"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl text-lmublue font-[family-name:var(--font-metric-bold)] mt-5 mb-2"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-xl text-lmublue font-[family-name:var(--font-metric-bold)] mt-4 mb-2"
                {...props}
              />
            ),
            p: ({ node, ...props }) => <p className="text-md mb-3" {...props} />,
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside text-md mb-4 space-y-1" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside text-md mb-4 space-y-1" {...props} />
            ),
            li: ({ node, ...props }) => <li className="text-md ml-4" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-md text-lmublue hover:underline" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-[family-name:var(--font-metric-bold)]" {...props} />
            ),
          }}
        >
          {markdown}
        </Markdown>
      </div>
    </div>
  )
}
