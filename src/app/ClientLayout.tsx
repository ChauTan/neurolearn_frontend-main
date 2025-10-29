'use client';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ModalContainer from '@/components/auth/ModalContainer';
import { ModalProvider } from '@/context/ModalContext';
import '@/lib/fontawesome';
import { Suspense, useEffect, useRef } from 'react';
import Loading from '@/components/common/Loading';
import {
  LazyMotion,
  domAnimation,
  AnimatePresence,
  m,
  MotionConfig,
  useReducedMotion,
} from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { setAuthState } from '@/lib/redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useLoadUserQuery } from '@/lib/redux/features/api/apiSlice';
import { useSocialAuthMutation } from '@/lib/redux/features/auth/authApi';

export default function ClientLayout({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const reduce = useReducedMotion();
  const { data: session, status } = useSession();
  const { data: me, refetch } = useLoadUserQuery(undefined, {
    skip: status !== 'authenticated',
    refetchOnFocus: true,
    refetchOnReconnect: true,
  }) as any;
  const [socialAuth] = useSocialAuthMutation();
  const didBridge = useRef(false);

  useEffect(() => {
    // Only clear auth when explicitly unauthenticated. Do not clear during 'loading'.
    if (status === 'unauthenticated') {
      dispatch(setAuthState({ token: null, user: null, isAuthenticated: false }));
      didBridge.current = false;
      return;
    }

    if (status !== 'authenticated') {
      // status === 'loading' → keep current Redux auth to prevent flicker
      return;
    }

    // 1) Đẩy session vào Redux để UI có gì đó ngay (role tạm)
    if (session?.user) {
      dispatch(setAuthState({
        token: (session as any).accessToken ?? null,
        user: {
          _id: (session.user as any).id ?? '',
          name: session.user.name ?? '',
          email: session.user.email ?? '',
          role: 'user',
          avatar: session.user.image ? { url: session.user.image } : undefined,
        },
        isAuthenticated: true,
      }));
    }

    // 2) Chạy bridge 1 lần → BE set cookie → refetch /me
    if (!didBridge.current) {
      didBridge.current = true;
      (async () => {
        try {
          await socialAuth({
            email: session?.user?.email,
            name: session?.user?.name,
            avatar: session?.user?.image,
          }).unwrap();
        } catch {
          // ignore, vẫn refetch thử
        } finally {
          await refetch(); // ⬅️ Quan trọng: gọi lại ngay sau khi (có thể) đã có cookie
        }
      })();
    }

    // 3) Khi /me có dữ liệu thật (có role), override Redux
    if (me?.user) {
      const u = me.user;
      dispatch(setAuthState({
        token: (session as any)?.accessToken ?? null,
        user: {
          _id: u.id ?? u._id ?? '',
          name: u.name ?? '',
          email: u.email ?? '',
          role: u.role ?? 'user',
          avatar: u?.avatar?.url ? { url: u.avatar.url } : undefined,
        },
        isAuthenticated: true,
      }));
    }
  }, [status, session, me, refetch, socialAuth, dispatch]);

  return (
    <ModalProvider>
      <div className="relative bg-gray-50 min-h-screen z-10">
        {/* Background cố định, không effect màu */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 w-[clamp(800px,100vw,1172px)] h-[clamp(320px,60vw,467px)] top-[clamp(-200px,-20vw,-234px)] -z-10 rounded-b-[100%]"
          style={{
            background:
              'radial-gradient(58.94% 105.86% at 50% -5.86%, #5B78FF 0%, #F7F8FA 100%)',
          }}
        />

        <Header />

        <div className="relative max-w-7xl mx-auto">
          <LazyMotion features={domAnimation}>
            <MotionConfig
              reducedMotion="user"
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                    type: 'spring',
                    stiffness: 520, // snappy như iOS
                    damping: 42,
                    mass: 0.7,
                  }
              }
            >
              {/* Bọc cả Suspense để tránh nháy */}
              <AnimatePresence mode="sync" initial={false}>
                <Suspense
                  key={pathname}
                  fallback={
                    <m.div
                      key="loader"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className=""
                    >
                      <Loading />
                    </m.div>
                  }
                >
                  {children}

                </Suspense>
              </AnimatePresence>
            </MotionConfig>
          </LazyMotion>
        </div>

        <Footer />
      </div>

      <ModalContainer />
    </ModalProvider>
  );
}