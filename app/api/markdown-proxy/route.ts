export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'Missing "url" query parameter' }, { status: 400 })
  }

  try {
    const res = await fetch(url)
    const text = await res.text()
    return new Response(text, {
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 })
  }
}
