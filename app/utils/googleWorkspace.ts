export function generateGoogleDocsUrl(id: string): string {
  return `https://docs.google.com/document/d/${id}/edit?usp=sharing`
}

export function generateGoogleDocsEmbedUrl(id: string): string {
  return `https://docs.google.com/document/d/${id}/pub?embedded=true`
}

export function generateGoogleSlidesEmbedUrl(id: string): string {
  return `https://docs.google.com/presentation/d/e/${id}/embed?start=false&loop=false&delayms=3000`
}
