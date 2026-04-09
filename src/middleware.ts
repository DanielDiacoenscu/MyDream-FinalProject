import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  // You can add logic here to allow your own IP address to bypass maintenance
  if (isMaintenanceMode) {
    // Redirect to a maintenance page or return a custom response
    return new NextResponse(
      JSON.stringify({ message: 'Site is under maintenance. Please check back later.' }),
      { status: 503, headers: { 'content-type': 'application/json' } }
    )
  }

  return NextResponse.next()
}

// Optional: Configure which paths the middleware runs on
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
