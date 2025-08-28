import type { MetadataRoute } from 'next'
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LMUCS',
    short_name: 'LMUCS',
    description: 'Loyola Marymount University Computer Science',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f5f5',
    theme_color: '#f5f5f5',
    icons: [
      {
        src: '/logo192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
