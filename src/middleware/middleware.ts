// middleware.ts (hoặc src/middleware.ts)
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // đừng chặn các route auth của NextAuth
  if (req.nextUrl.pathname.startsWith('/api/auth')) return NextResponse.next();

  // chỉ kiểm tra session NextAuth — cookie BE ở domain/port khác sẽ không đọc được trong middleware
  const session = await getToken({ req }); // uses NEXTAUTH_SECRET from env

  if (!session) {
    const url = new URL('/', req.url);
    // optional: nhớ đường cũ để quay lại sau khi login
    url.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/instructor/:path*', '/business/:path*', '/profile/:path*'],
};
