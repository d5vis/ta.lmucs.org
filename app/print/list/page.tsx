import { Metadata } from 'next'
import { POSTERS_FOLDER_URL, POSTERS_TREE, POSTERS_TREE_FETCHED_AT, type DriveNode } from './posters-tree'

export const metadata: Metadata = { title: 'Poster List | LMUCS' }

function formatBytes(bytes?: number): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function countFiles(node: DriveNode): number {
  if (node.type === 'file') return 1
  return node.children.reduce((sum, child) => sum + countFiles(child), 0)
}

function sortedChildren(children: DriveNode[]): DriveNode[] {
  return [...children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
  })
}

function NodeView({ node }: { node: DriveNode }) {
  if (node.type === 'file') {
    return (
      <li className="ml-4 py-0.5">
        <a
          href={node.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lmublue hover:underline hover:bg-accent/10 dark:hover:bg-accent/20 rounded px-1 py-0.5"
        >
          {node.title}
        </a>
        {node.fileSize ? (
          <span className="text-xs text-gray-500 ml-2">{formatBytes(node.fileSize)}</span>
        ) : null}
      </li>
    )
  }

  const fileCount = countFiles(node)
  return (
    <li className="ml-2 py-1">
      <details open className="group">
        <summary className="cursor-pointer list-none flex items-center gap-2 hover:bg-accent/10 dark:hover:bg-accent/20 rounded px-1 py-0.5">
          <span className="inline-block transition-transform group-open:rotate-90 text-gray-500 select-none">
            ▶
          </span>
          <span className="font-[family-name:var(--font-metric-bold)] text-lmublue">
            {node.title}
          </span>
          <span className="text-xs text-gray-500">
            ({fileCount} {fileCount === 1 ? 'file' : 'files'})
          </span>
        </summary>
        <ul className="border-l border-gray-200 dark:border-gray-700 ml-3 mt-1">
          {sortedChildren(node.children).map((child) => (
            <NodeView key={child.id} node={child} />
          ))}
        </ul>
      </details>
    </li>
  )
}

export default function PrintList() {
  const totalFiles = countFiles(POSTERS_TREE)
  return (
    <div className="motion-preset-blur-up w-full h-full flex flex-col lg:flex-row items-start justify-center gap-4 px-8 py-6 text-left">
      <h1 className="text-left text-4xl lg:text-5xl transition-all w-full md:max-w-64 text-lmublue font-[family-name:var(--font-metric-bold)]">
        Poster List
      </h1>
      <div className="motion-blur-in flex flex-col w-full gap-4">
        <p className="text-md">
          Recursive listing of{' '}
          <a
            href={POSTERS_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lmublue hover:underline"
          >
            2026 Spring SR PROJ Posters
          </a>{' '}
          on Google Drive — {totalFiles} files total. Snapshot from {POSTERS_TREE_FETCHED_AT}.
        </p>
        <ul className="text-md">
          <NodeView node={POSTERS_TREE} />
        </ul>
        <div className="pt-2">
          <a href="/print" className="text-lmublue hover:underline text-md">
            ← Back to Printing
          </a>
        </div>
      </div>
    </div>
  )
}
