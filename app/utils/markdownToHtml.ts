export function markdownToHtml(markdown: string): string {
  let html = markdown

  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>')
  html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>')
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>')
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
  html = html.replace(
    /^# (.*$)/gm,
    '<h1 className="text-lmublue text-5xl">$1</h1>'
  )

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

  html = html.replace(/_(.*?)_/g, '<em>$1</em>')

  html = html.replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  html = html.replace(/^\s*-\s+(.*$)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')

  html = html.replace(/^\s*\d+\.\s+(.*$)/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>')

  //   html = html.replace(
  //     /^\s*(?!<(h\d|ul|ol|li|p|img|blockquote|pre|code|span|div|a))(.+)$/gm,
  //     '<p>$1</p>'
  //   )

  html = html.replace(/\n/g, '')

  return html
}
