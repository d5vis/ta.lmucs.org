export function generateGoogleDocsUrl(id: string): string {
  return `https://docs.google.com/document/d/${id}/edit?usp=sharing`;
}

export function generateGoogleDocsEmbedUrl(id: string): string {
  return `https://docs.google.com/document/d/${id}/pub?embedded=true`;
}
