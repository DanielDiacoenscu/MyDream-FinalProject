import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug') || 'contact-us';

  const base = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const url = `${base}/api/pages?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[content][populate]=*`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    const json = await res.json();

    return NextResponse.json({
      status: res.status,
      page: json.data?.[0] || null,
      contentComponents: json.data?.[0]?.content?.map((c: any) => c.__component) || [],
    });
  } catch (e: any) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
