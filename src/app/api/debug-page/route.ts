import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'contact-us';

  const base = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const url = `${base}/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    const text = await res.text();

    return NextResponse.json({
      env: { NEXT_PUBLIC_STRAPI_API_URL: base },
      request: { slug, url },
      fetch: { ok: res.ok, status: res.status },
      raw: text.slice(0, 2000),
    });
  } catch (e: any) {
    return NextResponse.json(
      { env: { NEXT_PUBLIC_STRAPI_API_URL: base }, request: { slug, url }, error: String(e) },
      { status: 500 }
    );
  }
}
