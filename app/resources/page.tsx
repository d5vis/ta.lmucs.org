import GoogleDocPage from '@/components/resources/GoogleDocPage'

const DOC_ID = '1PkUHhsyFGwRSkPc7IIz5VpnajxFUeePNDSOxLczobqk'

export default async function Resources() {
  return (
    <GoogleDocPage
      title="Resources"
      docId={DOC_ID}
      skipFirstSection={false}
      parentHeadings={[
        'Tips from the CS Professors',
        'Public Learning Resources',
        'University Resources',
        'Department Resources',
      ]}
    />
  )
}
